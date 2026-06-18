import { CustomerService } from "../services/customer.service.js";

export const createCustomerTool = {
  name: "create_customer",
  description: "Create a new customer in the Pahar POS system",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Customer name" },
      phone: { type: "string", description: "Customer phone number" },
      email: { type: "string", description: "Optional email" },
      address: { type: "string", description: "Optional address" },
    },
    required: ["name", "phone"],
  },
  handler: async (args) => {
    try {
      const customer = await CustomerService.create(args);
      return { content: [{ type: "text", text: `Customer "${customer.name}" created (Phone: ${customer.phone})` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
