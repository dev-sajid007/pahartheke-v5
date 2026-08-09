import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

interface ISaleItem {
  product: mongoose.Types.ObjectId;
  variantId?: string;
  variantName?: string;
  quantity: number;
  salePrice: number;
  subtotal: number;
  cost: number;
  profit: number;
}

interface ISale {
  invoiceNo?: string;
  customer?: mongoose.Types.ObjectId;
  items?: ISaleItem[];
  subtotal: number;
  shippingCost?: number;
  discount?: number;
  badgeName?: string;
  badgeDiscount?: number;
  grandTotal: number;
  paidAmount?: number;
  dueAmount?: number;
  totalCost: number;
  totalProfit: number;
  source?: string;
  note?: string;
  soldBy?: mongoose.Types.ObjectId;
  order_date?: Date;
}

const saleItemSchema = new mongoose.Schema<ISaleItem>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String },
    variantName: { type: String },
    quantity: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    cost: { type: Number, required: true },
    profit: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema<ISale>(
  {
    invoiceNo: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    items: [saleItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    badgeName: { type: String },
    badgeDiscount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    totalProfit: { type: Number, required: true },
    source: { type: String, enum: ["pos", "website"], default: "pos" },
    note: { type: String, default: "" },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order_date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Sale = mongoose.models.Sale || mongoose.model<ISale>("Sale", saleSchema);

export class SaleService {
  static async getAll(filters: any = {}): Promise<any[]> {
    await connectDB();
    const query: Record<string, any> = {};
    if (filters.startDate) query.order_date = { $gte: new Date(filters.startDate) };
    if (filters.endDate) {
      query.order_date = { ...query.order_date, $lte: new Date(filters.endDate) };
    }
    if (filters.customerId) query.customer = filters.customerId;
    return await Sale.find(query)
      .populate("customer", "name phone")
      .populate("soldBy", "name")
      .sort({ order_date: -1 })
      .limit(filters.limit || 50)
      .lean();
  }

  static async getById(id: string): Promise<any> {
    await connectDB();
    const s = await Sale.findById(id)
      .populate("customer")
      .populate("items.product", "name")
      .populate("soldBy", "name")
      .lean();
    if (!s) throw new Error("Sale not found");
    return s;
  }

  static async getByInvoice(invoiceNo: string): Promise<any> {
    await connectDB();
    return await Sale.findOne({ invoiceNo })
      .populate("customer")
      .populate("soldBy", "name")
      .lean();
  }

  static async create(data: any): Promise<any> {
    await connectDB();
    const invoiceNo = data.invoiceNo || "SALE-" + Date.now();
    const dueAmount = data.grandTotal - (data.paidAmount || 0);
    return await Sale.create({
      ...data,
      invoiceNo,
      dueAmount,
      source: data.source || "pos",
    });
  }

  static async delete(id: string): Promise<any> {
    await connectDB();
    const s = await Sale.findByIdAndDelete(id);
    if (!s) throw new Error("Sale not found");
    return { deleted: true, message: "Sale deleted" };
  }
}
