import { StockService } from "../services/stock.service.js";

export const getLowStockTool = {
  name: "get_low_stock",
  description: "Get products with low stock (below threshold)",
  inputSchema: {
    type: "object",
    properties: {
      threshold: { type: "number", default: 5, description: "Stock threshold" },
    },
  },
  handler: async (args) => {
    try {
      const items = await StockService.getLowStock(args.threshold || 5);
      return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
