"use client";

import { useState, useEffect } from "react";
import { TrendingUp, BarChart, DollarSign, ArrowUpRight, ArrowDownRight, Calculator, Calendar } from "lucide-react";
import api from "@/lib/axios";

export default function GrossProfitReport() {
  const [dateRange, setDateRange] = useState({ 
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [data, setData] = useState({ totalRevenue: 0, totalCost: 0, totalProfit: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/reports/gross-profit?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      if (res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0).replace('BDT', '৳');
  };

  const profitMargin = data.totalRevenue > 0 ? ((data.totalProfit / data.totalRevenue) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Gross Profit Analysis</h1>
          <p className="text-sm font-bold text-sidebar-foreground mt-1">Understanding your bottom line and margins</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-sidebar-foreground" />
          <div className="flex items-center bg-card rounded-xl border border-border p-1 shadow-sm">
             <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} className="px-3 py-1.5 bg-transparent text-xs font-bold outline-none" />
             <span className="text-sidebar-foreground px-2">to</span>
             <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} className="px-3 py-1.5 bg-transparent text-xs font-bold outline-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col justify-between">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/60 mb-2">Total Revenue</p>
                  <h3 className="text-3xl font-black text-foreground">{formatCurrency(data.totalRevenue)}</h3>
               </div>
               <div className="mt-8 flex items-center gap-2 text-emerald-500 font-bold text-xs bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>Gross Sales</span>
               </div>
            </div>
            <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col justify-between">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/60 mb-2">Total COGS</p>
                  <h3 className="text-3xl font-black text-foreground">{formatCurrency(data.totalCost)}</h3>
               </div>
               <div className="mt-8 flex items-center gap-2 text-rose-500 font-bold text-xs bg-rose-500/10 w-fit px-3 py-1 rounded-full">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>Cost of Sales</span>
               </div>
            </div>
         </div>

         <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-500/20 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6">
               <TrendingUp className="h-8 w-8" />
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80 mb-2">Net Gross Profit</p>
            <h3 className="text-5xl font-black mb-4">{formatCurrency(data.totalProfit)}</h3>
            <div className="px-6 py-2 bg-black/20 rounded-2xl text-sm font-black backdrop-blur-sm">
               {profitMargin}% Margin
            </div>
         </div>
      </div>

      <div className="bg-sidebar-accent/30 p-8 rounded-[2.5rem] border border-border/50">
         <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
               <Calculator className="h-5 w-5" />
            </div>
            <div>
               <h4 className="text-sm font-black text-foreground mb-1 uppercase tracking-wider">Formula Used</h4>
               <p className="text-xs font-bold text-sidebar-foreground leading-relaxed">
                  Gross Profit is calculated as <span className="text-foreground">Total Revenue - Total Cost of Goods Sold</span>. This report does not include operational expenses or taxes.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
