"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";
import api from "@/lib/axios";

export default function StockLedgerPage() {
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/stock/movements");
      if (res.data.data) {
        setMovements(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stock movements", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMovements = movements.filter(m => 
    m.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Stock Movement Ledger</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Audit trail of all inventory changes across your store.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search product or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Movements Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sidebar-foreground">
            <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Qty Change</th>
                <th className="px-6 py-4 font-semibold">Reference</th>
                <th className="px-6 py-4 font-semibold text-right">Unit Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMovements.map((movement) => {
                const isOut = movement.type === "SALE" || movement.type === "DAMAGE";
                return (
                  <tr key={movement._id} className="hover:bg-sidebar-accent/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">
                      {new Date(movement.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground">
                          <Package className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-foreground">{movement.product?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        movement.type === "PURCHASE" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        movement.type === "SALE" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}>
                        {movement.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        {isOut ? (
                          <ArrowDownRight className="h-4 w-4 text-rose-500" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-blue-500" />
                        )}
                        <span className={isOut ? "text-rose-600" : "text-blue-600"}>
                          {isOut ? "-" : "+"}{movement.quantity}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-sidebar-foreground">
                      {movement.reference || "-"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground text-right">
                      ৳ {movement.unitCost}
                    </td>
                  </tr>
                );
              })}
              {!isLoading && filteredMovements.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sidebar-foreground">
                    No stock movements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
