import { SupplierService } from "../services/supplier.service.js";

export const createSupplierTool = {
  name: "create_supplier",
  description: "Create a new supplier in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Supplier name" },
      companyName: { type: "string", description: "Company name" },
      phone: { type: "string", description: "Phone number" },
      email: { type: "string" },
      address: { type: "string" },
    },
    required: ["name", "phone"],
  },
  handler: async (args) => {
    try {
      const s = await SupplierService.create(args);
      return { content: [{ type: "text", text: `Supplier "${s.name}" created` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
