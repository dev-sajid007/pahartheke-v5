import { getCategoriesTool } from "./get-categories.tool.js";
import { createCategoryTool } from "./create-category.tool.js";
import { updateCategoryTool } from "./update-category.tool.js";
import { deleteCategoryTool } from "./delete-category.tool.js";
import { getProductsTool } from "./get-products.tool.js";
import { createProductTool } from "./create-product.tool.js";
import { deleteProductTool } from "./delete-product.tool.js";
import { updateProductTool } from "./update-product.tool.js";

import { getCustomersTool } from "./get-customers.tool.js";
import { getCustomerTool } from "./get-customer.tool.js";
import { createCustomerTool } from "./create-customer.tool.js";
import { updateCustomerTool } from "./update-customer.tool.js";
import { deleteCustomerTool } from "./delete-customer.tool.js";

import { getSuppliersTool } from "./get-suppliers.tool.js";
import { getSupplierTool } from "./get-supplier.tool.js";
import { createSupplierTool } from "./create-supplier.tool.js";
import { updateSupplierTool } from "./update-supplier.tool.js";
import { deleteSupplierTool } from "./delete-supplier.tool.js";

import { getSalesTool } from "./get-sales.tool.js";
import { getSaleTool } from "./get-sale.tool.js";
import { createSaleTool } from "./create-sale.tool.js";
import { deleteSaleTool } from "./delete-sale.tool.js";

import { getPurchasesTool } from "./get-purchases.tool.js";
import { getPurchaseTool } from "./get-purchase.tool.js";
import { createPurchaseTool } from "./create-purchase.tool.js";
import { deletePurchaseTool } from "./delete-purchase.tool.js";

import { getExpensesTool } from "./get-expenses.tool.js";
import { createExpenseTool } from "./create-expense.tool.js";
import { updateExpenseTool } from "./update-expense.tool.js";
import { deleteExpenseTool } from "./delete-expense.tool.js";

import { getBadgesTool } from "./get-badges.tool.js";
import { createBadgeTool } from "./create-badge.tool.js";
import { updateBadgeTool } from "./update-badge.tool.js";
import { deleteBadgeTool } from "./delete-badge.tool.js";

import { getUsersTool } from "./get-users.tool.js";
import { getUserTool } from "./get-user.tool.js";
import { createUserTool } from "./create-user.tool.js";
import { updateUserTool } from "./update-user.tool.js";
import { deleteUserTool } from "./delete-user.tool.js";

import { getStockMovementsTool } from "./get-stock-movements.tool.js";
import { getLowStockTool } from "./get-low-stock.tool.js";
import { createStockAdjustmentTool } from "./create-stock-adjustment.tool.js";

import { getSettingsTool } from "./get-settings.tool.js";
import { updateSettingsTool } from "./update-settings.tool.js";

import { getDashboardTool } from "./get-dashboard.tool.js";

import { getPurchaseCostsTool } from "./get-purchase-costs.tool.js";
import { createPurchaseCostTool } from "./create-purchase-cost.tool.js";
import { updatePurchaseCostTool } from "./update-purchase-cost.tool.js";
import { deletePurchaseCostTool } from "./delete-purchase-cost.tool.js";

import { getDailySalesReportTool } from "./get-daily-sales-report.tool.js";
import { getProductWiseSalesReportTool } from "./get-product-wise-sales-report.tool.js";
import { getGrossProfitReportTool } from "./get-gross-profit-report.tool.js";
import { getCogsReportTool } from "./get-cogs-report.tool.js";
import { getExpenseReportTool } from "./get-expense-report.tool.js";
import { getReturnsReportTool } from "./get-returns-report.tool.js";
import type { ToolDefinition } from "../types.js";

export const tools: ToolDefinition[] = [
  // Categories
  getCategoriesTool,
  createCategoryTool,
  updateCategoryTool,
  deleteCategoryTool,

  // Products
  getProductsTool,
  createProductTool,
  updateProductTool,
  deleteProductTool,

  // Customers
  getCustomersTool,
  getCustomerTool,
  createCustomerTool,
  updateCustomerTool,
  deleteCustomerTool,

  // Suppliers
  getSuppliersTool,
  getSupplierTool,
  createSupplierTool,
  updateSupplierTool,
  deleteSupplierTool,

  // Sales
  getSalesTool,
  getSaleTool,
  createSaleTool,
  deleteSaleTool,

  // Purchases
  getPurchasesTool,
  getPurchaseTool,
  createPurchaseTool,
  deletePurchaseTool,

  // Expenses
  getExpensesTool,
  createExpenseTool,
  updateExpenseTool,
  deleteExpenseTool,

  // Badges
  getBadgesTool,
  createBadgeTool,
  updateBadgeTool,
  deleteBadgeTool,

  // Users
  getUsersTool,
  getUserTool,
  createUserTool,
  updateUserTool,
  deleteUserTool,

  // Stock
  getStockMovementsTool,
  getLowStockTool,
  createStockAdjustmentTool,

  // Settings
  getSettingsTool,
  updateSettingsTool,

  // Dashboard
  getDashboardTool,

  // Purchase Costs
  getPurchaseCostsTool,
  createPurchaseCostTool,
  updatePurchaseCostTool,
  deletePurchaseCostTool,

  // Reports
  getDailySalesReportTool,
  getProductWiseSalesReportTool,
  getGrossProfitReportTool,
  getCogsReportTool,
  getExpenseReportTool,
  getReturnsReportTool,
];

export const getToolByName = (name: string): ToolDefinition | undefined => tools.find(t => t.name === name);
