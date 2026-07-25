import { CustomerService } from "../services/customer.service.js";
export const getCustomersTool = {
  name: "get_customers",
  description: "Retrieve all active customers from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      search: { type: "string", description: "Optional search by name or phone" },
    },
  },
  handler: async (args) => {
    try {
      const customers = await CustomerService.getAll(args || {});
      const text = customers.length === 0
        ? "No customers found."
        : customers.map(c => `- ${c.name} (${c.phone}) | Orders: ${c.totalOrders} | Spent: ৳${c.totalSpent} | Due: ৳${c.previousDue} | Points: ${c.loyaltyPoints}`).join("\n");
      return { content: [{ type: "text", text: `📋 Customers (${customers.length}):\n${text}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
