import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

export class DashboardService {
  static async getSummary(): Promise<any> {
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalProducts, totalCustomers, totalSuppliers, totalSales, todaySales, monthSales, totalPurchases, lowStockItems] = await Promise.all([
      mongoose.model("Product").countDocuments({ status: true }),
      mongoose.model("Customer").countDocuments({ status: true }),
      mongoose.model("Supplier").countDocuments({ status: true }),
      mongoose.model("Sale").aggregate([{ $group: { _id: null, total: { $sum: "$grandTotal" } } }]),
      mongoose.model("Sale").aggregate([
        { $match: { order_date: { $gte: today } } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      mongoose.model("Sale").aggregate([
        { $match: { order_date: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      mongoose.model("Purchase").aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      mongoose.model("Product").countDocuments({ currentStock: { $lte: 5 }, status: true }),
    ]);

    return {
      totalProducts,
      totalCustomers,
      totalSuppliers,
      totalSales: totalSales[0]?.total || 0,
      todaySales: todaySales[0]?.total || 0,
      todayOrders: todaySales[0]?.count || 0,
      monthSales: monthSales[0]?.total || 0,
      monthOrders: monthSales[0]?.count || 0,
      totalPurchases: totalPurchases[0]?.total || 0,
      lowStockItems,
    };
  }
}
