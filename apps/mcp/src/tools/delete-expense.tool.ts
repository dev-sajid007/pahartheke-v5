import { ExpenseService } from "../services/expense.service.js";
import type { ToolDefinition } from "../types.js";
export const deleteExpenseTool: ToolDefinition = {
  name: "delete_expense",
  description: "Delete an expense from Pahar POS",
  inputSchema: {
    type: "object",
    properties: { id: { type: "string" } },
    required: ["id"],
  },
  handler: async (args) => {
    try {
      await ExpenseService.delete(args.id);
      return { content: [{ type: "text", text: "Expense deleted" }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  }
};
