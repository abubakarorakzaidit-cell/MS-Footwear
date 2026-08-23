import asyncHandler from "express-async-handler";
import slugify from "slugify";
import Product from "../models/Product.js";
import { uploadImages, deleteImages } from "../services/imagekitService.js";

// @desc    Get all products (with search, filter, sort, pagination)
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, sort, featured, page = 1, limit = 12 } = req.query;

  const query = {};

  if (search) {
    query.$text = { $search: search };
  }
  if (category && category !== "All") {
    query.category = category;
  }
  if (featured === "true") {
    query.featured = true;
  }

  let sortOption = { createdAt: -1 }; // Newest by default
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "newest") sortOption = { createdAt: -1 };

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  const product = isObjectId ? await Product.findById(id) : await Product.findOne({ slug: id });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, product });
});

// @desc    Create a product (admin only)
// @route   POST /api/products
// @access  Private (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, originalPrice, category, stock, featured } = req.body;
  let { sizes } = req.body;

  if (typeof sizes === "string") {
    try {
      sizes = JSON.parse(sizes);
    } catch {
      sizes = sizes.split(",").map((s) => Number(s.trim()));
    }
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("At least one product image is required");
  }

  const uploaded = await uploadImages(req.files);

  let slug = slugify(name, { lower: true, strict: true });
  const existing = await Product.findOne({ slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-5)}`;
  }

  const product = await Product.create({
    name,
    slug,
    description,
    price,
    originalPrice: originalPrice || null,
    category,
    sizes,
    stock,
    images: uploaded,
    featured: featured === "true" || featured === true,
  });

  res.status(201).json({ success: true, product });
});

// @desc    Update a product (admin only)
// @route   PUT /api/products/:id
// @access  Private (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const { name, description, price, originalPrice, category, stock, featured } = req.body;
  let { sizes } = req.body;

  if (sizes && typeof sizes === "string") {
    try {
      sizes = JSON.parse(sizes);
    } catch {
      sizes = sizes.split(",").map((s) => Number(s.trim()));
    }
  }

  if (name && name !== product.name) {
    product.name = name;
    product.slug = `${slugify(name, { lower: true, strict: true })}-${Date.now().toString().slice(-5)}`;
  }

  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (originalPrice !== undefined) product.originalPrice = originalPrice || null;
  if (category) product.category = category;
  if (stock !== undefined) product.stock = stock;
  if (sizes) product.sizes = sizes;
  if (featured !== undefined) product.featured = featured === "true" || featured === true;

  // Add new images if provided (kept in addition to existing ones)
  if (req.files && req.files.length > 0) {
    const uploaded = await uploadImages(req.files);
    product.images.push(...uploaded);
  }

  await product.save();
  res.json({ success: true, product });
});

// @desc    Delete a product (admin only)
// @route   DELETE /api/products/:id
// @access  Private (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const fileIds = product.images.map((img) => img.fileId).filter(Boolean);
  await deleteImages(fileIds);
  await product.deleteOne();

  res.json({ success: true, message: "Product deleted successfully" });
});

// @desc    Remove a single image from a product (admin only)
// @route   DELETE /api/products/:id/images/:fileId
// @access  Private (admin)
export const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.images.length <= 1) {
    res.status(400);
    throw new Error("Product must have at least one image");
  }

  await deleteImages([req.params.fileId]);
  product.images = product.images.filter((img) => img.fileId !== req.params.fileId);
  await product.save();

  res.json({ success: true, product });
});
