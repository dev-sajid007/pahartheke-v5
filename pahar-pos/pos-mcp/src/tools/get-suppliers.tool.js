import { SupplierService } from "../services/supplier.service.js";
export const getSuppliersTool = {
  name: "get_suppliers",
  description: "Retrieve all suppliers from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      search: { type: "string", description: "Search by name or phone" },
    },
  },
  handler: async (args) => {
    try {
      const suppliers = await SupplierService.getAll(args || {});
      const text = suppliers.length === 0 ? "No suppliers found." : suppliers.map(s => `- ${s.name} (${s.companyName || "N/A"}) | Phone: ${s.phone} | Due: ৳${s.previousDue} | Total: ৳${s.totalPurchaseAmount}`).join("\n");
      return { content: [{ type: "text", text: `📦 Suppliers (${suppliers.length}):\n${text}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
