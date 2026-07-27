"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import ExpenseCategoryModal from "@/components/expenses/ExpenseCategoryModal";
import api from "@/lib/axios";

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/expense-categories");
      if (res.data.data) setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch expense categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedCategory) {
        await api.put(`/expense-categories/${selectedCategory._id}`, formData);
      } else {
        await api.post("/expense-categories", formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save expense category", error);
      alert(error.response?.data?.message || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense category?")) return;
    try {
      await api.delete(`/expense-categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete", error);
      alert(error.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Expense Categories</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Manage categories used for expense tracking.
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </button>
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
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sidebar-foreground">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sidebar-foreground">
                    No expense categories yet.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-foreground">{cat.name}</td>
                    <td className="px-6 py-4 text-sidebar-foreground">
                      {cat.description || <span className="italic opacity-50">No description</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          cat.status
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                        }`}
                      >
                        {cat.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="rounded-lg p-2 text-sidebar-foreground hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ExpenseCategoryModal
        key={selectedCategory?._id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSave={handleSave}
      />
    </div>
  );
}
