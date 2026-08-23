import api from "./api";

export const fetchProducts = (params = {}) => api.get("/products", { params }).then((r) => r.data);
export const fetchProductById = (id) => api.get(`/products/${id}`).then((r) => r.data);

export const createProduct = (formData) =>
  api.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

export const updateProduct = (id, formData) =>
  api.put(`/products/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);

export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
export const deleteProductImage = (id, fileId) =>
  api.delete(`/products/${id}/images/${fileId}`).then((r) => r.data);
