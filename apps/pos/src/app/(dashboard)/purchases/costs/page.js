"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle2, AlertCircle, DollarSign, X, Save } from "lucide-react";
import api from "@/lib/axios";

export default function PurchaseCostsPage() {
  const [costs, setCosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/purchase-costs");
      if (res.data.data) setCosts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch cost types", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCost(null);
    setFormData({ name: "", description: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (cost) => {
    setSelectedCost(cost);
    setFormData({ name: cost.name, description: cost.description || "" });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (selectedCost) {
        await api.put(`/purchase-costs/${selectedCost._id}`, formData);
      } else {
        await api.post("/purchase-costs", formData);
      }
      setIsModalOpen(false);
      fetchCosts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save");
    }
  };

  const handleToggleStatus = async (cost) => {
    try {
      await api.put(`/purchase-costs/${cost._id}`, { status: !cost.status });
      fetchCosts();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this cost type?")) return;
    try {
      await api.delete(`/purchase-costs/${id}`);
      fetchCosts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  const filtered = costs.filter(c =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Purchase Cost Types</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Manage additional cost categories for purchases (Transport, Loading, Customs, etc.).
          </p>
        </div>
        <button onClick={handleAdd} className="flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" />
          Add Cost Type
        </button>
      </div>

      <div className="flex gap-4 items-center rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input type="text" placeholder="Search cost types..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sidebar-foreground">
            <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((cost) => (
                <tr key={cost._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground">{cost.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sidebar-foreground">{cost.description || "-"}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleToggleStatus(cost)}>
                      {cost.status ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800">
                          <AlertCircle className="h-3.5 w-3.5" /> Inactive
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => handleEdit(cost)} className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(cost._id)} className="rounded-lg p-2 text-sidebar-foreground hover:bg-rose-100 hover:text-rose-600 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sidebar-foreground">No cost types found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl border border-border animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">{selectedCost ? "Edit Cost Type" : "Add Cost Type"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1.5 text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Description</label>
                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:bg-blue-600 transition-all">
                  <Save className="h-4 w-4" />
                  {selectedCost ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
