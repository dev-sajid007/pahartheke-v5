import { CategoryService } from "../services/category.service.js";
import type { ToolDefinition } from "../types.js";

export const updateCategoryTool: ToolDefinition = {
  name: "update_category",
  description: "Update a product category in Pahar POS by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Category MongoDB ObjectId" },
      name: { type: "string" },
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
      return { content: [{ type: "text", text: `Category "${c.name}" updated` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
