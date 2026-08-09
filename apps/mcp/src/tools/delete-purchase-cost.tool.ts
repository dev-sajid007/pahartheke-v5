import { PurchaseCostService } from "../services/purchaseCost.service.js";
import type { ToolDefinition } from "../types.js";

export const deletePurchaseCostTool: ToolDefinition = {
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
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
