// ==========================================
// MS Footwear - Central site configuration
// This is the ONE file to edit for contact details.
// Change the Facebook URL here once you have your real page.
// ==========================================

const siteConfig = {
  businessName: "MS Footwear",
  tagline: "Traditional craftsmanship. Modern comfort.",

  // WhatsApp number in international format (no + or spaces)
  whatsappNumber: "923339630737",

  phoneDisplay: "0333 9630737",
  emailAddress: "abubakarorakzaidit@gmail.com",

  // Placeholder - replace with your real Facebook page URL
  facebookUrl: "https://facebook.com/",

  // Easypaisa number shown at manual-payment checkout step.
  // Fallback only — the live value comes from the backend /api/config
  // (which reads EASYPAISA_NUMBER from its .env file).
  easypaisaNumberFallback: "033XXXXXXXX",
  easypaisaAccountNameFallback: "MS Footwear",
};

export default siteConfig;
