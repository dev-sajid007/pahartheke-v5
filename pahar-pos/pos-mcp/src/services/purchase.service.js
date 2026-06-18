import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const purchaseItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String, default: null },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
  },
  { _id: false }
);

const purchaseSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    items: [purchaseItemSchema],
    additionalCosts: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);

export class PurchaseService {
  static async getAll(filters = {}) {
    await connectDB();
    const query = {};
    if (filters.supplierId) query.supplier = filters.supplierId;
    return await Purchase.find(query)
      .populate("supplier", "name")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }

  static async getById(id) {
    await connectDB();
    const p = await Purchase.findById(id)
      .populate("supplier")
      .populate("items.product", "name")
      .lean();
    if (!p) throw new Error("Purchase not found");
    return p;
  }

  static async create(data) {
    await connectDB();
    const invoiceNo = data.invoiceNo || "PUR-" + Date.now();
    const dueAmount = data.totalAmount - (data.paidAmount || 0);
    return await Purchase.create({ ...data, invoiceNo, dueAmount });
  }

  static async delete(id) {
    await connectDB();
    const p = await Purchase.findByIdAndDelete(id);
    if (!p) throw new Error("Purchase not found");
    return { deleted: true, message: "Purchase deleted" };
  }
}
