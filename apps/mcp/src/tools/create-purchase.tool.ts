import { PurchaseService } from "../services/purchase.service.js";
import type { ToolDefinition } from "../types.js";

export const createPurchaseTool: ToolDefinition = {
  name: "create_purchase",
  description: "Create a new purchase order in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      supplier: { type: "string", description: "Supplier MongoDB ObjectId" },
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            product: { type: "string", description: "Product MongoDB ObjectId" },
            variantId: { type: "string" },
            quantity: { type: "number" },
            purchasePrice: { type: "number" },
            subtotal: { type: "number" },
          },
          required: ["product", "quantity", "purchasePrice", "subtotal"],
        },
      },
      additionalCosts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            amount: { type: "number" },
          },
        },
      },
      totalAmount: { type: "number", description: "Total amount including additional costs" },
      paidAmount: { type: "number", default: 0 },
      note: { type: "string" },
    },
    required: ["items", "totalAmount"],
  },
  handler: async (args) => {
    try {
      const p = await PurchaseService.create(args);
      return { content: [{ type: "text", text: `Purchase created! Invoice: ${p.invoiceNo} | Total: ৳${p.totalAmount} | Due: ৳${p.dueAmount}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
