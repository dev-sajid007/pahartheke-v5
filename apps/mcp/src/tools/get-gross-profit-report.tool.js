import { ReportService } from "../services/report.service.js";

export const getGrossProfitReportTool = {
  name: "get_gross_profit_report",
  description: "Get gross profit report from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      startDate: { type: "string", description: "Start date (ISO)" },
      endDate: { type: "string", description: "End date (ISO)" },
    },
  },
  handler: async (args) => {
    try {
      const report = await ReportService.grossProfit(args);
      return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
