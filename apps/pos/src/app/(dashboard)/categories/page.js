"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import CategoryModal from "@/components/categories/CategoryModal";
import api from "@/lib/axios";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/categories");
      if (res.data.data) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (formData) => {
    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory._id}`, formData, config);
      } else {
        await api.post("/categories", formData, config);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Failed to save category", error);
      alert(error.response?.data?.message || "Failed to save category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category", error);
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  const filteredCategories = categories.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Manage product categories and taxonomy.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAddCategory}
            className="flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sidebar-foreground">
            <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Image</th>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                  <td className="px-6 py-4">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-sidebar-accent" />
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{category.name}</td>
                  <td className="px-6 py-4">{category.description || "-"}</td>
                  <td className="px-6 py-4">
                    {category.status ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
                        <AlertCircle className="h-3.5 w-3.5" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category._id)}
                        className="rounded-lg p-2 text-sidebar-foreground hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sidebar-foreground">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal 
        key={selectedCategory?._id || 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}
