import { ProductService } from "../services/product.service.js";
import type { ToolDefinition } from "../types.js";

export const getProductsTool: ToolDefinition = {
  name: "get_products",
  description: "Retrieve active products from the Pahar POS system with optional filtering by category or search term. Filtering by a category also includes its subcategories.",
  inputSchema: {
    type: "object",
    properties: {
      category: { type: "string", description: "Optional MongoDB ObjectId of the category to filter by (includes its subcategories)" },
      search: { type: "string", description: "Optional search term to filter products by name" },
    },
  },
  handler: async (args) => {
    const { category, search } = args || {};
    const products = await ProductService.getAllProducts({ category, search });
    if (products.length === 0) {
      return { content: [{ type: "text", text: "No products found matching the criteria." }] };
    }
    const productList = products.map(p => {
      const categoryName = p.category ? ` [${p.category.name}]` : "";
      return `- ${p.name}${categoryName}\n  Price: ৳${p.salePrice} | Stock: ${p.currentStock} ${p.unit || "pcs"} | SKU: ${p.sku || "N/A"}`;
    }).join("\n\n");
    return { content: [{ type: "text", text: `Found ${products.length} products:\n\n${productList}` }] };
  }
};
