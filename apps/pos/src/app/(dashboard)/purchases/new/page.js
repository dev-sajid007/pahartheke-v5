"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import SearchableSelect from "@/components/ui/SearchableSelect";

export default function NewPurchasePage() {
  const router = useRouter();
  const [supplier, setSupplier] = useState("");
  const [note, setNote] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [costTypes, setCostTypes] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    fetchCostTypes();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products?limit=0");
      if(res.data.data) setProducts(res.data.data.products);
    } catch (error) { console.error(error); }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      if(res.data.data) setSuppliers(res.data.data.filter(s => s.status === true));
    } catch (error) { console.error(error); }
  };

  const fetchCostTypes = async () => {
    try {
      const res = await api.get("/purchase-costs");
      if (res.data.data) setCostTypes(res.data.data.filter(c => c.status === true));
    } catch (error) { console.error(error); }
  };
  
  const [items, setItems] = useState([
    { product: "", variantId: "", quantity: 1, purchasePrice: 0, subtotal: 0 }
  ]);
  const [additionalCosts, setAdditionalCosts] = useState([]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // If product changes, reset variant and prices
    if (field === 'product') {
      const product = products.find(p => p._id === value);
      newItems[index].variantId = "";
      newItems[index].purchasePrice = product?.purchasePrice || 0;
    }

    // If variant changes, update purchase price from variant
    if (field === 'variantId') {
      const product = products.find(p => p._id === newItems[index].product);
      const variant = product?.variants?.find(v => v.variantId === value);
      if (variant) {
        newItems[index].purchasePrice = variant.purchasePrice || 0;
      }
    }
    
    // Auto calculate subtotal
    if (field === 'quantity' || field === 'purchasePrice') {
      newItems[index].subtotal = (newItems[index].quantity || 0) * (newItems[index].purchasePrice || 0);
    }
    
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { product: "", variantId: "", quantity: 1, purchasePrice: 0, subtotal: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems.length ? newItems : [{ product: "", variantId: "", quantity: 1, purchasePrice: 0, subtotal: 0 }]);
  };

  const handleAddCost = () => {
    setAdditionalCosts([...additionalCosts, { name: "", amount: 0, _isCustom: false }]);
  };

  const handleCostChange = (index, field, value) => {
    const newCosts = [...additionalCosts];
    if (field === "name" && value === "__custom__") {
      newCosts[index].name = "";
      newCosts[index]._isCustom = true;
    } else {
      newCosts[index][field] = field === "amount" ? Number(value) : value;
    }
    setAdditionalCosts(newCosts);
  };

  const handleRemoveCost = (index) => {
    setAdditionalCosts(additionalCosts.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0) + additionalCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const dueAmount = Math.max(0, totalAmount - paidAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validItems = items.filter(i => i.product);
    if (validItems.length === 0) {
      alert("কমপক্ষে একটি প্রোডাক্ট সিলেক্ট করুন");
      return;
    }

    try {
      const payload = {
        supplier,
        items: validItems.map(i => ({
          product: i.product,
          variantId: i.variantId || undefined,
          quantity: i.quantity,
          purchasePrice: i.purchasePrice
        })),
        paidAmount,
        note,
        additionalCosts: additionalCosts.filter(c => c.name),
      };
      
      const res = await api.post("/purchases", payload);
      alert("Purchase created successfully!");
      router.push("/purchases");
    } catch (error) {
      console.error("Failed to create purchase", error);
      const msg = error.response?.data?.message || "Failed to create purchase";
      alert(msg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link href="/purchases" className="rounded-full p-1.5 hover:bg-sidebar-accent text-sidebar-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Record New Purchase</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier & Details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Supplier *</label>
              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a supplier</option>
                {suppliers.map(s => (
                  <option key={s._id} value={s._id}>{s.companyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-sidebar-foreground">Purchase Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional notes or references"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Items Table */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="bg-sidebar-accent/50 px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Purchase Items</h2>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-sidebar-foreground uppercase text-xs">
                <tr>
                  <th className="pb-3 font-semibold w-1/2">Product</th>
                  <th className="pb-3 font-semibold">Quantity</th>
                  <th className="pb-3 font-semibold">Unit Cost (৳)</th>
                  <th className="pb-3 font-semibold text-right">Subtotal</th>
                  <th className="pb-3 font-semibold text-center w-12"></th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {items.map((item, index) => {
                  const selectedProduct = products.find(p => p._id === item.product);
                  return (
                    <tr key={index}>
                      <td className="py-2 pr-4 space-y-2 overflow-visible">
                        <SearchableSelect
                          options={products}
                          value={item.product}
                          onChange={(val) => handleItemChange(index, "product", val)}
                          placeholder="Select product"
                          getLabel={(p) => `${p.name}${p.sku ? ` (${p.sku})` : ""}`}
                          renderOption={(p) => (
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-foreground truncate">{p.name}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                  {p.sku && <span className="font-mono">{p.sku}</span>}
                                  {p.category && <span className="ml-2">• {p.category.name}</span>}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-xs font-semibold text-emerald-600">৳{p.purchasePrice}</div>
                                <div className={`text-[10px] ${p.currentStock > 0 ? 'text-muted-foreground' : 'text-rose-500'}`}>
                                  Stk: {p.currentStock || 0}
                                </div>
                              </div>
                            </div>
                          )}
                        />
                        
                        {selectedProduct?.hasVariants && (
                          <select
                            required
                            value={item.variantId}
                            onChange={(e) => handleItemChange(index, "variantId", e.target.value)}
                            className="w-full rounded-lg border border-border bg-sidebar-accent/50 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary animate-in fade-in slide-in-from-top-1"
                          >
                            <option value="">Select variant</option>
                            {selectedProduct.variants.map(v => (
                              <option key={v.variantId} value={v.variantId}>{v.name} ({v.sku})</option>
                            ))}
                          </select>
                        )}
                      </td>
                    <td className="py-2 pr-4">
                      <input
                        type="number"
                        min="0.1"
                        step="any"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </td>
                    <td className="py-2 pr-4">
                      <input
                        type="number"
                        min="0"
                        required
                        value={item.purchasePrice}
                        onChange={(e) => handleItemChange(index, "purchasePrice", Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </td>
                    <td className="py-2 text-right font-semibold text-foreground">
                      ৳ {item.subtotal}
                    </td>
                    <td className="py-2 text-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 text-sidebar-foreground hover:bg-rose-100 hover:text-rose-600 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            <button
              type="button"
              onClick={handleAddItem}
              className="mt-4 flex items-center text-sm font-medium text-primary hover:text-blue-600 transition-colors"
            >
              <Plus className="mr-1 h-4 w-4" /> Add another item
            </button>
          </div>
        </div>

        {/* Totals & Actions */}
        <div className="flex flex-col sm:flex-row gap-6 justify-end">
          <div className="w-full sm:w-80 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-sidebar-foreground">
                  <span>Items Total</span>
                  <span className="font-semibold text-foreground">৳ {items.reduce((sum, item) => sum + item.subtotal, 0)}</span>
                </div>

                {additionalCosts.length > 0 && (
                  <div className="border-t border-border pt-3 space-y-2">
                    <span className="text-xs font-semibold text-sidebar-foreground uppercase">Additional Costs</span>
                    {additionalCosts.map((cost, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {cost._isCustom ? (
                          <input
                            type="text"
                            placeholder="Cost name"
                            value={cost.name}
                            onChange={(e) => handleCostChange(index, "name", e.target.value)}
                            className="flex-1 rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-primary"
                          />
                        ) : (
                          <select
                            value={cost.name}
                            onChange={(e) => handleCostChange(index, "name", e.target.value)}
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
                          onChange={(e) => handleCostChange(index, "amount", e.target.value)}
                          className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-xs text-right font-medium text-foreground outline-none focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveCost(index)}
                          className="p-1 text-sidebar-foreground hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddCost}
                  className="flex items-center text-xs font-medium text-primary hover:text-blue-600 transition-colors"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add cost
                </button>

                <div className="flex justify-between text-sidebar-foreground pt-2 border-t border-border">
                  <span>Total Amount</span>
                  <span className="font-semibold text-foreground text-lg">৳ {totalAmount}</span>
                </div>
              <div className="flex justify-between items-center text-sidebar-foreground">
                <span>Paid Amount</span>
                <input 
                  type="number" 
                  min="0"
                  value={paidAmount || ""}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-32 rounded-lg border border-border bg-background px-3 py-1.5 text-right font-semibold text-emerald-600 outline-none focus:border-emerald-500"
                />
              </div>
              {dueAmount > 0 && (
                <div className="flex justify-between text-rose-500 font-medium pt-3 border-t border-border">
                  <span>Vendor Due</span>
                  <span>৳ {dueAmount}</span>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
            >
              <Save className="h-4 w-4" />
              Save Purchase
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
