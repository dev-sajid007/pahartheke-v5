"use client";

import { useState, useEffect, useRef } from "react";
import { User, Users, Trash2, ShoppingBag, CreditCard, ChevronDown, FileText, Award } from "lucide-react";

const DISCOUNT_TYPES = ["None", "Percentage", "Fixed"];

function applyItemDiscount(price, qty, discountValue, discountType) {
  const baseTotal = price * qty;
  if (!discountType || discountType === "None") return baseTotal;
  
  if (discountType === "Percentage") {
    const pct = parseFloat(discountValue) || 0;
    return baseTotal * (1 - pct / 100);
  } else if (discountType === "Fixed") {
    const amt = parseFloat(discountValue) || 0;
    return Math.max(0, baseTotal - amt);
  }
  return baseTotal;
}

export default function CartPanel({ 
  cart, 
  customers = [],
  updateQuantity, 
  removeFromCart, 
  processSale,
  onAddCustomer,
  newCustomer = null
}) {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [paidAmount, setPaidAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [itemDiscounts, setItemDiscounts] = useState({});
  const [notes, setNotes] = useState("");

  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);
  const previousDue = selectedCustomer?.previousDue || 0;
  const activeBadge = selectedCustomer?.badge;

  const [invoiceDiscountType, setInvoiceDiscountType] = useState(() => activeBadge ? "Percentage" : "None");
  const [invoiceDiscountValue, setInvoiceDiscountValue] = useState(() => activeBadge?.discount || 0);

  const prevBadgeId = useRef(activeBadge?._id);
  useEffect(() => {
    const currentBadgeId = activeBadge?._id;
    if (prevBadgeId.current !== currentBadgeId) {
      prevBadgeId.current = currentBadgeId;
      if (activeBadge) {
        setInvoiceDiscountType("Percentage");
        setInvoiceDiscountValue(activeBadge.discount || 0);
      } else if (!selectedCustomerId) {
        setInvoiceDiscountType("None");
        setInvoiceDiscountValue(0);
      }
    }
  }, [selectedCustomerId, activeBadge]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCustomerDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer?._id || "");
    setCustomerSearchQuery(customer ? `${customer.name} (${customer.phone})` : "");
    setIsCustomerDropdownOpen(false);
  };

  // Auto-select newly added customer
  useEffect(() => {
    if (newCustomer) {
      handleSelectCustomer(newCustomer);
    }
  }, [newCustomer]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.phone.includes(customerSearchQuery)
  );

  const getItemKey = (item) => `${item._id}-${item.variantId || ''}`;

  const getItemDiscount = (item) => {
    return itemDiscounts[getItemKey(item)] || { value: 0, type: "None" };
  };

  const updateItemDiscount = (item, field, val) => {
    const key = getItemKey(item);
    setItemDiscounts(prev => ({
      ...prev,
      [key]: { ...getItemDiscount(item), [field]: val }
    }));
  };

  const calcLineTotal = (item) => {
    const { value, type } = getItemDiscount(item);
    return applyItemDiscount(item.salePrice, item.cartQuantity, value, type);
  };

  const subtotal = cart.reduce((sum, item) => sum + calcLineTotal(item), 0);
  
  const applyInvoiceDiscount = (total) => {
    if (invoiceDiscountType === "None") return total;
    if (invoiceDiscountType === "Percentage") return total * (1 - invoiceDiscountValue / 100);
    if (invoiceDiscountType === "Fixed") return Math.max(0, total - invoiceDiscountValue);
    return total;
  };

  const afterInvoiceDisc = applyInvoiceDiscount(subtotal);
  const totalPayable = afterInvoiceDisc + previousDue + Number(shippingCost);
  const balance = paidAmount - totalPayable;
  const due = balance < 0 ? Math.abs(balance) : 0;
  const change = balance > 0 ? balance : 0;

  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-card shadow-2xl shadow-slate-200/50 overflow-hidden">
      {/* Customer Selector */}
      <div className="p-4 border-b border-border bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="relative flex-1" ref={dropdownRef}>
            <div className={`flex items-center gap-2 rounded-2xl border bg-background px-4 py-3 transition-all ${isCustomerDropdownOpen ? 'border-primary ring-4 ring-primary/10' : 'border-border'}`}>
              <User className="h-4 w-4 text-slate-400" />
              <input
                className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-slate-400"
                placeholder="Walk-in Customer"
                value={customerSearchQuery}
                onChange={(e) => { 
                  setCustomerSearchQuery(e.target.value); 
                  setIsCustomerDropdownOpen(true); 
                  if (selectedCustomerId) setSelectedCustomerId(""); 
                }}
                onFocus={() => setIsCustomerDropdownOpen(true)}
              />
              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isCustomerDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {isCustomerDropdownOpen && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div 
                  onClick={() => handleSelectCustomer(null)} 
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-foreground cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Users className="h-4 w-4 text-primary" />
                  Walk-in Customer
                </div>
                {filteredCustomers.map(c => {
                  const badge = c.badge;
                  return (
                    <div 
                      key={c._id} 
                      onClick={() => handleSelectCustomer(c)} 
                      className="group flex flex-col gap-0.5 rounded-xl px-4 py-3 text-sm cursor-pointer hover:bg-primary/5 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-foreground group-hover:text-primary">{c.name}</div>
                        {badge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[9px] font-black text-yellow-700 uppercase tracking-wider">
                            <Award className="h-2.5 w-2.5" />
                            {badge.name} {badge.discount}%
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{c.phone}</div>
                    </div>
                  );
                })}
                {filteredCustomers.length === 0 && customerSearchQuery && (
                  <div className="p-8 text-center text-xs font-medium text-slate-400 italic">
                    No customers found matching "{customerSearchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={onAddCustomer} 
            className="flex h-[46px] w-[46px] items-center justify-center rounded-2xl border border-border bg-background text-slate-600 transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary active:scale-95 shadow-sm"
          >
            <Users className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Badge Display */}
      {activeBadge && (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 px-4 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200 text-yellow-700">
            <Award className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-yellow-800 uppercase tracking-wider">{activeBadge.name} Badge</p>
            <p className="text-[10px] font-bold text-yellow-600">{activeBadge.discount}% invoice discount applied</p>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="grid grid-cols-[1fr_50px_75px_70px_85px_85px_35px] items-center px-4 py-2 bg-slate-50 border-b border-border text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div>Product</div>
        <div className="text-center">QTY</div>
        <div className="text-right">Price</div>
        <div className="text-center">Discount</div>
        <div className="text-center">Type</div>
        <div className="text-right">Subtotal</div>
        <div />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {cart.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-400">
            <div className="rounded-full bg-slate-100 p-6">
              <ShoppingBag className="h-10 w-10 opacity-20" />
            </div>
            <p className="text-sm font-bold tracking-tight">Your cart is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cart.map((item) => {
              const itemKey = getItemKey(item);
              const lineTotal = calcLineTotal(item);
              const { value, type } = getItemDiscount(item);
              
              return (
                <div key={itemKey} className="grid grid-cols-[1fr_50px_75px_70px_85px_85px_35px] items-center px-4 py-3 hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-[11px] font-bold leading-snug text-foreground line-clamp-2">
                      {item.name} {item.variantName ? `| ${item.variantName}` : ""}
                    </h4>
                  </div>
                  <div className="flex justify-center">
                    <input
                      type="number" step="any" min="0" inputMode="decimal"
                      className="w-12 h-8 rounded-lg border border-border bg-white text-center text-xs font-bold text-foreground outline-none focus:border-primary"
                      value={item.cartQuantity || ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === '' || raw === '.' || raw === '0.') {
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
                  <div className="text-right text-[11px] font-bold text-slate-600">
                    ৳{item.salePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="flex justify-center px-1">
                    <input
                      type="number"
                      disabled={type === "None"}
                      className="w-full h-8 rounded-lg border border-border bg-white text-center text-[11px] font-bold text-foreground outline-none focus:border-primary disabled:opacity-30"
                      value={value}
                      onChange={(e) => updateItemDiscount(item, "value", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="flex justify-center px-1">
                    <select
                      className="w-full h-8 rounded-lg border border-border bg-white text-[10px] font-bold text-slate-600 outline-none focus:border-primary"
                      value={type}
                      onChange={(e) => updateItemDiscount(item, "type", e.target.value)}
                    >
                      {DISCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="text-right text-[11px] font-black text-foreground">
                    ৳{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
              );
            })}
          </div>
        )}
      </div>

      {/* Checkout Section */}
      <div className="border-t border-border bg-slate-50/80 p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-500 uppercase tracking-wider">Subtotal</span>
            <span className="text-foreground">৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Invoice Discount</span>
            <div className="flex gap-2 flex-1 justify-end">
               <input 
                 type="number"
                 disabled={invoiceDiscountType === "None"}
                 className="w-20 h-8 rounded-lg border border-border bg-background text-center text-xs font-bold text-foreground disabled:opacity-30"
                 value={invoiceDiscountValue}
                 onChange={(e) => setInvoiceDiscountValue(parseFloat(e.target.value) || 0)}
               />
               <select 
                className="h-8 rounded-lg border border-border bg-background px-2 text-[10px] font-bold text-slate-600"
                value={invoiceDiscountType} 
                onChange={(e) => setInvoiceDiscountType(e.target.value)}
              >
                {DISCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Shipping</span>
            <div className="flex gap-2 flex-1 justify-end">
              <input
                type="number"
                min="0"
                className="w-24 h-8 rounded-lg border border-border bg-background px-3 text-right text-xs font-bold text-foreground outline-none focus:border-primary"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          {previousDue > 0 && (
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-rose-500 uppercase tracking-wider">Previous Due</span>
              <span className="text-rose-500">৳{previousDue.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-inner">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable</p>
              <h2 className="text-2xl font-black text-foreground tracking-tight">৳{totalPayable.toFixed(0)}</h2>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest text-right">Cash Received</p>
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
            <span className={`text-sm font-black uppercase tracking-wider ${due > 0 ? "text-rose-500" : "text-emerald-500"}`}>
              {due > 0 ? "Amount Due" : "Return Change"}
            </span>
            <span className={`text-xl font-black ${due > 0 ? "text-rose-500" : "text-emerald-500"}`}>
              ৳{due > 0 ? due.toFixed(0) : change.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Order notes..."
            rows={2}
            className="w-full rounded-xl border border-border bg-white px-9 py-2.5 text-xs text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        <button 
          onClick={() => processSale({
            customer: selectedCustomerId, subtotal,
            discount: subtotal - afterInvoiceDisc,
            shippingCost,
            invoiceDiscountType,
            invoiceDiscountValue,
            badgeName: activeBadge?.name,
            badgeDiscount: activeBadge?.discount || 0,
            paidAmount, due,
            totalPayable, previousDue,
            notes,
            itemDiscounts
          })}
          disabled={cart.length === 0}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-primary py-4 text-sm font-black text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-blue-600 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <CreditCard className="h-5 w-5" />
          <span>COMPLETE ORDER</span>
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
        </button>
      </div>
    </div>
  );
}
