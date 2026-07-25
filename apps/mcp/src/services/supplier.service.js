import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const supplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    companyName: { type: String, default: "" },
    previousDue: { type: Number, default: 0 },
    totalPurchaseAmount: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Supplier = mongoose.models.Supplier || mongoose.model("Supplier", supplierSchema);

export class SupplierService {
  static async getAll(filters = {}) {
    await connectDB();
    const query = { status: true };
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { phone: { $regex: filters.search, $options: "i" } },
      ];
    }
    return await Supplier.find(query).sort({ name: 1 }).lean();
  }

  static async getById(id) {
    await connectDB();
    const s = await Supplier.findById(id).lean();
    if (!s) throw new Error("Supplier not found");
    return s;
  }

  static async create(data) {
    await connectDB();
    const existing = await Supplier.findOne({ phone: data.phone });
    if (existing) throw new Error("Supplier with this phone already exists");
    return await Supplier.create(data);
  }

  static async update(id, data) {
    await connectDB();
    const s = await Supplier.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!s) throw new Error("Supplier not found");
    return s;
  }

  static async delete(id) {
    await connectDB();
    const s = await Supplier.findByIdAndUpdate(id, { status: false }, { new: true });
    if (!s) throw new Error("Supplier not found");
    return { deleted: true, message: "Supplier deactivated" };
  }
}
