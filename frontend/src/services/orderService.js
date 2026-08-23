import api from "./api";

export const createOrder = (payload) => api.post("/orders", payload).then((r) => r.data);
export const fetchOrderById = (id) => api.get(`/orders/${id}`).then((r) => r.data);
export const fetchOrders = (params = {}) => api.get("/orders", { params }).then((r) => r.data);
export const updateOrderStatus = (id, payload) =>
  api.put(`/orders/${id}/status`, payload).then((r) => r.data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`).then((r) => r.data);
