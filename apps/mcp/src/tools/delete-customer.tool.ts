import { CustomerService } from "../services/customer.service.js";
import type { ToolDefinition } from "../types.js";
export const deleteCustomerTool: ToolDefinition = {
  name: "delete_customer",
  description: "Deactivate a customer in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Customer MongoDB ObjectId" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const result = await CustomerService.delete(args.id);
      return { content: [{ type: "text", text: result.message }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  }
};
