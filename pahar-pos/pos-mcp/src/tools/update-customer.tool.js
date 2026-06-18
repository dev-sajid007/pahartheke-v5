import { CustomerService } from "../services/customer.service.js";

export const updateCustomerTool = {
  name: "update_customer",
  description: "Update an existing customer in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Customer MongoDB ObjectId" },
      name: { type: "string" },
      phone: { type: "string" },
      email: { type: "string" },
      address: { type: "string" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const { id, ...data } = args;
      const c = await CustomerService.update(id, data);
      return { content: [{ type: "text", text: `Customer "${c.name}" updated` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
