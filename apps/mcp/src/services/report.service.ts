import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

export class ReportService {
  static async dailySales({ startDate, endDate }: { startDate?: string; endDate?: string } = {}): Promise<any[]> {
    await connectDB();
    const match: Record<string, any> = {};
    if (startDate || endDate) {
      match.order_date = {};
      if (startDate) match.order_date.$gte = new Date(startDate);
      if (endDate) match.order_date.$lte = new Date(endDate);
    }
    return await mongoose.model("Sale").aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } },
          totalSales: { $sum: "$grandTotal" },
          totalProfit: { $sum: "$totalProfit" },
          totalCost: { $sum: "$totalCost" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);
  }

  static async productWiseSales({ startDate, endDate }: { startDate?: string; endDate?: string } = {}): Promise<any[]> {
    await connectDB();
    const match: Record<string, any> = {};
    if (startDate || endDate) {
      match.order_date = {};
      if (startDate) match.order_date.$gte = new Date(startDate);
      if (endDate) match.order_date.$lte = new Date(endDate);
    }
    return await mongoose.model("Sale").aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          productName: { $first: "$items.variantName" },
          totalQty: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" },
          totalCost: { $sum: "$items.cost" },
          totalProfit: { $sum: "$items.profit" },
          saleCount: { $sum: 1 },
        },
      },
      { $sort: { totalQty: -1 } },
    ]);
  }

  static async grossProfit({ startDate, endDate }: { startDate?: string; endDate?: string } = {}): Promise<any> {
    await connectDB();
    const match: Record<string, any> = {};
    if (startDate || endDate) {
      match.order_date = {};
      if (startDate) match.order_date.$gte = new Date(startDate);
      if (endDate) match.order_date.$lte = new Date(endDate);
    }
    const result = await mongoose.model("Sale").aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
          totalCost: { $sum: "$totalCost" },
          totalProfit: { $sum: "$totalProfit" },
          totalDiscount: { $sum: "$discount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);
    return result.length > 0 ? result[0] : { totalRevenue: 0, totalCost: 0, totalProfit: 0, totalDiscount: 0, orderCount: 0 };
  }

  static async cogs({ startDate, endDate }: { startDate?: string; endDate?: string } = {}): Promise<any> {
    await connectDB();
    const match: Record<string, any> = {};
    if (startDate || endDate) {
      match.order_date = {};
      if (startDate) match.order_date.$gte = new Date(startDate);
      if (endDate) match.order_date.$lte = new Date(endDate);
    }
    const result = await mongoose.model("Sale").aggregate([
      { $match: match },
      { $group: { _id: null, totalCost: { $sum: "$totalCost" } } },
    ]);
    return result.length > 0 ? result[0] : { totalCost: 0 };
  }

  static async expenseReport({ startDate, endDate }: { startDate?: string; endDate?: string } = {}): Promise<any[]> {
    await connectDB();
    const match: Record<string, any> = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    return await mongoose.model("Expense").aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);
  }

  static async returns({ startDate, endDate }: { startDate?: string; endDate?: string } = {}): Promise<any[]> {
    await connectDB();
    const match: Record<string, any> = { type: "return" };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }
    return await mongoose.model("StockMovement").aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalReturned: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
    ]);
  }
}
