import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import siteConfig from "../config/siteConfig";
import { buildWhatsAppUrl, genericOrderMessage } from "../utils/whatsapp";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-white">
      <div className="container-app grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              MS
            </span>
            <span className="font-display text-base font-bold text-ink">MS Footwear</span>
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Authentic Peshawari Chappal crafted with traditional style and modern comfort.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/shop" className="hover:text-primary">Shop</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink">Contact</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex items-center gap-2">
              <FiPhone size={14} /> {siteConfig.phoneDisplay}
            </li>
            <li className="flex items-center gap-2">
              <FiMail size={14} /> {siteConfig.emailAddress}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-ink">Follow Us</h4>
          <div className="flex items-center gap-3">
            <a
              href={buildWhatsAppUrl(genericOrderMessage())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] transition-colors hover:bg-[#25D366] hover:text-white"
            >
              <FaWhatsapp size={17} />
            </a>
            <a
              href={siteConfig.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <FaFacebookF size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line py-4">
        <div className="container-app flex flex-col items-center justify-between gap-2 text-xs text-muted sm:flex-row">
          <p>© {year} MS Footwear. All rights reserved.</p>
          <Link to="/admin/login" className="text-muted/70 hover:text-primary">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
