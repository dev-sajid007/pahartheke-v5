import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, unique: true },
    barcode: { type: String, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    productType: { type: String, enum: ["weight", "piece", "packet", "bundle"], default: "piece" },
    unit: { type: String, default: "pcs" },
    purchasePrice: { type: Number, required: true, default: 0 },
    salePrice: { type: Number, required: true, default: 0 },
    currentStock: { type: Number, default: 0 },
    minimumStockAlert: { type: Number, default: 5 },
    image: { type: String, default: "" },
    status: { type: Boolean, default: true },
    hasVariants: { type: Boolean, default: false },
    variants: [
      {
        variantId: String,
        name: String,
        sku: String,
        barcode: String,
        purchasePrice: Number,
        salePrice: Number,
        currentStock: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export class ProductService {
  static async getAllProducts(filters = {}) {
    await connectDB();
    const query = { status: true };
    if (filters.category) query.category = filters.category;
    if (filters.search) query.name = { $regex: filters.search, $options: "i" };
    return await Product.find(query).populate("category", "name").sort({ name: 1 }).lean();
  }

  static async getProduct(idOrSku) {
    await connectDB();
    const query = mongoose.Types.ObjectId.isValid(idOrSku)
      ? { _id: idOrSku }
      : { sku: idOrSku };
    return await Product.findOne(query).populate("category", "name").lean();
  }

  static async createProduct(data) {
    await connectDB();
    if (!data.sku) {
      data.sku = "SKU-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    if (data.hasVariants && data.variants) {
      data.variants = data.variants.map(v => ({
        ...v,
        variantId: v.variantId || Math.random().toString(36).substring(2, 10).toUpperCase(),
        sku: v.sku || "SKU-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        currentStock: v.currentStock ?? v.stockQuantity ?? 0,
      }));
      delete data.stockQuantity;
      data.currentStock = data.variants.reduce((sum, v) => sum + (v.currentStock || 0), 0);
    } else if (data.stockQuantity !== undefined) {
      data.currentStock = data.stockQuantity;
      delete data.stockQuantity;
    }
    try {
      return await Product.create(data);
    } catch (error) {
      if (error.code === 11000) throw new Error("Product with SKU already exists");
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  static async updateProduct(id, data) {
    await connectDB();
    if (data.hasVariants && data.variants) {
      data.variants = data.variants.map(v => ({
        ...v,
        variantId: v.variantId || Math.random().toString(36).substring(2, 10).toUpperCase(),
        sku: v.sku || "SKU-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        currentStock: v.currentStock ?? v.stockQuantity ?? 0,
      }));
      delete data.stockQuantity;
      data.currentStock = data.variants.reduce((sum, v) => sum + (v.currentStock || 0), 0);
    } else if (data.stockQuantity !== undefined) {
      data.currentStock = data.stockQuantity;
      delete data.stockQuantity;
    }
    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) throw new Error("Product not found");
    return product;
  }

  static async deleteProduct(idOrSku) {
    await connectDB();
    let product;
    if (mongoose.Types.ObjectId.isValid(idOrSku)) {
      product = await Product.findByIdAndDelete(idOrSku);
    } else {
      product = await Product.findOneAndDelete({ sku: idOrSku });
    }
    return { deleted: !!product, message: product ? "Product deleted" : "Product not found" };
  }
}
