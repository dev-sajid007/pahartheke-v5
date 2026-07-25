import { PurchaseService } from "../services/purchase.service.js";
export const deletePurchaseTool = {
  name: "delete_purchase",
  description: "Delete a purchase order from Pahar POS",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string", description: "Purchase MongoDB ObjectId" } },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const result = await PurchaseService.delete(args.id);
      return { content: [{ type: "text", text: result.message }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
