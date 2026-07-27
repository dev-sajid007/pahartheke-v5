"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Filter, Printer, ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

const ITEMS_PER_PAGE = 10;

export default function SalesHistoryPage() {
  const [sales, setSales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const debounceRef = useRef(null);

  const fetchSales = useCallback(async (page, search) => {
    try {
      setIsLoading(true);
      const res = await api.get("/sales", {
        params: { page, limit: ITEMS_PER_PAGE, search },
      });
      if (res.data.data) {
        setSales(res.data.data.sales);
        setTotal(res.data.data.total);
        setTotalPages(res.data.data.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch sales history", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 400);
  };

  const handlePrintInvoice = async (saleId, invoiceNo) => {
    // In a real scenario, we would trigger the download:
    try {
      const response = await api.get(`/invoices/${saleId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download invoice", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Link href="/sales" className="rounded-full p-1.5 hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales History</h1>
          </div>
          <p className="text-sm text-sidebar-foreground ml-10">
            View past transactions, track dues, and print invoices.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent w-full sm:w-auto justify-center">
          <Filter className="h-4 w-4" />
          Date Filter
        </button>
      </div>

      {/* Sales Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
              <p className="text-sm text-sidebar-foreground">Loading sales history...</p>
            </div>
          </div>
        ) : sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-sidebar-foreground">
            <p className="font-medium">No sales found</p>
            <p className="text-xs opacity-70 mt-1">Try adjusting your search</p>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sidebar-foreground">
            <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice No</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.map((sale) => (
                <tr key={sale._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-foreground">{sale.invoiceNo}</td>
                  <td className="px-6 py-4">
                    {sale.customer ? (
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{sale.customer.name}</span>
                        <span className="text-xs text-sidebar-foreground mt-0.5">{sale.customer.phone}</span>
                      </div>
                    ) : (
                      <span className="text-sidebar-foreground/70 italic">Walk-in Customer</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(sale.order_date || sale.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sale.source === "website"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {sale.source === "website" ? "🌐 Website" : "🏪 POS"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">৳ {sale.grandTotal}</span>
                      {sale.dueAmount > 0 && <span className="text-xs text-rose-500 mt-0.5">Due: ৳ {sale.dueAmount}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        sale.dueAmount === 0
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}
                    >
                      {sale.dueAmount === 0 ? "Paid" : "Due"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/sales/view/${sale._id}`}
                        className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handlePrintInvoice(sale._id, sale.invoiceNo)}
                        className="rounded-lg p-2 text-sidebar-foreground hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 transition-colors"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
          <p className="text-xs text-sidebar-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} sales
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-sidebar-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            {(() => {
              const pages = [];
              const start = Math.max(1, currentPage - 2);
              const end = Math.min(totalPages, currentPage + 2);
              if (start > 1) pages.push(<button key={1} onClick={() => setCurrentPage(1)} className="rounded-lg w-8 h-8 text-xs font-medium transition-colors hover:bg-sidebar-accent">1</button>, <span key="dots1" className="text-sidebar-foreground/40 px-1">...</span>);
              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`rounded-lg w-8 h-8 text-xs font-medium transition-colors ${
                      i === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"
                    }`}
                  >
                    {i}
                  </button>
                );
              }
              if (end < totalPages) pages.push(<span key="dots2" className="text-sidebar-foreground/40 px-1">...</span>, <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className="rounded-lg w-8 h-8 text-xs font-medium transition-colors hover:bg-sidebar-accent">{totalPages}</button>);
              return pages;
            })()}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-sidebar-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
