import { PurchaseService } from "../services/purchase.service.js";
export const getPurchasesTool = {
  name: "get_purchases",
  description: "Retrieve purchase orders from Pahar POS",
  inputSchema: {
    type: "object",
    properties: { supplierId: { type: "string" } },
  },
  handler: async (args) => {
    try {
      const ps = await PurchaseService.getAll(args || {});
      return { content: [{ type: "text", text: ps.length === 0 ? "No purchases found." : `📥 Purchases (${ps.length}):\n` + ps.map(p => `- ${p.invoiceNo} | Total: ৳${p.totalAmount} | Paid: ৳${p.paidAmount} | Due: ৳${p.dueAmount} | ${new Date(p.createdAt).toLocaleDateString()}`).join("\n") }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
