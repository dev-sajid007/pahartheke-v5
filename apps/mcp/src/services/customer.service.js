import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    previousDue: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
    loyaltyPoints: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export class CustomerService {
  static async getAll(filters = {}) {
    await connectDB();
    const query = { status: true };
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { phone: { $regex: filters.search, $options: "i" } },
      ];
    }
    return await Customer.find(query).populate("badge").sort({ name: 1 }).lean();
  }

  static async getById(id) {
    await connectDB();
    const customer = await Customer.findById(id).populate("badge").lean();
    if (!customer) throw new Error("Customer not found");
    return customer;
  }

  static async create(data) {
    await connectDB();
    const existing = await Customer.findOne({ phone: data.phone });
    if (existing) throw new Error("Customer with this phone already exists");
    return await Customer.create(data);
  }

  static async update(id, data) {
    await connectDB();
    const customer = await Customer.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!customer) throw new Error("Customer not found");
    return customer;
  }

  static async delete(id) {
    await connectDB();
    const customer = await Customer.findByIdAndUpdate(id, { status: false }, { new: true });
    if (!customer) throw new Error("Customer not found");
    return { deleted: true, message: "Customer deactivated" };
  }
}
