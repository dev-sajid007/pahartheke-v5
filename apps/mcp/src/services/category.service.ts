import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

interface ICategory {
  name: string;
  slug: string;
  image?: string;
  status?: boolean;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export class CategoryService {
  static async getAllCategories(): Promise<any[]> {
    await connectDB();
    return await Category.find({ status: true }).lean();
  }

  static async getCategoryById(id: string): Promise<any> {
    await connectDB();
    const c = await Category.findById(id).lean();
    if (!c) throw new Error("Category not found");
    return c;
  }

  static async createCategory({ name, slug, image, status = true }: { name: string; slug?: string; image?: string; status?: boolean }): Promise<any> {
    await connectDB();
    const finalSlug = slug || name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    try {
      return await Category.create({ name, slug: finalSlug, image, status });
    } catch (error) {
      if ((error as any).code === 11000) throw new Error("Category with name or slug already exists");
      throw new Error(`Failed to create category: ${(error as Error).message}`);
    }
  }

  static async updateCategory(id: string, data: any): Promise<any> {
    await connectDB();
    const c = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!c) throw new Error("Category not found");
    return c;
  }

  static async deleteCategory(idOrName: string): Promise<any> {
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
