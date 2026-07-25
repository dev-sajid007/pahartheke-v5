"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

export default function ExpenseModal({ isOpen, onClose, expense = null, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    reference: "",
    note: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || "",
        category: expense.category?._id || expense.category || "",
        amount: expense.amount || 0,
        date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        paymentMethod: expense.paymentMethod || "Cash",
        reference: expense.reference || "",
        note: expense.note || "",
      });
    } else {
      setFormData({
        title: "",
        category: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
        reference: "",
        note: "",
      });
    }
  }, [expense, isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/expense-categories");
      if (res.data.data) setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch expense categories", error);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity px-4">
      <div className="relative w-full max-w-lg scale-100 rounded-2xl bg-card p-6 opacity-100 shadow-xl transition-all sm:p-8">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-bold text-foreground">
            {expense ? "Edit Expense" : "Record New Expense"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Expense Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Office Rent, Electricity Bill"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Amount (৳) *</label>
              <input
                type="number"
                name="amount"
                min="0"
                value={formData.amount || ""}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Card">Card</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Reference/Invoice No.</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. INV-2026-05"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-sidebar-foreground">Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Additional details..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
            >
              {expense ? "Update Expense" : "Record Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
