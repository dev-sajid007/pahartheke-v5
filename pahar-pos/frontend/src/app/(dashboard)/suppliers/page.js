"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import SupplierModal from "@/components/suppliers/SupplierModal";
import api from "@/lib/axios";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/suppliers");
      if (res.data.data) {
        setSuppliers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch suppliers", error);
      alert("Error fetching suppliers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSaveSupplier = async (formData) => {
    try {
      if (selectedSupplier) {
        await api.put(`/suppliers/${selectedSupplier._id}`, formData);
      } else {
        await api.post("/suppliers", formData);
      }
      setIsModalOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Failed to save supplier", error);
      alert(error.response?.data?.message || "Failed to save supplier");
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error("Failed to delete supplier", error);
      alert(error.response?.data?.message || "Failed to delete supplier");
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Suppliers</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Manage your vendors and track outstanding dues.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent shadow-sm">
            Export CSV
          </button>
          <button 
            onClick={handleAddSupplier}
            className="flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search suppliers or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent w-full sm:w-auto justify-center">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Suppliers Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sidebar-foreground">
            <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Supplier Details</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Total Purchases</th>
                <th className="px-6 py-4 font-semibold">Outstanding Due</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{supplier.companyName || supplier.name}</span>
                      {supplier.companyName && <span className="text-xs text-sidebar-foreground mt-0.5">Rep: {supplier.name}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-foreground">{supplier.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    ৳ {supplier.totalPurchaseAmount}
                  </td>
                  <td className="px-6 py-4">
                    {supplier.previousDue > 0 ? (
                      <div className="flex items-center gap-1.5 text-rose-600 font-semibold bg-rose-50 dark:bg-rose-900/10 px-2 py-1 rounded-md w-fit">
                        <AlertCircle className="w-3.5 h-3.5" />
                        ৳ {supplier.previousDue}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Cleared
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        supplier.status
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                      }`}
                    >
                      {supplier.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {supplier.previousDue > 0 && (
                        <button className="rounded-lg bg-emerald-50 text-emerald-600 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50">
                          Settle Due
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditSupplier(supplier)}
                        className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteSupplier(supplier._id)}
                        className="rounded-lg p-2 text-sidebar-foreground hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SupplierModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={selectedSupplier}
        onSave={handleSaveSupplier}
      />
    </div>
  );
}
