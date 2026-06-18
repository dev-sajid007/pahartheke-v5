import { ProductService } from "../services/product.service.js";

export const deleteProductTool = {
  name: "delete_product",
  description: "Delete a product from the Pahar POS system by ID or SKU",
  inputSchema: {
    type: "object",
    properties: {
      idOrSku: {
        type: "string",
        description: "The MongoDB ObjectId or SKU of the product to delete",
      },
    },
    required: ["idOrSku"],
  },

  handler: async ({ idOrSku }) => {
    const result = await ProductService.deleteProduct(idOrSku);

    if (!result.deleted) {
      return {
        content: [
          {
            type: "text",
            text: `Product not found: "${idOrSku}"`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Product "${idOrSku}" has been deleted successfully.`,
        },
      ],
    };
  },
};
