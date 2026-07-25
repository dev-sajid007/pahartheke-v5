"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Search, Printer, Download, Banknote, ShoppingBag, Receipt, ArrowUpRight } from "lucide-react";
import api from "@/lib/axios";

export default function DailySalesReport() {
  const [dateRange, setDateRange] = useState({ start: new Date().toISOString().split('T')[0], end: new Date().toISOString().split('T')[0] });
  const [data, setData] = useState({ sales: [], summary: {} });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const params = dateRange.start === dateRange.end 
        ? `date=${dateRange.start}` 
        : `startDate=${dateRange.start}&endDate=${dateRange.end}`;
      const res = await api.get(`/reports/daily-sales?${params}`);
      if (res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => window.print();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0).replace('BDT', '৳');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Daily Sales Report</h1>
          <p className="text-sm font-bold text-sidebar-foreground mt-1">Detailed analysis of sales for a specific date</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
               <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
               <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm font-bold outline-none focus:border-primary transition-all shadow-sm"
               />
            </div>
            <span className="text-sidebar-foreground font-bold">→</span>
            <div className="relative">
               <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
               <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm font-bold outline-none focus:border-primary transition-all shadow-sm"
               />
            </div>
          </div>
          <button onClick={handlePrint} className="p-2.5 rounded-xl border border-border bg-card text-sidebar-foreground hover:text-primary transition-all shadow-sm">
             <Printer className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sales", value: formatCurrency(data.summary.totalSales), icon: Banknote, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Invoices", value: data.summary.totalInvoices || 0, icon: Receipt, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Items Sold", value: data.summary.totalItems || 0, icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Total Paid", value: formatCurrency(data.summary.totalPaid), icon: ArrowUpRight, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-black text-sidebar-foreground uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-foreground mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Sales List Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-sidebar-accent/20">
          <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Invoices {dateRange.start === dateRange.end ? 'for ' + new Date(dateRange.start).toLocaleDateString() : 'from ' + new Date(dateRange.start).toLocaleDateString() + ' to ' + new Date(dateRange.end).toLocaleDateString()}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sidebar-accent/30 text-sidebar-foreground">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Invoice No</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Paid</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-right">Due</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                 <tr><td colSpan="6" className="px-6 py-10 text-center text-sidebar-foreground italic">Loading...</td></tr>
              ) : data.sales.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-sidebar-foreground italic">No sales found for this period</td></tr>
              ) : data.sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-sidebar-accent/10 transition-colors">
                  <td className="px-6 py-4 text-sm font-black text-primary">#{sale.invoiceNo}</td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground">{sale.customer?.name || "Walk-in"}</td>
                  <td className="px-6 py-4 text-sm font-black text-right">{formatCurrency(sale.grandTotal)}</td>
                  <td className="px-6 py-4 text-sm font-black text-right text-emerald-600">{formatCurrency(sale.paidAmount)}</td>
                  <td className="px-6 py-4 text-sm font-black text-right text-rose-500">{formatCurrency(sale.dueAmount)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${sale.dueAmount === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {sale.dueAmount === 0 ? "Paid" : "Due"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
