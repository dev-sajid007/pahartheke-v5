"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Search, Calendar, X, ChevronDown } from "lucide-react";
import api from "@/lib/axios";

export default function ProductWiseSalesReport() {
  const [dateRange, setDateRange] = useState({ 
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [summary, setSummary] = useState(null);
  const [salesDetail, setSalesDetail] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchReport();
    }
  }, [dateRange, selectedProduct]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", { params: { limit: 0 } });
      if (res.data.data?.products) {
        setAllProducts(res.data.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  const fetchReport = useCallback(async () => {
    if (!selectedProduct) return;
    try {
      setIsLoading(true);
      const res = await api.get("/reports/product-wise-sales", {
        params: {
          productId: selectedProduct._id,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        },
      });
      if (res.data.data) {
        setSummary(res.data.data.summary?.[0] || null);
        setSalesDetail(res.data.data.salesDetail || []);
      }
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProduct, dateRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0).replace('BDT', '৳');
  };

  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredSales = salesDetail.filter(s =>
    s.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Product Wise Sales Report</h1>
          <p className="text-sm font-bold text-sidebar-foreground mt-1">Performance analysis of individual products</p>
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

      {/* Product Selector */}
      <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-6">
        <label className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground mb-3 block">
          Select Product
        </label>
        <div className="relative">
          <button
            onClick={() => setProductDropdownOpen(!productDropdownOpen)}
            className="w-full flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-3.5 text-sm font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
          >
            <div className="flex items-center gap-3">
              <Package className="h-4 w-4 text-sidebar-foreground" />
              {selectedProduct ? (
                <span>{selectedProduct.name} <span className="text-sidebar-foreground/50 font-medium ml-2">SKU: {selectedProduct.sku || 'N/A'}</span></span>
              ) : (
                <span className="text-sidebar-foreground/50">Choose a product...</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedProduct && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(null);
                    setSummary(null);
                    setSalesDetail([]);
                  }}
                  className="rounded-lg p-1 hover:bg-rose-100 hover:text-rose-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronDown className={`h-4 w-4 text-sidebar-foreground transition-transform ${productDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {productDropdownOpen && (
            <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
              <div className="p-3 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
                  <input
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sidebar-accent/30 border border-border/50 text-sm font-medium outline-none focus:border-primary transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-sidebar-foreground text-center">No products found</p>
                ) : filteredProducts.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setProductDropdownOpen(false);
                      setProductSearch("");
                    }}
                    className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-sidebar-accent/50 transition-colors flex items-center justify-between ${
                      selectedProduct?._id === p._id ? 'bg-primary/10 text-primary' : 'text-foreground'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p className="text-[10px] text-sidebar-foreground mt-0.5">SKU: {p.sku || 'N/A'}</p>
                    </div>
                    {selectedProduct?._id === p._id && (
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!selectedProduct ? (
        /* Empty state when no product selected */
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-sidebar-accent rounded-2xl flex items-center justify-center mb-5">
            <Package className="h-7 w-7 text-sidebar-foreground/40" />
          </div>
          <h3 className="text-lg font-black text-foreground mb-2">No Product Selected</h3>
          <p className="text-sm text-sidebar-foreground max-w-md">
            Choose a product from the dropdown above along with a date range to view its detailed sales performance.
          </p>
        </div>
      ) : isLoading ? (
        <div className="bg-card rounded-[2.5rem] border border-border shadow-sm p-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary"></div>
            <p className="text-sm text-sidebar-foreground">Loading report...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary to-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20">
              <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                <Package className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Product</p>
              <h3 className="text-xl font-black mt-1 truncate">{selectedProduct.name}</h3>
              <p className="text-xs opacity-60 mt-1">SKU: {selectedProduct.sku || 'N/A'}</p>
            </div>

            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
              <div className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/60 mb-1">Total Sold</p>
              <h3 className="text-3xl font-black text-foreground">{summary?.soldQuantity || 0}</h3>
              <p className="text-xs text-sidebar-foreground mt-2">units</p>
            </div>

            <div className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
              <div className="h-10 w-10 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/60 mb-1">Total Revenue</p>
              <h3 className="text-3xl font-black text-foreground">{formatCurrency(summary?.totalRevenue || 0)}</h3>
              <p className="text-xs text-sidebar-foreground mt-2">revenue generated</p>
            </div>
          </div>

          {/* Sales Detail Table */}
          <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Sales Transactions</h3>
                <p className="text-xs text-sidebar-foreground mt-1">{filteredSales.length} transaction{filteredSales.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search invoice or customer..." 
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-sidebar-accent/30 border border-border/50 text-xs font-bold outline-none focus:border-primary transition-all" 
                />
              </div>
            </div>
            <div className="overflow-auto max-h-[500px] custom-scrollbar">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-card z-10 border-b border-border">
                  <tr className="text-sidebar-foreground">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Invoice / Date</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSales.length === 0 ? (
                    <tr><td colSpan="5" className="px-8 py-10 text-center text-sidebar-foreground italic">No sales found for this product in the selected date range</td></tr>
                  ) : filteredSales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-sidebar-accent/10 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{sale.invoiceNo}</p>
                        <p className="text-[10px] font-bold text-sidebar-foreground mt-0.5">
                          {new Date(sale.order_date || sale.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-foreground">{sale.customer?.name || 'Walk-in Customer'}</p>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="mb-1 last:mb-0">
                            <span className="px-3 py-1 rounded-lg bg-sidebar-accent font-black text-xs text-foreground">
                              {item.quantity} {item.variantName ? `(${item.variantName})` : ''}
                            </span>
                          </div>
                        ))}
                      </td>
                      <td className="px-8 py-5 text-right">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="mb-1 last:mb-0">
                            <span className="text-sm font-medium text-foreground">{formatCurrency(item.salePrice)}</span>
                          </div>
                        ))}
                      </td>
                      <td className="px-8 py-5 text-right font-black text-sm text-foreground">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="mb-1 last:mb-0">
                            {formatCurrency(item.subtotal)}
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
