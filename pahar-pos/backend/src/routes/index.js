import express from "express";

import authRoutes from "../modules/auth/auth.route.js";

import testRoutes from "../modules/auth/test.route.js";

import categoryRoutes from "../modules/category/category.route.js";

import productRoutes from "../modules/product/product.route.js";

import purchaseRoutes from "../modules/purchase/purchase.route.js";
import purchaseCostRoutes from "../modules/purchase/purchaseCost.route.js";

import saleRoutes from "../modules/sale/sale.route.js";

import customerRoutes from "../modules/customer/customer.route.js";

import supplierRoutes from "../modules/supplier/supplier.route.js";

import expenseRoutes from "../modules/expense/expense.route.js";

import dashboardRoutes from "../modules/dashboard/dashboard.route.js";

import stockRoutes from "../modules/stock/stock.route.js";

import invoiceRoutes from "../modules/invoice/invoice.route.js";

import badgeRoutes from "../modules/customer/badge.route.js";

import settingsRoutes from "../modules/settings/settings.route.js";
import reportRoutes from "../modules/reports/reports.route.js";
import ecommerceRoutes from "../modules/ecommerce/ecommerce.route.js";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/test", testRoutes);

router.use("/categories", categoryRoutes);

router.use("/products", productRoutes);

router.use("/purchases", purchaseRoutes);
router.use("/purchase-costs", purchaseCostRoutes);

router.use("/sales", saleRoutes);

router.use("/customers", customerRoutes);

router.use("/suppliers", supplierRoutes);

router.use("/expenses", expenseRoutes);

router.use("/dashboard", dashboardRoutes);

router.use("/stock", stockRoutes);

router.use("/invoices", invoiceRoutes);

router.use("/badges", badgeRoutes);

router.use("/settings", settingsRoutes);

router.use("/reports", reportRoutes);

router.use("/ecommerce", ecommerceRoutes);

export default router;