import { CategoryService } from "../services/category.service.js";
import type { ToolDefinition } from "../types.js";

export const createCategoryTool: ToolDefinition = {
  name: "create_category",
  description: "Create a new product category in the Pahar POS system. Omit 'parent' for a top-level category, or provide a parent category ID or name to create a subcategory.",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The name of the category (e.g., 'Groceries', 'Electronics')" },
      parent: { type: "string", description: "Optional: MongoDB ObjectId or name of the parent category to create this as a subcategory under" },
      slug: { type: "string", description: "Optional: A unique URL-friendly identifier (auto-generated from name and parent if omitted)" },
      description: { type: "string", description: "Optional description of the category" },
      image: { type: "string", description: "Optional image URL" },
      status: { type: "boolean", description: "Set whether the category is active (default: true)" },
    },
    required: ["name"],
  },
  handler: async (args) => {
    try {
      const category = await CategoryService.createCategory(args);
      const parentInfo = category.parent ? ` under parent ${category.parent}` : "";
      return {
        content: [{ type: "text", text: `Category created: ${category.name} (Slug: ${category.slug})${parentInfo}` }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${(error as Error).message}` }],
        isError: true,
      };
    }
  }
};
