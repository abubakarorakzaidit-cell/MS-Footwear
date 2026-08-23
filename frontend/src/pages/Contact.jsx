import React from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import siteConfig from "../config/siteConfig";
import WhatsAppButton from "../components/WhatsAppButton";
import { contactPageMessage } from "../utils/whatsapp";

const Contact = () => (
  <div className="container-app py-14">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="section-title">Get in Touch</h1>
      <p className="mt-3 text-muted">
        Have a question about our products or an order? Reach out to us — we're happy to help.
      </p>
    </div>

    <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-3">
      <a
        href={`tel:${siteConfig.phoneDisplay.replace(/\s/g, "")}`}
        className="card flex flex-col items-center gap-3 p-6 text-center transition-shadow hover:shadow-cardHover"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
          <FiPhone size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Call Us</p>
          <p className="text-xs text-muted">{siteConfig.phoneDisplay}</p>
        </div>
      </a>

      <a
        href={`mailto:${siteConfig.emailAddress}`}
        className="card flex flex-col items-center gap-3 p-6 text-center transition-shadow hover:shadow-cardHover"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
          <FiMail size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Email Us</p>
          <p className="break-all text-xs text-muted">{siteConfig.emailAddress}</p>
        </div>
      </a>

      <a
        href={siteConfig.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="card flex flex-col items-center gap-3 p-6 text-center transition-shadow hover:shadow-cardHover"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
          <FaFacebookF size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Facebook</p>
          <p className="text-xs text-muted">Follow our page</p>
        </div>
      </a>
    </div>

    <div className="mx-auto mt-10 max-w-md text-center">
      <p className="mb-4 text-sm text-muted">Prefer WhatsApp? Message us directly for the fastest response.</p>
      <WhatsAppButton message={contactPageMessage()} className="mx-auto">
        <FaWhatsapp size={18} /> Chat on WhatsApp
      </WhatsAppButton>
    </div>

    <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2 text-xs text-muted">
      <FiMapPin size={14} /> Peshawar, Khyber Pakhtunkhwa, Pakistan
    </div>
  </div>
);

export default Contact;
