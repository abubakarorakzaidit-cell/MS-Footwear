import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl } from "../utils/whatsapp";

/**
 * Reusable WhatsApp CTA button.
 * @param {string} message - the pre-filled WhatsApp message
 * @param {"solid"|"outline"|"icon"} variant
 */
const WhatsAppButton = ({ message = "", variant = "solid", children, className = "" }) => {
  const url = buildWhatsAppUrl(message);

  if (variant === "icon") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105 ${className}`}
      >
        <FaWhatsapp size={20} />
      </a>
    );
  }

  if (variant === "outline") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`btn-outline ${className}`}
      >
        <FaWhatsapp size={18} />
        {children || "Order on WhatsApp"}
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className={`btn-whatsapp ${className}`}>
      <FaWhatsapp size={18} />
      {children || "Order on WhatsApp"}
    </a>
  );
};

export default WhatsAppButton;
