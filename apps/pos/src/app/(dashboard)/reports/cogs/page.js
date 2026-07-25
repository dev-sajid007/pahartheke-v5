"use client";

import { useState, useEffect } from "react";
import { Calculator, BarChart3, PieChart, ShoppingBag, ArrowDownRight, Info } from "lucide-react";
import api from "@/lib/axios";

export default function COGSReport() {
  const [dateRange, setDateRange] = useState({ 
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [data, setData] = useState({ totalCOGS: 0, totalSoldQuantity: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/reports/cogs?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      if (res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">COGS Report</h1>
          <p className="text-sm font-bold text-sidebar-foreground mt-1">Cost of Goods Sold analysis based on FIFO stock logic</p>
        </div>
        <div className="flex items-center bg-card rounded-xl border border-border p-1 shadow-sm">
           <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} className="px-3 py-1.5 bg-transparent text-xs font-bold outline-none" />
           <span className="text-sidebar-foreground px-2">to</span>
           <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} className="px-3 py-1.5 bg-transparent text-xs font-bold outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-rose-500/10 text-rose-600 rounded-3xl flex items-center justify-center mb-6">
               <Calculator className="h-8 w-8" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sidebar-foreground/60 mb-2">Total Inventory Cost Sold</p>
            <h3 className="text-5xl font-black text-foreground">৳{data.totalCOGS}</h3>
         </div>

         <div className="bg-card p-10 rounded-[3rem] border border-border shadow-sm flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-blue-500/10 text-blue-600 rounded-3xl flex items-center justify-center mb-6">
               <ShoppingBag className="h-8 w-8" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sidebar-foreground/60 mb-2">Total Units Distributed</p>
            <h3 className="text-5xl font-black text-foreground">{data.totalSoldQuantity}</h3>
         </div>
      </div>

      <div className="bg-sidebar-accent/30 p-8 rounded-[2.5rem] border border-border/50">
         <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
               <Info className="h-5 w-5" />
            </div>
            <div>
               <h4 className="text-sm font-black text-foreground mb-1 uppercase tracking-wider">Accounting Principle</h4>
               <p className="text-xs font-bold text-sidebar-foreground leading-relaxed">
                  The Cost of Goods Sold (COGS) is calculated as <span className="text-foreground">Σ (Purchase Cost × Quantity Sold)</span>. It represents the direct costs of producing the goods sold by a business.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
