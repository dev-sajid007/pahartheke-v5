import { PurchaseCostService } from "../services/purchaseCost.service.js";

export const deletePurchaseCostTool = {
  name: "delete_purchase_cost",
  description: "Delete a purchase additional cost type from Pahar POS by ID",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "PurchaseCost MongoDB ObjectId" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    try {
      await PurchaseCostService.delete(id);
      return { content: [{ type: "text", text: "Purchase cost type deleted" }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
