import express from "express";

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "./product.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

import roleMiddleware from "../../middleware/roleMiddleware.js";

import upload, { cloudinaryUpload } from "../../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  upload.single("image"),
  cloudinaryUpload,
  createProduct
);

router.get("/", getProducts);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  upload.single("image"),
  cloudinaryUpload,
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  deleteProduct
);

export default router;
