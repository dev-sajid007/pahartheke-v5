import { PurchaseService } from "../services/purchase.service.js";

export const getPurchaseTool = {
  name: "get_purchase",
  description: "Get a single purchase order by MongoDB ObjectId from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Purchase MongoDB ObjectId" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    try {
      const purchase = await PurchaseService.getById(id);
      return { content: [{ type: "text", text: JSON.stringify(purchase, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
