import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from "./category.controller.js";

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
  createCategory
);

router.get("/", getCategories);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  upload.single("image"),
  cloudinaryUpload,
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  deleteCategory
);

export default router;
