import { SupplierService } from "../services/supplier.service.js";

export const getSupplierTool = {
  name: "get_supplier",
  description: "Get a single supplier by MongoDB ObjectId from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Supplier MongoDB ObjectId" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    try {
      const supplier = await SupplierService.getById(id);
      return { content: [{ type: "text", text: JSON.stringify(supplier, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
