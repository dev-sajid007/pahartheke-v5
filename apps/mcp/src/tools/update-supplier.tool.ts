import { SupplierService } from "../services/supplier.service.js";
import type { ToolDefinition } from "../types.js";

export const updateSupplierTool: ToolDefinition = {
  name: "update_supplier",
  description: "Update a supplier in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Supplier MongoDB ObjectId" },
      name: { type: "string" },
      companyName: { type: "string" },
      phone: { type: "string" },
      email: { type: "string" },
      address: { type: "string" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const { id, ...data } = args;
      const s = await SupplierService.update(id, data);
      return { content: [{ type: "text", text: `Supplier "${s.name}" updated` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
