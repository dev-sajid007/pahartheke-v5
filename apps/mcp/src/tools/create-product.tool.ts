import { ProductService } from "../services/product.service.js";
import type { ToolDefinition } from "../types.js";

/**
 * Tool to create a new POS product
 */
export const createProductTool: ToolDefinition = {
  name: "create_product",
  description: "Create a new product in the Pahar POS system",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Product name" },
      sku: { type: "string", description: "Optional unique SKU (auto-generated if not provided)" },
      barcode: { type: "string", description: "Optional barcode" },
      category: { type: "string", description: "Category ID (MongoDB ObjectId)" },
      productType: { 
        type: "string", 
        enum: ["weight", "piece", "packet", "bundle"],
        description: "Default: piece"
      },
      unit: { type: "string", description: "e.g. pcs, kg, pkt (Default: pcs)" },
      purchasePrice: { type: "number", description: "Purchase price" },
      salePrice: { type: "number", description: "Selling price" },
      stockQuantity: { type: "number", description: "Initial stock (ignored if variants are provided)" },
      minimumStockAlert: { type: "number", description: "Default: 5" },
      status: { type: "boolean", description: "Default: true" },
      hasVariants: { type: "boolean", description: "Default: false" },
      variants: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            sku: { type: "string" },
            barcode: { type: "string" },
            purchasePrice: { type: "number" },
            salePrice: { type: "number" },
            stockQuantity: { type: "number" },
          },
          required: ["name", "salePrice"],
        },
      },
    },
    required: ["name", "purchasePrice", "salePrice"],
  },
  
  handler: async (args) => {
    try {
      const product = await ProductService.createProduct(args);
      return {
        content: [
          {
            type: "text",
            text: `Product "${product.name}" created successfully with SKU: ${product.sku}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error: ${(error as Error).message}` }],
        isError: true,
      };
    }
  }
};
