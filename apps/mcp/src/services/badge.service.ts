import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

interface IBadgeCondition {
  field?: string;
  operator?: string;
  value?: number;
}

interface IBadge {
  name: string;
  description?: string;
  icon?: string;
  discount?: number;
  conditions?: IBadgeCondition[];
  color?: string;
  status?: boolean;
}

const badgeSchema = new mongoose.Schema<IBadge>(
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

const Badge = mongoose.models.Badge || mongoose.model<IBadge>("Badge", badgeSchema);

export class BadgeService {
  static async getAll(): Promise<any[]> {
    await connectDB();
    return await Badge.find({ status: true }).sort({ name: 1 }).lean();
  }

  static async getById(id: string): Promise<any> {
    await connectDB();
    const b = await Badge.findById(id).lean();
    if (!b) throw new Error("Badge not found");
    return b;
  }

  static async create(data: any): Promise<any> {
    await connectDB();
    return await Badge.create(data);
  }

  static async update(id: string, data: any): Promise<any> {
    await connectDB();
    const b = await Badge.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!b) throw new Error("Badge not found");
    return b;
  }

  static async delete(id: string): Promise<any> {
    await connectDB();
    const b = await Badge.findByIdAndDelete(id);
    if (!b) throw new Error("Badge not found");
    return { deleted: true, message: "Badge deleted" };
  }
}
