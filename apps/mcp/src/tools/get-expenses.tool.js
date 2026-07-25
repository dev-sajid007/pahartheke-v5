import { ExpenseService } from "../services/expense.service.js";
export const getExpensesTool = {
  name: "get_expenses",
  description: "Retrieve expenses from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      category: { type: "string" },
      startDate: { type: "string" },
      endDate: { type: "string" },
    },
  },
  handler: async (args) => {
    try {
      const expenses = await ExpenseService.getAll(args || {});
      const total = expenses.reduce((s, e) => s + e.amount, 0);
      return { content: [{ type: "text", text: expenses.length === 0 ? "No expenses found." : `💰 Expenses (${expenses.length}) — Total: ৳${total}\n` + expenses.map(e => `- ${e.title} [${e.category}]: ৳${e.amount} (${new Date(e.createdAt).toLocaleDateString()})`).join("\n") }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
