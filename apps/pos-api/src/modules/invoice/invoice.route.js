import express from "express";

import { generateInvoicePDF } from "./invoice.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/:id/pdf",
  authMiddleware,
  generateInvoicePDF
);

export default router;
