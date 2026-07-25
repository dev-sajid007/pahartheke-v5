import express from "express";

import {
  createSale,
  getSales,
  getSale,
} from "./sale.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createSale
);

router.get(
  "/",
  authMiddleware,
  getSales
);

router.get(
  "/:id",
  authMiddleware,
  getSale
);

export default router;
