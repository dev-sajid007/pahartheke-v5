import express from "express";
import {
  getCategories,
  getProducts,
  getProduct,
  createOrder,
} from "./ecommerce.controller.js";
import apiKeyMiddleware from "../../middleware/apiKeyMiddleware.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/products", getProducts);
router.get("/products/:id", getProduct);

router.post("/orders", apiKeyMiddleware, createOrder);

export default router;
