import { SaleService } from "../services/sale.service.js";
import type { ToolDefinition } from "../types.js";
export const getSalesTool: ToolDefinition = {
  name: "get_sales",
  description: "Retrieve sales from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      startDate: { type: "string", description: "Filter from date (ISO)" },
      endDate: { type: "string", description: "Filter to date (ISO)" },
      customerId: { type: "string" },
      limit: { type: "number", default: 20 },
    },
  },
  handler: async (args) => {
    try {
      const sales = await SaleService.getAll(args || {});
      if (sales.length === 0) return { content: [{ type: "text", text: "No sales found." }] };
      const text = sales.map(s => `#${s.invoiceNo} | ৳${s.grandTotal} | Paid: ৳${s.paidAmount} | Due: ৳${s.dueAmount} | ${new Date(s.order_date || s.createdAt).toLocaleDateString()}`).join("\n");
      return { content: [{ type: "text", text: `🧾 Sales (${sales.length}):\n${text}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  }
};
