import { CustomerService } from "../services/customer.service.js";

export const getCustomerTool = {
  name: "get_customer",
  description: "Get a single customer by MongoDB ObjectId from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Customer MongoDB ObjectId" },
    },
    required: ["id"],
  },
  handler: async ({ id }) => {
    try {
      const customer = await CustomerService.getById(id);
      return { content: [{ type: "text", text: JSON.stringify(customer, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
