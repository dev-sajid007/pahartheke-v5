import { PurchaseService } from "../services/purchase.service.js";
import type { ToolDefinition } from "../types.js";

export const getPurchaseTool: ToolDefinition = {
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
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
