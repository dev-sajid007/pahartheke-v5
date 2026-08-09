import { ReportService } from "../services/report.service.js";
import type { ToolDefinition } from "../types.js";

export const getCogsReportTool: ToolDefinition = {
  name: "get_cogs_report",
  description: "Get Cost of Goods Sold (COGS) report from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      startDate: { type: "string", description: "Start date (ISO)" },
      endDate: { type: "string", description: "End date (ISO)" },
    },
  },
  handler: async (args) => {
    try {
      const report = await ReportService.cogs(args);
      return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${(error as Error).message}` }], isError: true };
    }
  },
};
