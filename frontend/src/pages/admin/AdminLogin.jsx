import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FiLock, FiMail } from "react-icons/fi";
import { useAdminAuth } from "../../context/AdminAuthContext";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary-light/40 px-4">
      <div className="w-full max-w-sm rounded-xl border border-line bg-white p-8 shadow-card">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
            MS
          </span>
          <h1 className="text-lg font-bold text-ink">Admin Login</h1>
          <p className="text-xs text-muted">MS Footwear management panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Email</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="admin@example.com"
              />
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
            </div>
          </div>
          <div>
            <label className="label-text">Password</label>
            <div className="relative">
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="••••••••"
              />
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
            </div>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
