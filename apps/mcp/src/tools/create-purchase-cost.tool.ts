import { PurchaseCostService } from "../services/purchaseCost.service.js";
import type { ToolDefinition } from "../types.js";

export const createPurchaseCostTool: ToolDefinition = {
  name: "create_purchase_cost",
  description: "Create a new purchase additional cost type in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Cost type name (e.g. Transport, Labour)" },
      description: { type: "string" },
      status: { type: "boolean", default: true },
    },
    required: ["name"],
  },
  handler: async (args) => {
    try {
      const pc = await PurchaseCostService.create(args);
      return { content: [{ type: "text", text: `Purchase cost type "${pc.name}" created` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
