import { PurchaseCostService } from "../services/purchaseCost.service.js";
import type { ToolDefinition } from "../types.js";

export const updatePurchaseCostTool: ToolDefinition = {
  name: "update_purchase_cost",
  description: "Update a purchase additional cost type in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "PurchaseCost MongoDB ObjectId" },
      name: { type: "string" },
      description: { type: "string" },
      status: { type: "boolean" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const { id, ...data } = args;
      const pc = await PurchaseCostService.update(id, data);
      return { content: [{ type: "text", text: `Purchase cost type "${pc.name}" updated` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
