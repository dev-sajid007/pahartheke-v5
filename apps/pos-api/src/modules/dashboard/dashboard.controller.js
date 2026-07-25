import Sale from "../sale/sale.model.js";

import Product from "../product/product.model.js";

import Expense from "../expense/expense.model.js";

import asyncHandler from "../../utils/asyncHandler.js";

import apiResponse from "../../utils/apiResponse.js";

export const getDashboardStats =
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today Sales
    const todaySales = await Sale.aggregate([
      {
        $match: {
          order_date: {
            $gte: today,
          },
        },
      },

      {
        $group: {
          _id: null,

          totalSales: {
            $sum: "$grandTotal",
          },

          totalProfit: {
            $sum: "$totalProfit",
          },

          totalDue: {
            $sum: "$dueAmount",
          },

          totalOrders: {
            $sum: 1,
          },
        },
      },
    ]);

    // Monthly Sales
    const monthlySales = await Sale.aggregate([
      {
        $match: {
          order_date: { $gte: monthStart },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$grandTotal" },
        },
      },
    ]);

    // Total Expense
    const expenses =
      await Expense.aggregate([
        {
          $group: {
            _id: null,

            totalExpense: {
              $sum: "$amount",
            },
          },
        },
      ]);

    // Low Stock
    const lowStockProducts =
      await Product.find({
        $expr: {
          $lte: [
            "$currentStock",
            "$minimumStockAlert",
          ],
        },
      })
        .select(
          "name currentStock minimumStockAlert"
        )
        .limit(10);

    // Recent Sales
    const recentSales = await Sale.find()
      .populate("customer", "name phone")
      .sort({
        order_date: -1,
      })
      .limit(10);

    // Top Selling Products
    const topProducts =
      await Sale.aggregate([
        { $unwind: "$items" },

        {
          $group: {
            _id: "$items.product",

            soldQuantity: {
              $sum: "$items.quantity",
            },

            totalRevenue: {
              $sum: "$items.subtotal",
            },
          },
        },

        { $sort: { soldQuantity: -1 } },

        { $limit: 10 },

        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },

        { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

        {
          $project: {
            _id: 1,
            name: { $ifNull: ["$product.name", "Deleted Product"] },
            sku: "$product.sku",
            soldQuantity: 1,
            totalRevenue: 1,
          },
        },
      ]);

    const salesData =
      todaySales[0] || {};

    const monthlyData =
      monthlySales[0] || {};

    const expenseData =
      expenses[0] || {};

    const netProfit =
      (salesData.totalProfit || 0) -
      (expenseData.totalExpense || 0);

    return apiResponse({
      res,
      data: {
        todaySales:
          salesData.totalSales || 0,

        todayProfit:
          salesData.totalProfit || 0,

        todayDue:
          salesData.totalDue || 0,

        totalOrders:
          salesData.totalOrders || 0,

        monthlySales:
          monthlyData.totalSales || 0,

        totalExpense:
          expenseData.totalExpense || 0,

        netProfit,

        lowStockProducts,

        lowStockCount: lowStockProducts.length,

        recentSales,

        topSellingProducts: topProducts,
      },
    });
  });
