import { ReportService } from "../services/report.service.js";

export const getProductWiseSalesReportTool = {
  name: "get_product_wise_sales_report",
  description: "Get product-wise sales report from Pahar POS",
  inputSchema: {
    type: "object",
    properties: {
      startDate: { type: "string", description: "Start date (ISO)" },
      endDate: { type: "string", description: "End date (ISO)" },
    },
  },
  handler: async (args) => {
    try {
      const report = await ReportService.productWiseSales(args);
      return { content: [{ type: "text", text: JSON.stringify(report, null, 2) }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  },
};
