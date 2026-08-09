import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

interface ISupplier {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  companyName?: string;
  previousDue?: number;
  totalPurchaseAmount?: number;
  status?: boolean;
}

const supplierSchema = new mongoose.Schema<ISupplier>(
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

const Supplier = mongoose.models.Supplier || mongoose.model<ISupplier>("Supplier", supplierSchema);

export class SupplierService {
  static async getAll(filters: any = {}): Promise<any[]> {
    await connectDB();
    const query: Record<string, any> = { status: true };
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { phone: { $regex: filters.search, $options: "i" } },
      ];
    }
    return await Supplier.find(query).sort({ name: 1 }).lean();
  }

  static async getById(id: string): Promise<any> {
    await connectDB();
    const s = await Supplier.findById(id).lean();
    if (!s) throw new Error("Supplier not found");
    return s;
  }

  static async create(data: any): Promise<any> {
    await connectDB();
    const existing = await Supplier.findOne({ phone: data.phone });
    if (existing) throw new Error("Supplier with this phone already exists");
    return await Supplier.create(data);
  }

  static async update(id: string, data: any): Promise<any> {
    await connectDB();
    const s = await Supplier.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!s) throw new Error("Supplier not found");
    return s;
  }

  static async delete(id: string): Promise<any> {
    await connectDB();
    const s = await Supplier.findByIdAndUpdate(id, { status: false }, { new: true });
    if (!s) throw new Error("Supplier not found");
    return { deleted: true, message: "Supplier deactivated" };
  }
}
