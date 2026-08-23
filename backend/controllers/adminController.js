import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

// @desc    Login admin (ONLY one admin account exists in the system)
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  });
});

// @desc    Get current logged-in admin
// @route   GET /api/admin/me
// @access  Private (admin)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @desc    Get dashboard summary stats
// @route   GET /api/admin/dashboard
// @access  Private (admin)
export const getDashboardStats = asyncHandler(async (req, res) => {
  const Product = (await import("../models/Product.js")).default;
  const Order = (await import("../models/Order.js")).default;

  const [totalProducts, totalOrders, pendingOrders, completedOrders, orders] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: "Pending" }),
    Order.countDocuments({ orderStatus: "Delivered" }),
    Order.find({ orderStatus: { $ne: "Cancelled" } }).select("total"),
  ]);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  res.json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales,
    },
  });
});
