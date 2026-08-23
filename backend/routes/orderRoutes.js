import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import { orderRules, handleValidation } from "../middleware/validators.js";

const router = express.Router();

router.post("/", orderRules, handleValidation, createOrder);
router.get("/", protectAdmin, getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", protectAdmin, updateOrderStatus);
router.delete("/:id", protectAdmin, deleteOrder);

export default router;
