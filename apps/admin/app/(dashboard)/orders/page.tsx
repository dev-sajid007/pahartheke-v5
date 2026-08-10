"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  RefreshCw,
  CircleDollarSign,
  Clock,
  PackageCheck,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { PageHeader, Card, Badge, STATUS_COLORS, StatCard, EmptyState } from "@/components/ui";

interface OrderItem {
  _id: string;
  externalProductId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  deliveryNotes?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_OPTIONS = [
  "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",
];

const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

function formatTaka(amount?: number | null) {
  return `৳${(amount ?? 0).toLocaleString("en-BD")}`;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (statusFilter) params.append("status", statusFilter);
      if (paymentFilter) params.append("paymentStatus", paymentFilter);
      if (search) params.append("customerPhone", search);

      const res = await apiFetch(`/orders?${params.toString()}`);
      setOrders(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, paymentFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderField = async (id: string, field: string, value: string) => {
    setUpdatingId(id);
    try {
      await apiFetch(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ [field]: value }),
      });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, [field]: value } : o)));
    } catch (e) {
      alert("Failed to update. " + (e instanceof Error ? e.message : ""));
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setDeletingId(id);
    try {
      await apiFetch(`/orders/${id}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o._id !== id));
      setTotal((t) => t - 1);
    } catch (e) {
      alert("Failed to delete. " + (e instanceof Error ? e.message : ""));
    } finally {
      setDeletingId(null);
    }
  };

  const applySearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const resetFilters = () => {
    setStatusFilter("");
    setPaymentFilter("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const revenue = orders.reduce((s, o) => s + (o.paymentStatus === "paid" ? o.grandTotal : 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const hasFilters = Boolean(statusFilter || paymentFilter || search);

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${total} total order${total !== 1 ? "s" : ""} placed on the storefront.`}
        breadcrumb={[{ href: "/", label: "Dashboard" }, { href: "/orders", label: "Orders" }]}
        actions={
          <button
            onClick={() => fetchOrders()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        }
      />

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<ShoppingBag className="h-5 w-5 text-[#1a1a2e]" />} label="Orders (current page)" value={loading ? "—" : orders.length} />
        <StatCard icon={<CircleDollarSign className="h-5 w-5 text-white" />} label="Paid revenue (page)" value={loading ? "—" : formatTaka(revenue)} accent="bg-emerald-500" />
        <StatCard icon={<Clock className="h-5 w-5 text-white" />} label="Pending" value={loading ? "—" : pendingCount} accent="bg-amber-500" />
        <StatCard icon={<PackageCheck className="h-5 w-5 text-white" />} label="Delivered" value={loading ? "—" : deliveredCount} accent="bg-indigo-500" />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
              placeholder="Search by phone number…"
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#fdc700] focus:outline-none focus:ring-2 focus:ring-[#fdc700]/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fdc700]/30"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fdc700]/30"
          >
            <option value="">All Payments</option>
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <button
            onClick={applySearch}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1a1a2e] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2a2a4e]"
          >
            <Search className="h-4 w-4" /> Search
          </button>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sm text-gray-400">
          <Loader2 className="h-6 w-6 animate-spin text-[#fdc700]" /> Loading orders…
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title={hasFilters ? "No matching orders" : "No orders found"}
          description={
            hasFilters
              ? "Try adjusting your filters or search term."
              : "Orders placed on the storefront will appear here."
          }
          action={
            hasFilters ? (
              <button
                onClick={resetFilters}
                className="rounded-xl bg-[#fdc700] px-4 py-2 text-sm font-semibold text-[#1a1a2e] hover:bg-[#e6b400]"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] uppercase tracking-wider text-gray-500">
                  <th className="px-5 py-3 font-semibold">Order #</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 text-center font-semibold">Items</th>
                  <th className="px-5 py-3 text-right font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3.5">
                      <Link href={`/orders/${order._id}`} className="font-mono text-xs font-semibold text-[#1a1a2e] hover:text-[#fdc700]">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-[#1a1a2e]">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center text-gray-600">{order.items?.length || 0}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-[#1a1a2e]">
                      {formatTaka(order.grandTotal)}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderField(order._id, "status", e.target.value)}
                        disabled={updatingId === order._id}
                        className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold capitalize focus:ring-2 focus:ring-[#fdc700] ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => updateOrderField(order._id, "paymentStatus", e.target.value)}
                        disabled={updatingId === order._id}
                        className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold capitalize focus:ring-2 focus:ring-[#fdc700] ${STATUS_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}
                      >
                        {PAYMENT_STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/orders/${order._id}`}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteOrder(order._id)}
                          disabled={deletingId === order._id}
                          className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete order"
                        >
                          {deletingId === order._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3.5">
              <p className="text-xs text-gray-500">
                Page {page} of {totalPages} · {total} orders
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-xs font-medium text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
