import { CategoryService } from "../services/category.service.js";

export const createCategoryTool = {
  name: "create_category",
  description: "Create a new product category in the Pahar POS system",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "The name of the category (e.g., 'Groceries', 'Electronics')" },
      slug: { type: "string", description: "Optional: A unique URL-friendly identifier" },
      image: { type: "string", description: "Optional image URL" },
      status: { type: "boolean", description: "Set whether the category is active (default: true)" },
    },
    required: ["name"],
  },
  handler: async (args) => {
    const category = await CategoryService.createCategory(args);
    return {
      content: [{ type: "text", text: `Category created: ${category.name} (Slug: ${category.slug})` }],
    };
  }
};
