import express from "express";

import {
  createExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory
} from "./expenseCategory.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createExpenseCategory
);

router.get(
  "/",
  authMiddleware,
  getExpenseCategories
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  updateExpenseCategory
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  deleteExpenseCategory
);

export default router;
