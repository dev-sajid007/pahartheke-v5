import { CategoryService } from "../services/category.service.js";
import type { ToolDefinition } from "../types.js";

export const deleteCategoryTool: ToolDefinition = {
  name: "delete_category",
  description: "Delete a product category from the Pahar POS system by ID or name. A category that still has subcategories cannot be deleted.",
  inputSchema: {
    type: "object",
    properties: {
      idOrName: {
        type: "string",
        description: "The MongoDB ObjectId or name of the category to delete",
      },
    },
    required: ["idOrName"],
  },

  handler: async ({ idOrName }) => {
    const result = await CategoryService.deleteCategory(idOrName);

    if (!result.deleted) {
      return {
        content: [
          {
            type: "text",
            text: result.message || `Category not found: "${idOrName}"`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Category "${idOrName}" has been deleted successfully.`,
        },
      ],
    };
  },
};
