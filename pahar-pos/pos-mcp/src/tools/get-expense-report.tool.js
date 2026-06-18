import { ReportService } from "../services/report.service.js";

export const getExpenseReportTool = {
  name: "get_expense_report",
  description: "Get expense report grouped by category from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      startDate: { type: "string", description: "Start date (ISO)" },
      endDate: { type: "string", description: "End date (ISO)" },
    },
  },
  handler: async (args) => {
    try {
      const report = await ReportService.expenseReport(args);
      return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
