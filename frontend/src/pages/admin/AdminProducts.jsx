import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiBox, FiStar } from "react-icons/fi";
import { fetchProducts, deleteProduct } from "../../services/productService";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchProducts({ limit: 50 })
      .then((data) => setProducts(data.products))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Products</h1>
        <Link to="/admin/products/new" className="btn-primary">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon={FiBox}
          title="No products yet"
          message="Add your first Peshawari Chappal product to get started."
          action={
            <Link to="/admin/products/new" className="btn-primary mt-2">
              <FiPlus size={16} /> Add Product
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-line bg-neutral-50 text-xs uppercase text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={p.images?.[0]?.url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="line-clamp-1 font-medium text-ink">{p.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.category}</td>
                  <td className="px-4 py-3 font-medium text-ink">Rs. {p.price.toLocaleString("en-PK")}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? "text-red-600" : "text-emerald-600"}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    {p.featured && <FiStar className="text-amber-400" size={16} />}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-primary hover:bg-primary-light"
                      >
                        <FiEdit2 size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        disabled={deletingId === p._id}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
