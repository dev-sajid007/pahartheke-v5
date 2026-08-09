import { StockService } from "../services/stock.service.js";
import type { ToolDefinition } from "../types.js";

export const getStockMovementsTool: ToolDefinition = {
  name: "get_stock_movements",
  description: "Retrieve stock movement history from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      productId: { type: "string" },
      type: { type: "string", enum: ["purchase", "sale", "adjustment", "damage", "return"] },
    },
  },
  handler: async (args) => {
    try {
      const movements = await StockService.getMovements(args);
      return { content: [{ type: "text", text: JSON.stringify(movements, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
