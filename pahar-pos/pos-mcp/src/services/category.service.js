import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export class CategoryService {
  static async getAllCategories() {
    await connectDB();
    return await Category.find({ status: true }).lean();
  }

  static async getCategoryById(id) {
    await connectDB();
    const c = await Category.findById(id).lean();
    if (!c) throw new Error("Category not found");
    return c;
  }

  static async createCategory({ name, slug, image, status = true }) {
    await connectDB();
    const finalSlug = slug || name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    try {
      return await Category.create({ name, slug: finalSlug, image, status });
    } catch (error) {
      if (error.code === 11000) throw new Error("Category with name or slug already exists");
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  static async updateCategory(id, data) {
    await connectDB();
    const c = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!c) throw new Error("Category not found");
    return c;
  }

  static async deleteCategory(idOrName) {
    await connectDB();
    let category;
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
      category = await Category.findByIdAndDelete(idOrName);
    } else {
      category = await Category.findOneAndDelete({ name: idOrName });
    }
    return { deleted: !!category, message: category ? "Category deleted" : "Category not found" };
  }
}
