import { PurchaseCostService } from "../services/purchaseCost.service.js";
import type { ToolDefinition } from "../types.js";

export const getPurchaseCostsTool: ToolDefinition = {
  name: "get_purchase_costs",
  description: "Retrieve all purchase additional cost types from Pahar POS",
  inputSchema: { type: "object", properties: {} },
  handler: async () => {
    try {
      const costs = await PurchaseCostService.getAll();
      return { content: [{ type: "text", text: JSON.stringify(costs, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
