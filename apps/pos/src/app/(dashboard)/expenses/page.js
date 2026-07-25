"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Filter, X, Edit, Trash2 } from "lucide-react";
import ExpenseModal from "@/components/expenses/ExpenseModal";
import api from "@/lib/axios";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/expenses");
      if (res.data.data) {
        setExpenses(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses", error);
      alert("Error fetching expenses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleSaveExpense = async (formData) => {
    try {
      if (selectedExpense) {
        await api.put(`/expenses/${selectedExpense._id}`, formData);
      } else {
        await api.post("/expenses", formData);
      }
      setIsModalOpen(false);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to save expense", error);
      alert(error.response?.data?.message || "Failed to save expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense", error);
      alert(error.response?.data?.message || "Failed to delete expense");
    }
  };

  const expensesInMonth = useMemo(() => {
    if (!filterMonth) return expenses;
    return expenses.filter((e) => {
      const d = e.date ? new Date(e.date) : null;
      if (!d) return false;
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return ym === filterMonth;
    });
  }, [expenses, filterMonth]);

  const filteredExpenses = expensesInMonth.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.category?.name || "").toLowerCase().includes(q) ||
      (e.paymentMethod || "").toLowerCase().includes(q)
    );
  });

  const formatDate = (d) => {
    if (!d) return "-";
    const date = new Date(d);
    return date.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const paymentBadgeColor = (method) => {
    switch (method) {
      case "Bank": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Card": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default: return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    }
  };

  const monthTotal = expensesInMonth.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Expenses</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Track your operational costs and overheads.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddExpense}
            className="flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Record Expense
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search title, category or payment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground pointer-events-none" />
            <input
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
              className="w-full sm:w-44 rounded-xl border border-border bg-background py-2 pl-9 pr-8 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {filterMonth && (
              <button
                onClick={() =>
                  setFilterMonth(
                    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-sidebar-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="text-sm font-semibold text-foreground whitespace-nowrap">
            Total: ৳{monthTotal.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-sidebar-foreground">
            <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Expense Details</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sidebar-foreground">
                    {isLoading ? "Loading..." : "No expenses found."}
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{expense.title}</span>
                        {expense.reference && (
                          <span className="text-xs text-sidebar-foreground mt-0.5">Ref: {expense.reference}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-sidebar-accent px-2 py-1 text-xs font-medium text-sidebar-foreground">
                        {expense.category?.name || expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${paymentBadgeColor(expense.paymentMethod)}`}>
                        {expense.paymentMethod || "Cash"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sidebar-foreground">
                      {formatDate(expense.date)}
                    </td>
                    <td className="px-6 py-4 font-bold text-rose-600">
                      ৳ {expense.amount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense._id)}
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

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expense={selectedExpense}
        onSave={handleSaveExpense}
      />
    </div>
  );
}
