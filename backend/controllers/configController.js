import siteConfig from "../config/siteConfig.js";

// @desc    Get public site configuration (whatsapp, facebook, easypaisa number)
// @route   GET /api/config
// @access  Public
export const getPublicConfig = (req, res) => {
  res.json({
    success: true,
    config: {
      businessName: siteConfig.businessName,
      whatsappNumber: siteConfig.whatsappNumber,
      businessPhone: siteConfig.businessPhone,
      businessEmail: siteConfig.businessEmail,
      facebookUrl: siteConfig.facebookUrl,
      easypaisaNumber: siteConfig.easypaisaNumber,
      easypaisaAccountName: siteConfig.easypaisaAccountName,
    },
  });
};
