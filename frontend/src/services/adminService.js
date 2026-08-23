import api from "./api";

export const loginAdmin = (payload) => api.post("/admin/login", payload).then((r) => r.data);
export const fetchMe = () => api.get("/admin/me").then((r) => r.data);
export const fetchDashboardStats = () => api.get("/admin/dashboard").then((r) => r.data);
