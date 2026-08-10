"use client";

import { useState, useEffect, useRef } from "react";
import { Building2, Users, Trash2, Truck, Save, ChevronDown, FileText, Plus } from "lucide-react";

export default function PurchaseCartPanel({
  cart,
  suppliers = [],
  costTypes = [],
  updateQuantity,
  updateUnitCost,
  removeFromCart,
  onSubmit,
  onAddSupplier,
  newSupplier = null
}) {
  const [supplierId, setSupplierId] = useState("");
  const [supplierSearchQuery, setSupplierSearchQuery] = useState("");
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [paidAmount, setPaidAmount] = useState(0);
  const [notes, setNotes] = useState("");
  const [additionalCosts, setAdditionalCosts] = useState([]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSupplierDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (newSupplier) {
      handleSelectSupplier(newSupplier);
    }
  }, [newSupplier]);

  const handleSelectSupplier = (supplier) => {
    setSupplierId(supplier?._id || "");
    setSupplierSearchQuery(supplier ? `${supplier.name}${supplier.companyName ? ` — ${supplier.companyName}` : ""}` : "");
    setIsSupplierDropdownOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
    s.companyName.toLowerCase().includes(supplierSearchQuery.toLowerCase()) ||
    s.phone.includes(supplierSearchQuery)
  );

  const addAdditionalCost = () => {
    setAdditionalCosts(prev => [...prev, { _key: Math.random().toString(36).substring(2, 10), name: "", amount: 0, _isCustom: false }]);
  };

  const updateAdditionalCost = (key, field, value) => {
    setAdditionalCosts(prev =>
      prev.map(cost => {
        if (cost._key !== key) return cost;
        if (field === "name" && value === "__custom__") {
          return { ...cost, name: "", _isCustom: true };
        }
        return { ...cost, [field]: field === "amount" ? Number(value) : value };
      })
    );
  };

  const removeAdditionalCost = (key) => {
    setAdditionalCosts(prev => prev.filter(cost => cost._key !== key));
  };

  const itemsTotal = cart.reduce((sum, item) => sum + (item.cartQuantity || 0) * (item.purchasePrice || 0), 0);
  const additionalCostsTotal = additionalCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalAmount = itemsTotal + additionalCostsTotal;
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-card shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Supplier Selector */}
      <div className="p-4 border-b border-border bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative flex-1" ref={dropdownRef}>
            <div className={`flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 transition-all ${isSupplierDropdownOpen ? 'border-primary ring-4 ring-primary/10' : 'border-border'}`}>
              <Building2 className="h-4 w-4 text-slate-400" />
              <input
                className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-slate-400"
                placeholder="Select Supplier"
                value={supplierSearchQuery}
                onChange={(e) => {
                  setSupplierSearchQuery(e.target.value);
                  setIsSupplierDropdownOpen(true);
                  if (supplierId) setSupplierId("");
                }}
                onFocus={() => setIsSupplierDropdownOpen(true)}
              />
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isSupplierDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isSupplierDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div
                  onClick={() => handleSelectSupplier(null)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-foreground cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Users className="h-4 w-4 text-primary" />
                  No Supplier (Cash Purchase)
                </div>
                {filteredSuppliers.map(s => (
                  <div
                    key={s._id}
                    onClick={() => handleSelectSupplier(s)}
                    className="group flex flex-col gap-0.5 rounded-xl px-4 py-3 text-sm cursor-pointer hover:bg-primary/5 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-foreground group-hover:text-primary">
                        {s.companyName || s.name}
                      </div>
                      {s.previousDue > 0 && (
                        <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black text-rose-700 uppercase tracking-wider">
                          Due ৳{s.previousDue}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {s.name}{s.phone ? ` • ${s.phone}` : ""}
                    </div>
                  </div>
                ))}
                {filteredSuppliers.length === 0 && supplierSearchQuery && (
                  <div className="p-8 text-center text-xs font-medium text-slate-400 italic">
                    No suppliers found matching "{supplierSearchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onAddSupplier}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border bg-background text-slate-600 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 shadow-sm"
          >
            <Users className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_50px_90px_85px_35px] items-center px-4 py-2 bg-slate-50 border-b border-border text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div>Product</div>
        <div className="text-center">QTY</div>
        <div className="text-right">Unit Cost</div>
        <div className="text-right">Subtotal</div>
        <div />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-400">
            <div className="rounded-full bg-slate-100 p-6">
              <Truck className="h-10 w-10 opacity-20" />
            </div>
            <p className="text-sm font-bold tracking-tight">No items in purchase</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Click products to add stock</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={`${item._id}-${item.variantId || ""}`} className="grid grid-cols-[1fr_50px_90px_85px_35px] items-center px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className="min-w-0 pr-2">
                  <h4 className="text-[11px] font-bold leading-snug text-foreground line-clamp-2">
                    {item.name} {item.variantName ? `| ${item.variantName}` : ""}
                  </h4>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">
                    Stk: {item.currentStock || 0}
                  </div>
                </div>
                <div className="flex justify-center">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    inputMode="decimal"
                    className="w-12 h-8 rounded-lg border border-border bg-white text-center text-xs font-bold text-foreground outline-none focus:border-primary"
                    value={item.cartQuantity || ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === "" || raw === "." || raw === "0.") {
                        updateQuantity(item._id, 0, item.variantId);
                        return;
                      }
                      const parsed = parseFloat(raw);
                      if (!isNaN(parsed)) {
                        updateQuantity(item._id, parsed, item.variantId);
                      }
                    }}
                  />
                </div>
                <div className="flex justify-end px-1">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    className="w-full h-8 rounded-lg border border-border bg-white text-right px-2 text-[11px] font-bold text-foreground outline-none focus:border-primary"
                    value={item.purchasePrice || ""}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed = parseFloat(raw);
                      updateUnitCost(item._id, isNaN(parsed) ? 0 : parsed, item.variantId);
                    }}
                  />
                </div>
                <div className="text-right text-[11px] font-black text-foreground">
                  ৳{((item.cartQuantity || 0) * (item.purchasePrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeFromCart(item._id, item.variantId)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout Section */}
      <div className="border-t border-border bg-slate-50/80 p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 uppercase tracking-wider">Items Total</span>
            <span className="text-foreground">৳{itemsTotal.toFixed(2)}</span>
          </div>

          {additionalCosts.length > 0 && (
            <div className="border-t border-slate-200 pt-3 space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Additional Costs</span>
              {additionalCosts.map((cost) => (
                <div key={cost._key} className="flex items-center gap-2">
                  {cost._isCustom ? (
                    <input
                      type="text"
                      placeholder="Cost name"
                      value={cost.name}
                      onChange={(e) => updateAdditionalCost(cost._key, "name", e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <select
                      value={cost.name}
                      onChange={(e) => updateAdditionalCost(cost._key, "name", e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
                    >
                      <option value="">Select cost type</option>
                      {costTypes.map(ct => (
                        <option key={ct._id} value={ct.name}>{ct.name}</option>
                      ))}
                      <option value="__custom__">+ Custom</option>
                    </select>
                  )}
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={cost.amount || ""}
                    onChange={(e) => updateAdditionalCost(cost._key, "amount", e.target.value)}
                    className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-xs text-right font-medium text-foreground outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalCost(cost._key)}
                    className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addAdditionalCost}
            className="flex items-center text-[10px] font-black text-primary uppercase tracking-wider hover:text-blue-600 transition-colors"
          >
            <Plus className="mr-1 h-3 w-3" /> Add Cost
          </button>

          <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-200">
            <span className="text-slate-500 uppercase tracking-wider">Total Amount</span>
            <span className="text-foreground text-base">৳{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-inner">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Total</p>
              <h2 className="text-2xl font-black text-foreground tracking-tight">৳{totalAmount.toFixed(0)}</h2>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-right">Paid Amount</p>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-500">৳</span>
                <input
                  type="number"
                  value={paidAmount}
                  min={0}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border-2 border-emerald-100 bg-emerald-50/30 py-2 pl-7 pr-3 text-right text-lg font-black text-emerald-600 outline-none focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
            <span className={`text-sm font-black uppercase tracking-wider ${dueAmount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
              {dueAmount > 0 ? "Vendor Due" : "Paid in Full"}
            </span>
            <span className={`text-xl font-black ${dueAmount > 0 ? "text-rose-500" : "text-emerald-500"}`}>
              ৳{dueAmount.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Purchase notes..."
            rows={2}
            className="w-full rounded-xl border border-border bg-white px-9 py-2.5 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <button
          onClick={() => onSubmit({ supplier: supplierId, paidAmount, notes, additionalCosts })}
          disabled={cart.length === 0}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary py-4 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-blue-600 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <Save className="h-5 w-5" />
          <span>SAVE PURCHASE</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>
    </div>
  );
}
