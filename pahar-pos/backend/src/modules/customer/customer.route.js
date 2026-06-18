import express from "express";

import {
  createCustomer,
  getCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer
} from "./customer.controller.js";

import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  createCustomer
);

router.get(
  "/",
  authMiddleware,
  getCustomers
);

router.get(
  "/:id",
  authMiddleware,
  getSingleCustomer
);

router.put(
  "/:id",
  authMiddleware,
  updateCustomer
);

router.delete(
  "/:id",
  authMiddleware,
  deleteCustomer
);

export default router;
