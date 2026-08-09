import { ProductService } from "../services/product.service.js";
import type { ToolDefinition } from "../types.js";

/**
 * Tool to update an existing POS product
 */
export const updateProductTool: ToolDefinition = {
  name: "update_product",
  description: "Update an existing product in the Pahar POS system using its ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "The MongoDB ObjectId of the product to update" },
      name: { type: "string" },
      sku: { type: "string" },
      barcode: { type: "string" },
      category: { type: "string" },
      productType: { type: "string", enum: ["weight", "piece", "packet", "bundle"] },
      unit: { type: "string" },
      purchasePrice: { type: "number" },
      salePrice: { type: "number" },
      stockQuantity: { type: "number" },
      minimumStockAlert: { type: "number" },
      status: { type: "boolean" },
      hasVariants: { type: "boolean" },
      variants: {
        type: "array",
        items: {
          type: "object",
          properties: {
            variantId: { type: "string" },
            name: { type: "string" },
            sku: { type: "string" },
            barcode: { type: "string" },
            purchasePrice: { type: "number" },
            salePrice: { type: "number" },
            stockQuantity: { type: "number" },
          },
        },
      },
    },
    required: ["id"],
  },
  
  handler: async (args) => {
    try {
      const { id, ...updateData } = args;
      const product = await ProductService.updateProduct(id, updateData);
      return {
        content: [
          {
            type: "text",
            text: `Product "${product.name}" (SKU: ${product.sku}) updated successfully.`,
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
