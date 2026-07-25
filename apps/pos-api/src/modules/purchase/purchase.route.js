import express from "express";

import {
  createPurchase,
  getPurchases,
  getPurchase,
} from "./purchase.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "manager"),
  createPurchase
);

router.get(
  "/",
  authMiddleware,
  getPurchases
);

router.get(
  "/:id",
  authMiddleware,
  getPurchase
);

export default router;
