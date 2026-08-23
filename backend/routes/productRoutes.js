import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
} from "../controllers/productController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { productRules, handleValidation } from "../middleware/validators.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protectAdmin, upload.array("images", 6), productRules, handleValidation, createProduct);
router.put("/:id", protectAdmin, upload.array("images", 6), updateProduct);
router.delete("/:id", protectAdmin, deleteProduct);
router.delete("/:id/images/:fileId", protectAdmin, deleteProductImage);

export default router;
