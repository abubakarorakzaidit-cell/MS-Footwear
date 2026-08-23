import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiGrid, FiBox, FiClipboard, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/orders", label: "Orders", icon: FiClipboard },
];

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive ? "bg-primary text-white" : "text-ink hover:bg-primary-light hover:text-primary"
    }`;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar - desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-white lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-line px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            MS
          </span>
          <span className="font-display text-base font-bold text-ink">Admin Panel</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navItemClass}>
              <l.icon size={18} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-4">
          <p className="mb-2 truncate text-xs text-muted">{admin?.email}</p>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex flex-1 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
          <span className="font-display text-base font-bold text-ink">Admin Panel</span>
          <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 hover:bg-neutral-100">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
        {open && (
          <div className="border-b border-line bg-white p-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={navItemClass} onClick={() => setOpen(false)}>
                  <l.icon size={18} /> {l.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <FiLogOut size={16} /> Logout
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
