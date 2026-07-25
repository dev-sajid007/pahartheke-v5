import express from "express";

import { getStockMovements } from "./stock.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/movements",
  authMiddleware,
  getStockMovements
);

export default router;
