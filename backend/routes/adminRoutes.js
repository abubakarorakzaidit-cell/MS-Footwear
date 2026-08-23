import express from "express";
import { loginAdmin, getMe, getDashboardStats } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { adminLoginRules, handleValidation } from "../middleware/validators.js";

const router = express.Router();

router.post("/login", adminLoginRules, handleValidation, loginAdmin);
router.get("/me", protectAdmin, getMe);
router.get("/dashboard", protectAdmin, getDashboardStats);

export default router;
