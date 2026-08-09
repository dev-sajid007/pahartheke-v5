import { ExpenseService } from "../services/expense.service.js";
import type { ToolDefinition } from "../types.js";

export const updateExpenseTool: ToolDefinition = {
  name: "update_expense",
  description: "Update an existing expense in Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      id: { type: "string", description: "Expense MongoDB ObjectId" },
      title: { type: "string" },
      category: { type: "string", enum: ["General", "Utilities", "Rent", "Salary", "Maintenance", "Marketing", "Other"] },
      amount: { type: "number" },
      note: { type: "string" },
    },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      const { id, ...data } = args;
      const e = await ExpenseService.update(id, data);
      return { content: [{ type: "text", text: `Expense "${e.title}" updated — ৳${e.amount}` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
