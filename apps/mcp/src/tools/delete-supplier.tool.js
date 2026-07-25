import { SupplierService } from "../services/supplier.service.js";
export const deleteSupplierTool = {
  name: "delete_supplier",
  description: "Deactivate a supplier in Pahar POS",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string", description: "Supplier MongoDB ObjectId" } },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      await SupplierService.delete(args.id);
      return { content: [{ type: "text", text: "Supplier deactivated" }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
