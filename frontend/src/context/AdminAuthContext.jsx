import React, { createContext, useContext, useState } from "react";
import { loginAdmin as loginAdminApi } from "../services/adminService";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const raw = localStorage.getItem("ms_admin_info");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("ms_admin_token"));

  const login = async (email, password) => {
    const data = await loginAdminApi({ email, password });
    setAdmin(data.admin);
    setToken(data.token);
    localStorage.setItem("ms_admin_token", data.token);
    localStorage.setItem("ms_admin_info", JSON.stringify(data.admin));
    return data;
  };

  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("ms_admin_token");
    localStorage.removeItem("ms_admin_info");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};
