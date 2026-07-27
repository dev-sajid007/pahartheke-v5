"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Printer, DollarSign } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPurchases = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/purchases");
      if (res.data.data) {
        setPurchases(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch purchases", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter(p => 
    (p.invoiceNo || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.supplier?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Purchase History</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Track inbound stock and vendor payments.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/purchases/costs"
            className="flex items-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-sidebar-foreground shadow-sm transition-all hover:bg-sidebar-accent"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Cost Types
          </Link>
          <Link 
            href="/purchases/new"
            className="flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Purchase
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search invoice or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent w-full sm:w-auto justify-center">
          <Filter className="h-4 w-4" />
          Date Filter
        </button>
      </div>

      {/* Purchases Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sidebar-foreground">
            <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice No</th>
                <th className="px-6 py-4 font-semibold">Supplier</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sidebar-foreground">
                    {isLoading ? "Loading..." : "No purchases found."}
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((purchase) => (
                <tr key={purchase._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">{purchase.invoiceNo}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-foreground">{purchase.supplier?.companyName || "Unknown"}</span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(purchase.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">৳ {purchase.totalAmount}</span>
                      {purchase.dueAmount > 0 && <span className="text-xs text-rose-500 mt-0.5">Due: ৳ {purchase.dueAmount}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        purchase.dueAmount === 0
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}
                    >
                      {purchase.dueAmount === 0 ? "Paid" : "Due"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Link href={`/purchases/view/${purchase._id}`} className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button className="rounded-lg p-2 text-sidebar-foreground hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-colors">
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
