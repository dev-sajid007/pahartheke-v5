import { SaleService } from "../services/sale.service.js";
import type { ToolDefinition } from "../types.js";
export const deleteSaleTool: ToolDefinition = {
  name: "delete_sale",
  description: "Delete a sale from Pahar POS",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string", description: "Sale MongoDB ObjectId" } },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      await SaleService.delete(args.id);
      return { content: [{ type: "text", text: "Sale deleted" }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  }
};
