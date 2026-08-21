import mongoose from "mongoose";
import { connectDB } from "../utils/db.js";

interface ICategory {
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent?: mongoose.Types.ObjectId | null;
  status?: boolean;
}

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null, index: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1, name: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

const slugify = (name: string) =>
  name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

async function validateParent(parent: string | null | undefined): Promise<any> {
  if (!parent) return null;
  if (mongoose.Types.ObjectId.isValid(parent)) {
    const p = await Category.findById(parent);
    if (!p) throw new Error("Parent category not found");
    return p;
  }
  const p = await Category.findOne({ name: parent });
  if (!p) throw new Error(`Parent category not found: "${parent}"`);
  return p;
}

export async function getDescendantIds(parentId: string | mongoose.Types.ObjectId): Promise<any[]> {
  const descendantIds: any[] = [];
  let frontier = [parentId];

  while (frontier.length > 0) {
    const children = await Category.find({ parent: { $in: frontier } }).select("_id");
    if (children.length === 0) break;
    const childIds = children.map((child) => child._id);
    descendantIds.push(...childIds);
    frontier = childIds;
  }

  return descendantIds;
}

async function buildPathSlug(parentId: string | mongoose.Types.ObjectId | null, name: string): Promise<string> {
  const base = slugify(name);
  if (!parentId) return base;
  const parent = await Category.findById(parentId).select("slug");
  if (!parent) return base;
  return `${parent.slug}-${base}`;
}

export class CategoryService {
  static async getAllCategories(): Promise<any[]> {
    await connectDB();
    return await Category.find({ status: true }).populate("parent", "name slug").lean();
  }

  static async getCategoryById(id: string): Promise<any> {
    await connectDB();
    const c = await Category.findById(id).populate("parent", "name slug").lean();
    if (!c) throw new Error("Category not found");
    return c;
  }

  static async createCategory({
    name,
    slug,
    image,
    description,
    parent,
    status = true,
  }: {
    name: string;
    slug?: string;
    image?: string;
    description?: string;
    parent?: string;
    status?: boolean;
  }): Promise<any> {
    await connectDB();
    const parentCategory = await validateParent(parent);
    const parentId = parentCategory?._id || null;

    const exists = await Category.findOne({ name, parent: parentId });
    if (exists) throw new Error("Category with this name already exists under the same parent");

    const finalSlug = slug || (await buildPathSlug(parentId, name));
    try {
      return await Category.create({ name, slug: finalSlug, image, description, parent: parentId, status });
    } catch (error) {
      if ((error as any).code === 11000) throw new Error("Category with name or slug already exists");
      throw new Error(`Failed to create category: ${(error as Error).message}`);
    }
  }

  static async updateCategory(id: string, data: any): Promise<any> {
    await connectDB();
    const { name, slug, image, description, parent, status } = data;

    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");

    let newParent = category.parent;
    if (parent !== undefined) {
      const parentCategory = await validateParent(parent);
      if (parentCategory && String(parentCategory._id) === String(category._id)) {
        throw new Error("Category cannot be its own parent");
      }
      if (parentCategory) {
        const descendantIds = await getDescendantIds(category._id);
        if (descendantIds.some((descId) => String(descId) === String(parentCategory._id))) {
          throw new Error("Category cannot be moved under its own subcategory");
        }
      }
      newParent = parentCategory?._id || null;
    }

    const parentChanged =
      parent !== undefined && String(newParent || null) !== String(category.parent || null);

    if (name && name !== category.name) {
      const exists = await Category.findOne({
        name,
        parent: parent !== undefined ? newParent : category.parent || null,
        _id: { $ne: category._id },
      });
      if (exists) throw new Error("Category with this name already exists under the same parent");
      category.name = name;
    }

    if (name || parentChanged) {
      category.slug = slug || (await buildPathSlug(parent !== undefined ? newParent : category.parent, category.name));
    }

    if (parent !== undefined) category.parent = newParent;
    if (status !== undefined) category.status = status;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;

    await category.save();
    return category;
  }

  static async deleteCategory(idOrName: string): Promise<any> {
    await connectDB();
    let category;
    if (mongoose.Types.ObjectId.isValid(idOrName)) {
      category = await Category.findById(idOrName);
    } else {
      category = await Category.findOne({ name: idOrName });
    }
    if (!category) return { deleted: false, message: "Category not found" };

    const hasChildren = await Category.exists({ parent: category._id });
    if (hasChildren) {
      return { deleted: false, message: "Cannot delete: delete or move its subcategories first" };
    }

    await category.deleteOne();
    return { deleted: true, message: "Category deleted" };
  }
}
