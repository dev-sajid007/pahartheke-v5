import { ExpenseService } from "../services/expense.service.js";
import type { ToolDefinition } from "../types.js";

export const createExpenseTool: ToolDefinition = {
  name: "create_expense",
  description: "Create a new expense in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Expense title" },
      category: { type: "string", enum: ["General", "Utilities", "Rent", "Salary", "Maintenance", "Marketing", "Other"], default: "General" },
      amount: { type: "number", description: "Expense amount" },
      note: { type: "string" },
      createdBy: { type: "string", description: "User MongoDB ObjectId" },
    },
    required: ["title", "amount"],
  },
  handler: async (args) => {
    try {
      const e = await ExpenseService.create(args);
      return { content: [{ type: "text", text: `Expense recorded: ${e.title} — ৳${e.amount}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
