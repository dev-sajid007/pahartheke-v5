"use client";

import { RotateCcw, AlertCircle } from "lucide-react";

export default function ReturnSalesReport() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
      <div className="h-24 w-24 bg-amber-500/10 text-amber-500 rounded-[2rem] flex items-center justify-center animate-pulse">
        <RotateCcw className="h-12 w-12" />
      </div>
      <div>
        <h1 className="text-3xl font-black text-foreground">Returns Module</h1>
        <p className="text-sm font-bold text-sidebar-foreground mt-2 max-w-md mx-auto">
          We are currently building the comprehensive Returns & Damaged Goods tracking system. This report will be available soon.
        </p>
      </div>
      <div className="flex items-center gap-2 px-6 py-3 bg-sidebar-accent rounded-2xl text-[10px] font-black uppercase tracking-widest text-sidebar-foreground">
        <AlertCircle className="h-4 w-4" />
        Coming in Version 2.4
      </div>
    </div>
  );
}
