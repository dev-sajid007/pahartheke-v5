import express from "express";

import {
  createSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier
} from "./supplier.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createSupplier
);

router.get(
  "/",
  authMiddleware,
  getSuppliers
);

router.put(
  "/:id",
  authMiddleware,
  updateSupplier
);

router.delete(
  "/:id",
  authMiddleware,
  deleteSupplier
);

export default router;
