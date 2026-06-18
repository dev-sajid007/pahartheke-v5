"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, Package, AlertCircle, 
  DollarSign, ArrowUpRight, ArrowDownRight, CreditCard,
  AlertTriangle
} from "lucide-react";
import api from "@/lib/axios";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayProfit: 0,
    monthlySales: 0,
    netProfit: 0,
    totalExpense: 0,
    lowStockProducts: [],
    topSellingProducts: [],
    recentSales: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/dashboard/stats");
      if (res.data.data) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent shadow-sm">
            Export Report
          </button>
          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20">
            Create Sale
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-sidebar-foreground">Today's Sales</h3>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">৳ {stats.todaySales?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-sidebar-foreground">Net Profit (Today)</h3>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">৳ {stats.todayProfit?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-sidebar-foreground">Monthly Sales</h3>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">৳ {stats.monthlySales?.toLocaleString() || 0}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-sidebar-foreground">Low Stock Items</h3>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{stats.lowStockProducts?.length || 0}</span>
            <span className="text-xs font-medium text-rose-500 flex items-center">
              Requires attention
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Recent Sales & Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Recent Sales Table */}
        <div className="col-span-1 lg:col-span-2 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground">Recent Sales</h2>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-sidebar-foreground">
              <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
                <tr>
                  <th className="px-6 py-4 font-semibold">Invoice</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
              {stats.recentSales?.map((sale, i) => (
                <tr key={i} className="hover:bg-sidebar-accent/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{sale.invoiceNo}</td>
                  <td className="px-6 py-4">{sale.customer?.name || "Walk-in Customer"}</td>
                  <td className="px-6 py-4 font-semibold text-emerald-600 text-right">৳ {sale.subtotal - sale.discount}</td>
                </tr>
              ))}
              {(!stats.recentSales || stats.recentSales.length === 0) && (
                <tr><td colSpan="3" className="px-6 py-8 text-center text-sidebar-foreground">No recent sales</td></tr>
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-border bg-card shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              Top Selling Products
            </h2>
          </div>
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {stats.topSellingProducts?.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name || item.productName || 'Unknown'}</p>
                      <p className="text-xs text-sidebar-foreground">{item.soldQuantity || item.totalQty || 0} units sold</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    ৳ {(item.totalRevenue || item.totalSales || 0).toLocaleString()}
                  </div>
                </div>
              ))}
              {(!stats.topSellingProducts || stats.topSellingProducts.length === 0) && (
                <p className="text-sm text-center text-sidebar-foreground py-4">No top products yet.</p>
              )}
            </div>
            
            <button className="mt-8 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent">
              View Inventory
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
