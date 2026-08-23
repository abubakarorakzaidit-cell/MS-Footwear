import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import generateOrderNumber from "../utils/generateOrderNumber.js";

// @desc    Create a new order (no login required)
// @route   POST /api/orders
// @access  Public
export const createOrder = asyncHandler(async (req, res) => {
  const { customer, items, paymentMethod, notes } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("Order must contain at least one item");
  }

  // NEVER trust price/total from the frontend.
  // Re-fetch every product from the DB and compute totals server-side.
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${item.product}`);
    }

    if (!product.sizes.includes(Number(item.size))) {
      res.status(400);
      throw new Error(`Size ${item.size} is not available for ${product.name}`);
    }

    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

    if (product.stock < quantity) {
      res.status(400);
      throw new Error(`${product.name} does not have enough stock (available: ${product.stock})`);
    }

    const lineTotal = product.price * quantity;
    subtotal += lineTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || "",
      price: product.price,
      size: Number(item.size),
      quantity,
    });
  }

  const total = subtotal; // Extend here for shipping/tax if ever needed

  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    customer,
    items: orderItems,
    subtotal,
    total,
    paymentMethod,
    notes,
  });

  // Decrease stock for ordered items
  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    )
  );

  res.status(201).json({ success: true, order });
});

// @desc    Get order by ID or order number (used for confirmation page)
// @route   GET /api/orders/:id
// @access  Public (order number acts as an access token for the customer)
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

  const order = isObjectId
    ? await Order.findById(id)
    : await Order.findOne({ orderNumber: id });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, order });
});

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private (admin)
export const getOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status && status !== "All") {
    query.orderStatus = status;
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));

  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: orders.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    orders,
  });
});

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const validStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
  if (orderStatus) {
    if (!validStatuses.includes(orderStatus)) {
      res.status(400);
      throw new Error("Invalid order status");
    }
    order.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    if (!["Pending", "Paid", "Failed"].includes(paymentStatus)) {
      res.status(400);
      throw new Error("Invalid payment status");
    }
    order.paymentStatus = paymentStatus;
  }

  await order.save();
  res.json({ success: true, order });
});

// @desc    Delete an order (admin only)
// @route   DELETE /api/orders/:id
// @access  Private (admin)
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  await order.deleteOne();
  res.json({ success: true, message: "Order deleted successfully" });
});
