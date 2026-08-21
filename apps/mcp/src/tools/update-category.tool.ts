import { CategoryService } from "../services/category.service.js";
import type { ToolDefinition } from "../types.js";

export const updateCategoryTool: ToolDefinition = {
  name: "update_category",
  description: "Update a product category in Pahar POS by ID. Supports changing name, parent (to move it under another category or make it top-level), description, image, slug, and status.",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Category MongoDB ObjectId" },
      name: { type: "string" },
      parent: { type: "string", description: "New parent category MongoDB ObjectId or name. Use empty string to make it a top-level category" },
      description: { type: "string" },
      slug: { type: "string" },
      image: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const { id, ...data } = args;
      const c = await CategoryService.updateCategory(id, data);
      return { content: [{ type: "text", text: `Category "${c.name}" updated (Slug: ${c.slug})` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
