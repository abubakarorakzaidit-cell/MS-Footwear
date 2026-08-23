import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { buildWhatsAppUrl, genericOrderMessage } from "../utils/whatsapp";

const FloatingWhatsApp = () => {
  const url = buildWhatsAppUrl(genericOrderMessage());

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MS Footwear on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={28} />
    </a>
  );
};

export default FloatingWhatsApp;
