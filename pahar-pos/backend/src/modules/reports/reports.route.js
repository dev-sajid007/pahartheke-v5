import express from "express";
import { 
  getDailySalesReport, 
  getProductWiseSalesReport, 
  getGrossProfitReport, 
  getCOGSReport, 
  getExpenseReport, 
  getReturnSalesReport 
} from "./reports.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/daily-sales", getDailySalesReport);
router.get("/product-wise-sales", getProductWiseSalesReport);
router.get("/gross-profit", getGrossProfitReport);
router.get("/cogs", getCOGSReport);
router.get("/expenses", getExpenseReport);
router.get("/returns", getReturnSalesReport);

export default router;
