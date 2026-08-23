import { body, validationResult } from "express-validator";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const adminLoginRules = [
  body("email").isEmail().withMessage("Enter a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const productRules = [
  body("name").trim().notEmpty().withMessage("Product name is required").isLength({ max: 150 }),
  body("description").trim().notEmpty().withMessage("Description is required").isLength({ max: 3000 }),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("originalPrice")
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),
  body("category")
    .isIn(["Men", "Women", "Kids", "Handmade", "Premium", "Classic"])
    .withMessage("Invalid category"),
  body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
  body("sizes").custom((value) => {
    let sizes = value;
    if (typeof value === "string") {
      try {
        sizes = JSON.parse(value);
      } catch {
        sizes = value.split(",").map((s) => Number(s.trim()));
      }
    }
    if (!Array.isArray(sizes) || sizes.length === 0) {
      throw new Error("At least one size is required");
    }
    return true;
  }),
];

export const orderRules = [
  body("customer.name").trim().notEmpty().withMessage("Full name is required").isLength({ max: 100 }),
  body("customer.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9+\-\s]{10,15}$/)
    .withMessage("Enter a valid phone number"),
  body("customer.whatsapp")
    .optional({ checkFalsy: true })
    .matches(/^[0-9+\-\s]{10,15}$/)
    .withMessage("Enter a valid WhatsApp number"),
  body("customer.email").optional({ checkFalsy: true }).isEmail().withMessage("Enter a valid email"),
  body("customer.address").trim().notEmpty().withMessage("Complete address is required").isLength({ max: 300 }),
  body("customer.city").trim().notEmpty().withMessage("City is required"),
  body("customer.province").trim().notEmpty().withMessage("Province is required"),
  body("customer.postalCode").optional({ checkFalsy: true }).trim(),
  body("items").isArray({ min: 1 }).withMessage("Order must contain at least one item"),
  body("items.*.product").notEmpty().withMessage("Product ID is required for each item"),
  body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("items.*.size").notEmpty().withMessage("Size is required for each item"),
  body("paymentMethod").isIn(["COD", "EASYPAISA"]).withMessage("Invalid payment method"),
];
