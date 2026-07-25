import { DashboardService } from "../services/dashboard.service.js";
export const getDashboardTool = {
  name: "get_dashboard",
  description: "Get Pahar POS business summary and statistics",
  inputSchema: { type: "object", properties: {} },
  handler: async (args) => {
    try {
      const d = await DashboardService.getSummary();
      return { content: [{ type: "text", text: `📊 Pahar POS Dashboard\n\n📦 Products: ${d.totalProducts}\n👥 Customers: ${d.totalCustomers}\n🏭 Suppliers: ${d.totalSuppliers}\n\n💰 Today: ৳${d.todaySales} (${d.todayOrders} orders)\n📅 This Month: ৳${d.monthSales} (${d.monthOrders} orders)\n📈 Total Sales: ৳${d.totalSales}\n📥 Total Purchases: ৳${d.totalPurchases}\n⚠️ Low Stock: ${d.lowStockItems} items` }] };
    } catch (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
  }
};
