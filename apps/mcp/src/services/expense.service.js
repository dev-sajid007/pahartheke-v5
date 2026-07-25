import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    amount: { type: Number, required: true },
    note: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Expense = mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export class ExpenseService {
  static async getAll(filters = {}) {
    await connectDB();
    const query = {};
    if (filters.category) query.category = filters.category;
    if (filters.startDate) query.createdAt = { $gte: new Date(filters.startDate) };
    if (filters.endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(filters.endDate) };
    }
    return await Expense.find(query).sort({ createdAt: -1 }).lean();
  }

  static async getById(id) {
    await connectDB();
    const e = await Expense.findById(id).lean();
    if (!e) throw new Error("Expense not found");
    return e;
  }

  static async create(data) {
    await connectDB();
    return await Expense.create(data);
  }

  static async update(id, data) {
    await connectDB();
    const e = await Expense.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!e) throw new Error("Expense not found");
    return e;
  }

  static async delete(id) {
    await connectDB();
    const e = await Expense.findByIdAndDelete(id);
    if (!e) throw new Error("Expense not found");
    return { deleted: true, message: "Expense deleted" };
  }
}
