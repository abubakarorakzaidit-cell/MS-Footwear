import api from "./api";

export const fetchPublicConfig = () => api.get("/config").then((r) => r.data);
