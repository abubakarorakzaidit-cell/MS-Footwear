import React, { useEffect, useState } from "react";
import { FiTrash2, FiClipboard, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { fetchOrders, updateOrderStatus, deleteOrder } from "../../services/orderService";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";

const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColor = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Processing: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = () => {
    setLoading(true);
    fetchOrders({ status: filter, limit: 100 })
      .then((data) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const handleStatusChange = async (id, orderStatus) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, { orderStatus });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus } : o)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order? This cannot be undone.")) return;
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-ink">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto">
          <option value="All">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader label="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState icon={FiClipboard} title="No orders yet" message="Orders placed by customers will appear here." />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border border-line bg-white">
              <button
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-ink">{order.orderNumber}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[order.orderStatus]}`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-sm text-muted">{order.customer.name}</span>
                  <span className="text-sm text-muted">{order.customer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-primary">Rs. {order.total.toLocaleString("en-PK")}</span>
                  {expanded === order._id ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </div>
              </button>

              {expanded === order._id && (
                <div className="border-t border-line p-4">
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase text-muted">Customer Details</h4>
                      <p className="text-sm text-ink">{order.customer.name}</p>
                      <p className="text-sm text-muted">{order.customer.phone}</p>
                      {order.customer.email && <p className="text-sm text-muted">{order.customer.email}</p>}
                      <p className="mt-1 text-sm text-muted">
                        {order.customer.address}, {order.customer.city}, {order.customer.province}{" "}
                        {order.customer.postalCode}
                      </p>
                      {order.notes && <p className="mt-2 text-sm text-muted">Notes: {order.notes}</p>}
                    </div>

                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase text-muted">Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm">
                            {item.image && <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />}
                            <div className="flex-1">
                              <p className="text-ink">{item.name}</p>
                              <p className="text-xs text-muted">
                                Size {item.size} × {item.quantity}
                              </p>
                            </div>
                            <span className="font-medium text-ink">
                              Rs. {(item.price * item.quantity).toLocaleString("en-PK")}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        Payment: {order.paymentMethod === "COD" ? "Cash on Delivery" : "Manual Easypaisa"} (
                        {order.paymentStatus})
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-muted">Update Status:</label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="input-field w-auto py-1.5 text-xs"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:underline"
                    >
                      <FiTrash2 size={14} /> Delete Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
