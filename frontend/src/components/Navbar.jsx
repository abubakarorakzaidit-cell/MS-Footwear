import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { buildWhatsAppUrl, genericOrderMessage } from "../utils/whatsapp";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/shop${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    setSearch("");
    setOpen(false);
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-ink"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <nav className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-white">
            MS
          </span>
          <span className="font-display text-lg font-bold text-ink">MS Footwear</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative hidden max-w-xs flex-1 lg:block">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Peshawari Chappal..."
            className="w-full rounded-full border border-line bg-neutral-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
        </form>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <a
            href={buildWhatsAppUrl(genericOrderMessage())}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#25D366] transition-colors hover:bg-green-50 sm:flex"
          >
            <FaWhatsapp size={20} />
          </a>

          <Link
            to="/cart"
            aria-label="View cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-primary-light hover:text-primary"
          >
            <FiShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-neutral-100 lg:hidden"
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line bg-white lg:hidden">
          <div className="container-app flex flex-col gap-4 py-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Peshawari Chappal..."
                className="w-full rounded-full border border-line bg-neutral-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
            </form>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={linkClass}
                end={link.to === "/"}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
