"use client";

import { X } from "lucide-react";

export default function VariantSelector({ isOpen, onClose, product, onSelect }) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">{product.name}</h3>
            <p className="text-xs text-sidebar-foreground uppercase tracking-wider">Select Variant</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {product.variants?.map((v) => (
            <button
              key={v.variantId}
              onClick={() => onSelect(v)}
              disabled={v.currentStock <= 0}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 transition-all ${
                v.currentStock > 0 
                  ? "border-border hover:border-primary hover:bg-primary/5 hover:shadow-md cursor-pointer" 
                  : "border-border bg-sidebar-accent/50 opacity-60 cursor-not-allowed"
              }`}
            >
              <div className="text-left">
                <p className="font-bold text-foreground">{v.name}</p>
                <p className="text-[10px] text-sidebar-foreground uppercase">{v.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">৳ {v.salePrice}</p>
                <p className={`text-[10px] font-medium ${v.currentStock > 5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {v.currentStock > 0 ? `${v.currentStock} in stock` : 'Out of stock'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
