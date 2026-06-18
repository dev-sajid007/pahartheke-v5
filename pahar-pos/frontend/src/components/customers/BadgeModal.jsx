"use client";

import { X, Award, Plus, Trash2, Info, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function BadgeModal({ isOpen, onClose, badge = null, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount: 0,
    color: "#3b82f6",
    conditions: [],
    status: true,
  });

  const [newCondition, setNewCondition] = useState({
    field: "totalOrders",
    operator: "gt",
    value: 0
  });

  const [showConditions, setShowConditions] = useState(true);

  useEffect(() => {
    if (badge) {
      setFormData(badge);
    } else {
      setFormData({
        name: "",
        description: "",
        discount: 0,
        color: "#3b82f6",
        conditions: [],
        status: true,
      });
    }
  }, [badge, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addCondition = () => {
    if (newCondition.value === "" || newCondition.value === null) return;
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, { ...newCondition }]
    }));
    setNewCondition({ field: "totalOrders", operator: "gt", value: 0 });
  };

  const removeCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const getFieldLabel = (field) => {
    if (field === "totalOrders") return "Order Count";
    if (field === "totalSpent") return "Total Spent";
    return field;
  };

  const getOperatorLabel = (op) => {
    switch (op) {
      case 'gt': return "Greater than (>)";
      case 'lt': return "Less than (<)";
      case 'gte': return "Greater than or equal (>=)";
      case 'lte': return "Less than or equal (<=)";
      case 'eq': return "Equal (==)";
      default: return op;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity px-4">
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col md:flex-row overflow-hidden rounded-[2.5rem] bg-card shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Left Side: Live Preview */}
        <div className="w-full md:w-[35%] bg-sidebar-accent/30 p-8 flex flex-col items-center justify-center border-r border-border space-y-8">
           <div className="text-center">
              <h2 className="text-sm font-black uppercase tracking-widest text-sidebar-foreground/50 mb-2">Badge Preview</h2>
              <p className="text-xs text-sidebar-foreground/40 italic">How it will appear to customers</p>
           </div>

           <div className="w-full max-w-[280px] rounded-[2rem] border border-border bg-card p-8 shadow-2xl shadow-primary/5 transition-all">
              <div className="flex flex-col items-center text-center">
                <div 
                  className="h-20 w-20 rounded-3xl flex items-center justify-center shadow-xl mb-6"
                  style={{ backgroundColor: `${formData.color}15`, color: formData.color }}
                >
                  <Award className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">{formData.name || "Badge Name"}</h3>
                <p className="text-xs font-bold text-sidebar-foreground/60 leading-relaxed min-h-[3rem]">
                   {formData.description || "Badge description will appear here"}
                </p>

                <div className="mt-8 w-full py-4 px-6 rounded-2xl bg-sidebar-accent/50 border border-border/50">
                   <p className="text-[10px] uppercase font-black text-sidebar-foreground/40 tracking-widest mb-1">Benefit</p>
                   <p className="text-2xl font-black text-primary">{formData.discount}% Discount</p>
                </div>
              </div>
           </div>

           <div className="mt-auto flex items-center gap-2 text-[10px] font-bold text-sidebar-foreground/40 bg-sidebar-accent p-3 rounded-xl border border-border/30">
              <Info className="h-3 w-3" />
              <span>Preview updates in real-time</span>
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col overflow-hidden bg-card">
           <div className="p-8 border-b border-border flex items-center justify-between">
              <div>
                 <h1 className="text-2xl font-black text-foreground">
                    {badge ? "Edit Badge" : "Create New Badge"}
                 </h1>
                 <p className="text-xs font-bold text-sidebar-foreground/60 mt-1">Configure loyalty tiers and automation rules</p>
              </div>
              <button onClick={onClose} className="p-2.5 rounded-full hover:bg-sidebar-accent transition-colors">
                 <X className="h-6 w-6 text-sidebar-foreground" />
              </button>
           </div>

           <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              
              <section className="space-y-6">
                 <div className="flex items-center gap-3 border-b border-border pb-3">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Badge Information</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[11px] font-black uppercase tracking-widest text-sidebar-foreground/70 ml-1">Name *</label>
                       <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Gold Tier"
                        className="w-full rounded-2xl border border-border bg-background px-5 py-3 text-sm font-bold outline-none focus:border-primary transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-black uppercase tracking-widest text-sidebar-foreground/70 ml-1">Badge Color</label>
                       <div className="flex gap-2">
                          <input 
                            type="color" 
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="h-11 w-20 rounded-xl border border-border bg-background cursor-pointer"
                          />
                          <input 
                            type="text" 
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="flex-1 rounded-xl border border-border bg-background px-4 text-xs font-bold outline-none"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-sidebar-foreground/70 ml-1">Description *</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      placeholder="Describe what this badge represents..."
                      rows={2}
                      className="w-full rounded-2xl border border-border bg-background px-5 py-3 text-sm font-bold outline-none focus:border-primary transition-all resize-none"
                    />
                 </div>
              </section>

              <section className="space-y-6">
                 <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-3">
                       <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                       <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Award Conditions</h3>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setShowConditions(!showConditions)}
                      className="text-[10px] font-black uppercase text-primary hover:underline"
                    >
                       {showConditions ? "Hide Builder" : "Show Builder"}
                    </button>
                 </div>

                 {showConditions && (
                    <div className="space-y-6 bg-sidebar-accent/20 p-6 rounded-[2rem] border border-border/50">
                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/50 ml-1">Field</label>
                             <div className="relative">
                                <select 
                                  value={newCondition.field}
                                  onChange={(e) => setNewCondition({...newCondition, field: e.target.value})}
                                  className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold outline-none cursor-pointer"
                                >
                                   <option value="totalOrders">Order Count</option>
                                   <option value="totalSpent">Total Spent</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-sidebar-foreground" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/50 ml-1">Operation</label>
                             <div className="relative">
                                <select 
                                  value={newCondition.operator}
                                  onChange={(e) => setNewCondition({...newCondition, operator: e.target.value})}
                                  className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold outline-none cursor-pointer"
                                >
                                   <option value="gt">Greater than (&gt;)</option>
                                   <option value="lt">Less than (&lt;)</option>
                                   <option value="gte">Greater or Equal (&gt;=)</option>
                                   <option value="lte">Less or Equal (&lt;=)</option>
                                   <option value="eq">Equal (==)</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-sidebar-foreground" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-sidebar-foreground/50 ml-1">Value</label>
                             <input 
                                type="number" 
                                value={newCondition.value}
                                onChange={(e) => setNewCondition({...newCondition, value: Number(e.target.value)})}
                                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold outline-none"
                             />
                          </div>
                          <button 
                            type="button" 
                            onClick={addCondition}
                            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-blue-600 transition-all"
                          >
                             <Plus className="h-4 w-4" /> Add
                          </button>
                       </div>

                       {/* List of Added Conditions */}
                       <div className="space-y-3">
                          {formData.conditions.map((cond, idx) => (
                             <div key={idx} className="bg-background/80 rounded-2xl p-4 border border-border/30 flex items-center justify-between group">
                                <div className="flex items-center gap-3 text-xs text-sidebar-foreground/70">
                                   <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                   <p>{getFieldLabel(cond.field)} <span className="font-black text-foreground">{getOperatorLabel(cond.operator)} {cond.value}</span></p>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => removeCondition(idx)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                   <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                          ))}
                          {formData.conditions.length === 0 && (
                             <p className="text-center py-6 text-xs font-bold text-sidebar-foreground/30 italic">No conditions added yet</p>
                          )}
                       </div>

                       <p className="text-[10px] leading-relaxed text-sidebar-foreground/60 italic px-2">
                          <span className="font-black text-primary uppercase">Logic:</span> Conditions will be evaluated using <span className="font-black">AND</span> logic. Customer must meet <span className="font-black text-foreground">ALL</span> these conditions to earn this badge.
                       </p>
                    </div>
                 )}
              </section>

              <section className="space-y-6">
                 <div className="flex items-center gap-3 border-b border-border pb-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Discount Percentage *</h3>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="relative w-40">
                       <input 
                        type="number" 
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        required
                        min="0"
                        max="100"
                        className="w-full rounded-2xl border border-border bg-background px-5 py-4 text-xl font-black outline-none focus:border-primary transition-all pr-12"
                       />
                       <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xl font-black text-sidebar-foreground/30">%</span>
                    </div>
                    <p className="text-xs font-bold text-sidebar-foreground/50 max-w-xs">
                       The discount percentage that customers will receive when they earn this badge.
                    </p>
                 </div>
              </section>

           </form>

           <div className="p-8 border-t border-border bg-sidebar-accent/10 flex justify-end gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-border bg-card px-8 py-4 text-sm font-black uppercase tracking-widest text-foreground hover:bg-sidebar-accent"
              >
                 Cancel
              </button>
              <button 
                onClick={handleSubmit}
                className="rounded-2xl bg-primary px-10 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all"
              >
                 {badge ? "Update Badge" : "Save Badge"}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}
