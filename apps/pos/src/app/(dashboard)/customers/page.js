"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit, Trash2, Heart, AlertCircle, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import CustomerModal from "@/components/customers/CustomerModal";
import api from "@/lib/axios";

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchQuery]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const params = { page: currentPage, limit: ITEMS_PER_PAGE };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const res = await api.get("/customers", { params });
      if (res.data.data) {
        setCustomers(res.data.data.customers);
        setTotalPages(res.data.data.pagination.totalPages);
        setTotal(res.data.data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
      alert("Error fetching customers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (formData) => {
    try {
      if (selectedCustomer) {
        await api.put(`/customers/${selectedCustomer._id}`, formData);
      } else {
        await api.post("/customers", formData);
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to save customer", error);
      alert(error.response?.data?.message || "Failed to save customer");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Failed to delete customer", error);
      alert(error.response?.data?.message || "Failed to delete customer");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredCustomers = customers;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-sm text-sidebar-foreground mt-1">
            Manage your client base, track loyalty points, and monitor dues.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-sidebar-accent shadow-sm">
            Export CSV
          </button>
          <button 
            onClick={handleAddCustomer}
            className="flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search name or phone..."
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

      {/* Customers Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <span className="ml-3 text-sm text-sidebar-foreground">Loading customers...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-sidebar-foreground">
                <thead className="bg-sidebar-accent/50 text-xs uppercase text-sidebar-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Customer Info</th>
                    <th className="px-6 py-4 font-semibold">Total Spent</th>
                    <th className="px-6 py-4 font-semibold">Loyalty Points</th>
                    <th className="px-6 py-4 font-semibold">Outstanding Due</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sidebar-foreground">
                        <p>No customers found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-sidebar-accent/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{customer.name}</span>
                            <span className="text-xs text-sidebar-foreground mt-0.5">{customer.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          ৳ {customer.totalSpent}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-pink-600 font-semibold bg-pink-50 dark:bg-pink-900/10 px-2 py-1 rounded-md w-fit">
                            <Heart className="w-3.5 h-3.5 fill-pink-600" />
                            {customer.loyaltyPoints} pts
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {customer.previousDue > 0 ? (
                            <div className="flex items-center gap-1.5 text-rose-600 font-semibold bg-rose-50 dark:bg-rose-900/10 px-2 py-1 rounded-md w-fit">
                              <AlertCircle className="w-3.5 h-3.5" />
                              ৳ {customer.previousDue}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                              <CheckCircle2 className="w-4 h-4" />
                              Cleared
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            {customer.previousDue > 0 && (
                              <button className="rounded-lg bg-emerald-50 text-emerald-600 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-100 transition-colors dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50">
                                Receive Payment
                              </button>
                            )}
                            <button 
                              onClick={() => handleEditCustomer(customer)}
                              className="rounded-lg p-2 text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteCustomer(customer._id)}
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

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-6 py-4">
              <span className="text-sm text-sidebar-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">
                  {Math.min(currentPage * ITEMS_PER_PAGE, total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">{total}</span> results
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-sidebar-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                      page === currentPage
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "border-border text-foreground hover:bg-sidebar-accent"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-sidebar-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <CustomerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
}
