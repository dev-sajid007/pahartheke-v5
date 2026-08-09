import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

interface IStockMovement {
  product: mongoose.Types.ObjectId;
  variantId?: string;
  type: string;
  quantity: number;
  previousStock: number;
  newStock: number;
  note?: string;
  referenceId?: mongoose.Types.ObjectId;
  createdBy?: mongoose.Types.ObjectId;
}

const stockMovementSchema = new mongoose.Schema<IStockMovement>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: String },
    type: { type: String, enum: ["purchase", "sale", "adjustment", "damage", "return"], required: true },
    quantity: { type: Number, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    note: { type: String, default: "" },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const StockMovement = mongoose.models.StockMovement || mongoose.model<IStockMovement>("StockMovement", stockMovementSchema);

export class StockService {
  static async getMovements(filters: any = {}): Promise<any[]> {
    await connectDB();
    const query: Record<string, any> = {};
    if (filters.productId) query.product = filters.productId;
    if (filters.type) query.type = filters.type;
    return await StockMovement.find(query)
      .populate("product", "name sku")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
  }

  static async getLowStock(threshold: number = 5): Promise<any[]> {
    await connectDB();
    const Product = mongoose.model("Product");
    return await Product.find({ currentStock: { $lte: threshold }, status: true })
      .select("name sku currentStock unit minimumStockAlert")
      .sort({ currentStock: 1 })
      .lean();
  }

  static async createAdjustment(data: any): Promise<any> {
    await connectDB();
    const Product = mongoose.model("Product");
    const product: any = await Product.findById(data.product);
    if (!product) throw new Error("Product not found");

    let oldStock;
    if (product.hasVariants && data.variantId) {
      const v = product.variants.find((v: any) => v.variantId === data.variantId);
      if (!v) throw new Error("Variant not found");
      oldStock = v.currentStock;
      v.currentStock += data.quantity;
      product.currentStock += data.quantity;
      await product.save();
    } else {
      oldStock = product.currentStock;
      product.currentStock += data.quantity;
      await product.save();
    }

    const newStock = product.hasVariants && data.variantId
      ? product.variants.find((v: any) => v.variantId === data.variantId).currentStock
      : product.currentStock;

    return await StockMovement.create({
      product: data.product,
      variantId: data.variantId,
      type: data.type || "adjustment",
      quantity: data.quantity,
      previousStock: oldStock,
      newStock,
      note: data.note || "",
      createdBy: data.createdBy,
    });
  }
}
