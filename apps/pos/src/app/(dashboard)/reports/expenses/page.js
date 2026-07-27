"use client";

import { useState, useEffect } from "react";
import { Wallet, Search, Printer, Download, Banknote, PieChart, ArrowUpRight, Calendar } from "lucide-react";
import api from "@/lib/axios";

export default function ExpenseReport() {
  const [dateRange, setDateRange] = useState({ 
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [data, setData] = useState({ expenses: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/reports/expenses?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
      if (res.data.data) {
        setData(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Expense Report</h1>
          <p className="text-sm font-bold text-sidebar-foreground mt-1">Tracking operational costs and shop expenditures</p>
        </div>
        <div className="flex items-center bg-card rounded-xl border border-border p-1 shadow-sm">
           <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} className="px-3 py-1.5 bg-transparent text-xs font-bold outline-none" />
           <span className="text-sidebar-foreground px-2">to</span>
           <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} className="px-3 py-1.5 bg-transparent text-xs font-bold outline-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <div className="lg:col-span-1 bg-card p-8 rounded-[2rem] border border-border shadow-sm flex flex-col justify-center items-center text-center">
            <div className="h-16 w-16 bg-rose-500/10 text-rose-600 rounded-3xl flex items-center justify-center mb-6">
               <Wallet className="h-8 w-8" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/60 mb-2">Total Expenditures</p>
            <h3 className="text-4xl font-black text-rose-600">৳{data.total}</h3>
         </div>

         <div className="lg:col-span-3 bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-sidebar-accent/30 text-sidebar-foreground">
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Date</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Category</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Description</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Amount</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {data.expenses.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-10 text-center text-sidebar-foreground italic">No expenses found</td></tr>
                  ) : data.expenses.map((exp, idx) => (
                    <tr key={idx} className="hover:bg-sidebar-accent/10 transition-colors">
                       <td className="px-6 py-4 text-xs font-bold text-foreground">{new Date(exp.date).toLocaleDateString()}</td>
                       <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-sidebar-accent text-[10px] font-black uppercase text-foreground">{exp.category?.name || "General"}</span>
                       </td>
                       <td className="px-6 py-4 text-xs text-sidebar-foreground font-medium">{exp.description}</td>
                       <td className="px-6 py-4 text-right text-sm font-black text-rose-600">৳{exp.amount}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
