import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { fetchProductById, createProduct, updateProduct } from "../../services/productService";
import Loader from "../../components/Loader";

const categories = ["Men", "Women", "Kids", "Handmade", "Premium", "Classic"];
const availableSizes = [38, 39, 40, 41, 42, 43, 44, 45, 46];

const initialForm = {
  name: "",
  description: "",
  price: "",
  originalPrice: "",
  category: "Classic",
  stock: "",
  featured: false,
  sizes: [],
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    fetchProductById(id)
      .then((data) => {
        const p = data.product;
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          originalPrice: p.originalPrice || "",
          category: p.category,
          stock: p.stock,
          featured: p.featured,
          sizes: p.sizes,
        });
        setExistingImages(p.images);
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleSize = (size) => {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter((s) => s !== size) : [...f.sizes, size].sort((a, b) => a - b),
    }));
  };

  const handleFiles = (e) => {
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeNewFile = (idx) => setNewFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.sizes.length === 0) {
      setError("Select at least one size");
      return;
    }
    if (!isEdit && newFiles.length === 0) {
      setError("Upload at least one product image");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("originalPrice", form.originalPrice || "");
      fd.append("category", form.category);
      fd.append("stock", form.stock);
      fd.append("featured", form.featured);
      fd.append("sizes", JSON.stringify(form.sizes));
      newFiles.forEach((file) => fd.append("images", file));

      if (isEdit) {
        await updateProduct(id, fd);
      } else {
        await createProduct(fd);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading product..." fullPage />;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-xl font-bold text-ink">{isEdit ? "Edit Product" : "Add Product"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-line bg-white p-6">
        <div>
          <label className="label-text">Product Name *</label>
          <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
        </div>

        <div>
          <label className="label-text">Description *</label>
          <textarea
            name="description"
            required
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="input-field resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label-text">Price (Rs.) *</label>
            <input
              type="number"
              min="0"
              name="price"
              required
              value={form.price}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Original Price (Rs.)</label>
            <input
              type="number"
              min="0"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="label-text">Stock *</label>
            <input
              type="number"
              min="0"
              name="stock"
              required
              value={form.stock}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-text">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium text-ink">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="h-4 w-4 rounded accent-primary" />
              Mark as Featured
            </label>
          </div>
        </div>

        <div>
          <label className="label-text">Available Sizes *</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => toggleSize(s)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-sm font-medium transition-colors ${
                  form.sizes.includes(s)
                    ? "border-primary bg-primary text-white"
                    : "border-line text-ink hover:border-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {existingImages.length > 0 && (
          <div>
            <label className="label-text">Existing Images</label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, idx) => (
                <img key={idx} src={img.url} alt="" className="h-20 w-20 rounded-lg border border-line object-cover" />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="label-text">{isEdit ? "Add More Images" : "Product Images *"}</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line py-8 text-muted hover:border-primary hover:text-primary">
            <FiUploadCloud size={24} />
            <span className="text-sm">Click to upload images (JPG, PNG, WEBP)</span>
            <input type="file" accept="image/*" multiple hidden onChange={handleFiles} />
          </label>

          {newFiles.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {newFiles.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-20 w-20 rounded-lg border border-line object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewFile(idx)}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin/products")} className="btn-outline">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
