import Sale from "../sale/sale.model.js";
import Product from "../product/product.model.js";
import Expense from "../expense/expense.model.js";
import asyncHandler from "../../utils/asyncHandler.js";
import apiResponse from "../../utils/apiResponse.js";
import mongoose from "mongoose";

// 1. Daily Sales Report
export const getDailySalesReport = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const startOfDay = date ? new Date(date) : new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const sales = await Sale.find({
    order_date: { $gte: startOfDay, $lte: endOfDay }
  }).populate("customer", "name");

  const stats = await Sale.aggregate([
    { $match: { order_date: { $gte: startOfDay, $lte: endOfDay } } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$grandTotal" },
        totalInvoices: { $sum: 1 },
        totalItems: { $sum: { $size: "$items" } },
        totalPaid: { $sum: "$paidAmount" },
        totalDue: { $sum: "$dueAmount" }
      }
    }
  ]);

  return apiResponse({
    res,
    data: {
      sales,
      summary: stats[0] || { totalSales: 0, totalInvoices: 0, totalItems: 0, totalPaid: 0, totalDue: 0 }
    }
  });
});

// 2. Product Wise Sales Report
export const getProductWiseSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, productId } = req.query;

  const match = {};
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    match.order_date = { $gte: start, $lte: end };
  }

  if (productId) {
    match["items.product"] = new mongoose.Types.ObjectId(productId);
  }

  const productStats = await Sale.aggregate([
    { $match: match },
    { $unwind: "$items" },
    ...(productId ? [{ $match: { "items.product": new mongoose.Types.ObjectId(productId) } }] : []),
    {
      $group: {
        _id: "$items.product",
        soldQuantity: { $sum: "$items.quantity" },
        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.salePrice"] } }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    { $unwind: "$productDetails" },
    {
      $project: {
        name: "$productDetails.name",
        sku: "$productDetails.sku",
        soldQuantity: 1,
        totalRevenue: 1
      }
    },
    { $sort: { soldQuantity: -1 } }
  ]);

  let salesDetail = [];
  if (productId) {
    salesDetail = await Sale.find(
      { ...match, "items.product": new mongoose.Types.ObjectId(productId) }
    )
      .populate("customer", "name")
      .sort({ order_date: -1 });

    salesDetail = salesDetail.map((sale) => {
      const matchingItems = sale.items.filter(
        (item) => item.product.toString() === productId
      );
      return {
        _id: sale._id,
        invoiceNo: sale.invoiceNo,
        customer: sale.customer,
        order_date: sale.order_date,
        items: matchingItems.map((item) => ({
          quantity: item.quantity,
          salePrice: item.salePrice,
          variantName: item.variantName,
          subtotal: item.subtotal,
        })),
      };
    });
  }

  return apiResponse({
    res,
    data: {
      summary: productStats,
      salesDetail,
    },
  });
});

// 3. Gross Profit Report
export const getGrossProfitReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = {};
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    match.order_date = { $gte: start, $lte: end };
  }

  const profitStats = await Sale.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$grandTotal" },
        totalCost: { $sum: "$totalCost" },
        totalProfit: { $sum: "$totalProfit" }
      }
    }
  ]);

  return apiResponse({
    res,
    data: profitStats[0] || { totalRevenue: 0, totalCost: 0, totalProfit: 0 }
  });
});

// 4. COGS Report
export const getCOGSReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = {};
  if (startDate && endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    match.order_date = { $gte: start, $lte: end };
  }

  const cogsStats = await Sale.aggregate([
    { $match: match },
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        totalCOGS: { $sum: "$totalCost" },
        totalSoldQuantity: { $sum: "$items.quantity" }
      }
    }
  ]);

  return apiResponse({
    res,
    data: cogsStats[0] || { totalCOGS: 0, totalSoldQuantity: 0 }
  });
});

// 5. Expense Report
export const getExpenseReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = {};
  if (startDate && endDate) {
    match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  const expenses = await Expense.find(match).populate("category", "name");
  const summary = await Expense.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalExpense: { $sum: "$amount" }
      }
    }
  ]);

  return apiResponse({
    res,
    data: {
      expenses,
      total: summary[0]?.totalExpense || 0
    }
  });
});

// 6. Return Sales Report (Placeholder as Return model might not exist yet)
export const getReturnSalesReport = asyncHandler(async (req, res) => {
  // Since we don't have a specific Return model yet, we can return dummy or filtered data
  // For now, let's just return an empty array to be implemented when Return system is built.
  return apiResponse({
    res,
    data: [],
    message: "Return module coming soon"
  });
});
