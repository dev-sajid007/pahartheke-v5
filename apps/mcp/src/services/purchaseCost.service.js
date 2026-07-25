import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const purchaseCostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const PurchaseCost = mongoose.models.PurchaseCost || mongoose.model("PurchaseCost", purchaseCostSchema);

export class PurchaseCostService {
  static async getAll() {
    await connectDB();
    return await PurchaseCost.find({ status: true }).sort({ name: 1 }).lean();
  }

  static async getById(id) {
    await connectDB();
    const pc = await PurchaseCost.findById(id).lean();
    if (!pc) throw new Error("Purchase cost not found");
    return pc;
  }

  static async create(data) {
    await connectDB();
    try {
      return await PurchaseCost.create(data);
    } catch (error) {
      if (error.code === 11000) throw new Error("Purchase cost with this name already exists");
      throw new Error(`Failed to create purchase cost: ${error.message}`);
    }
  }

  static async update(id, data) {
    await connectDB();
    const pc = await PurchaseCost.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!pc) throw new Error("Purchase cost not found");
    return pc;
  }

  static async delete(id) {
    await connectDB();
    const pc = await PurchaseCost.findByIdAndDelete(id);
    if (!pc) throw new Error("Purchase cost not found");
    return { deleted: true, message: "Purchase cost deleted" };
  }
}
