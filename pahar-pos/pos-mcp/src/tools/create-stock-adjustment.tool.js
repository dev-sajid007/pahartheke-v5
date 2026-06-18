import { StockService } from "../services/stock.service.js";

export const createStockAdjustmentTool = {
  name: "create_stock_adjustment",
  description: "Create a stock adjustment or damage entry in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      product: { type: "string", description: "Product MongoDB ObjectId" },
      variantId: { type: "string", description: "Variant ID (if product has variants)" },
      quantity: { type: "number", description: "Positive to add stock, negative to remove" },
      type: { type: "string", enum: ["adjustment", "damage"], default: "adjustment" },
      note: { type: "string" },
      createdBy: { type: "string", description: "User MongoDB ObjectId" },
    },
    required: ["product", "quantity"],
  },
  handler: async (args) => {
    try {
      const movement = await StockService.createAdjustment(args);
      const sign = args.quantity >= 0 ? "added to" : "removed from";
      return { content: [{ type: "text", text: `Stock adjusted (${Math.abs(args.quantity)}) ${sign} product. New stock level: ${movement.newStock}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
