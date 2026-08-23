// ==========================================
// Central site configuration.
// Change WhatsApp number, Facebook URL, and Easypaisa
// details here (values are sourced from .env).
// ==========================================

const siteConfig = {
  businessName: "MS Footwear",
  whatsappNumber: process.env.WHATSAPP_NUMBER || "923339630737",
  businessPhone: process.env.BUSINESS_PHONE || "03339630737",
  businessEmail: process.env.BUSINESS_EMAIL || "abubakarorakzaidit@gmail.com",
  facebookUrl: process.env.FACEBOOK_URL || "https://facebook.com/",
  easypaisaNumber: process.env.EASYPAISA_NUMBER || "033XXXXXXXX",
  easypaisaAccountName: process.env.EASYPAISA_ACCOUNT_NAME || "MS Footwear",
};

export default siteConfig;
