import { CategoryService } from "../services/category.service.js";

/**
 * Tool to fetch all POS categories
 */
export const getCategoriesTool = {
  name: "get_categories",
  description: "Retrieve all active product categories from the Pahar POS system",
  inputSchema: {
    type: "object",
    properties: {}, // No input needed
  },
  
  handler: async () => {
    const categories = await CategoryService.getAllCategories();
    
    if (categories.length === 0) {
      return {
        content: [{ type: "text", text: "No active categories found." }],
      };
    }

    const categoryList = categories
      .map(c => `- ${c.name} (Slug: ${c.slug})`)
      .join("\n");

    return {
      content: [
        {
          type: "text",
          text: `Found ${categories.length} categories:\n\n${categoryList}`,
        },
      ],
    };
  }
};
