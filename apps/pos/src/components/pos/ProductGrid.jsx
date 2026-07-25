"use client";

import { useState, useEffect, useRef } from "react";
import { Package, Search, ChevronDown, Loader2 } from "lucide-react";

export default function ProductGrid({ products, categories = [], onAddToCart, loadMore, isLoadingMore, hasMore }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!loadMore || !hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore, isLoadingMore]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchQuery));
    
    const matchesCategory = 
      selectedCategory === "all" || 
      product.category === selectedCategory || 
      product.category?._id === selectedCategory;
      
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search by Product Name/Barcode"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-11 pr-4 text-xs text-foreground shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="grid grid-cols-1">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground shadow-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 pb-4 custom-scrollbar">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.currentStock === 0;

            return (
              <button
                key={product._id}
                onClick={() => !isOutOfStock && onAddToCart(product)}
                disabled={isOutOfStock}
                className={`group relative flex flex-col items-center overflow-hidden rounded-xl border bg-card p-2.5 text-center transition-all ${
                  isOutOfStock 
                    ? "opacity-60 grayscale cursor-not-allowed border-slate-200" 
                    : "border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.98]"
                }`}
              >
                {/* Price Badge */}
                <div className="absolute left-2 top-2 z-10 rounded-lg bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                  ৳{product.salePrice.toLocaleString()}
                </div>

                {/* Stock Badge */}
                <div className={`absolute right-2 top-2 z-10 rounded-lg px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tight shadow-sm ${
                  isOutOfStock ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                }`}>
                  {isOutOfStock ? "Out of Stock" : `${product.currentStock} Left`}
                </div>

                {/* Product Image */}
                <div className="aspect-square w-full flex items-center justify-center bg-slate-50 rounded-lg mb-2 overflow-hidden max-h-[90px]">
                  {product.image ? (
                    <img 
                      src={product.image.startsWith('http') ? product.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.image}`} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                    />
                  ) : (
                    <Package className="h-10 w-10 text-slate-300" />
                  )}
                </div>

                <div className="w-full text-left">
                  <h3 className="line-clamp-1 text-[11px] font-bold leading-tight text-foreground h-4">
                    {product.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-[9px] font-bold text-slate-400 truncate max-w-[60px]">
                      {product.category?.name || "Uncategorized"}
                    </p>
                    <div className="h-1 w-10 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full ${isOutOfStock ? 'bg-rose-500' : product.currentStock < 5 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(100, (product.currentStock / 20) * 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {filteredProducts.length === 0 && !isLoadingMore && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-sidebar-foreground">
              <Search className="h-12 w-12 opacity-20 mb-4" />
              <p className="font-medium">No products found</p>
              <p className="text-xs opacity-70 mt-1 text-center">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Sentinel for infinite scroll */}
          {hasMore && (
            <div ref={sentinelRef} className="col-span-full flex justify-center py-6">
              {isLoadingMore ? (
                <div className="flex items-center gap-2 text-xs font-medium text-sidebar-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more products...
                </div>
              ) : (
                <div className="h-4" />
              )}
            </div>
          )}

          {!hasMore && products.length > 0 && (
            <div className="col-span-full text-center py-4 text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-wider">
              All products loaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
