import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, default: "Award" },
    discount: { type: Number, default: 0 },
    conditions: [
      {
        field: { type: String, enum: ["totalOrders", "totalSpent"] },
        operator: { type: String, enum: ["gt", "lt", "gte", "lte", "eq"] },
        value: { type: Number },
      },
    ],
    color: { type: String, default: "#3b82f6" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Badge = mongoose.models.Badge || mongoose.model("Badge", badgeSchema);

export class BadgeService {
  static async getAll() {
    await connectDB();
    return await Badge.find({ status: true }).sort({ name: 1 }).lean();
  }

  static async getById(id) {
    await connectDB();
    const b = await Badge.findById(id).lean();
    if (!b) throw new Error("Badge not found");
    return b;
  }

  static async create(data) {
    await connectDB();
    return await Badge.create(data);
  }

  static async update(id, data) {
    await connectDB();
    const b = await Badge.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!b) throw new Error("Badge not found");
    return b;
  }

  static async delete(id) {
    await connectDB();
    const b = await Badge.findByIdAndDelete(id);
    if (!b) throw new Error("Badge not found");
    return { deleted: true, message: "Badge deleted" };
  }
}
