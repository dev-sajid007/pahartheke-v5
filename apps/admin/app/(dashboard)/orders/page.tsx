"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ShoppingBag,
    Eye,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Search,
    RefreshCw,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

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
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
];

const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "failed", "refunded"];

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-700",
};

const PAYMENT_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-700",
};

function StatusBadge({ status, colors }: { status: string; colors: Record<string, string> }) {
    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${colors[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }) + " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
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
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "15" });
            if (statusFilter) params.append("status", statusFilter);
            if (paymentFilter) params.append("paymentStatus", paymentFilter);

            const res = await apiFetch(`/orders?${params.toString()}`);
            setOrders(res.data || []);
            setTotalPages(res.totalPages || 1);
            setTotal(res.total || 0);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, paymentFilter]);

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
            setOrders((prev) =>
                prev.map((o) => (o._id === id ? { ...o, [field]: value } : o))
            );
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

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-[#1a1a2e] flex items-center gap-1">
                    <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
                </Link>
                <span>/</span>
                <span className="text-[#1a1a2e] font-medium">Orders</span>
            </div>

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a2e] flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" /> Orders
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {total} total order{total !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => fetchOrders()}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="mb-5 flex flex-wrap gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>

                <select
                    value={paymentFilter}
                    onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fdc700]"
                >
                    <option value="">All Payments</option>
                    {PAYMENT_STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                </select>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-7 w-7 animate-spin text-[#fdc700]" />
                </div>
            )}

            {/* Empty state */}
            {!loading && orders.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <ShoppingBag className="mx-auto h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-500">No orders found.</p>
                </div>
            )}

            {/* Table */}
            {!loading && orders.length > 0 && (
                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80">
                                <th className="px-4 py-3 font-semibold text-gray-600">Order #</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Customer</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Items</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-right">Total</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Payment</th>
                                <th className="px-4 py-3 font-semibold text-gray-600">Date</th>
                                <th className="px-4 py-3 font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="px-4 py-3 font-mono text-xs text-[#1a1a2e] font-semibold">
                                        {order.orderNumber}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[#1a1a2e] text-[13px]">{order.customerName}</p>
                                        <p className="text-xs text-gray-400">{order.customerPhone}</p>
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-600">
                                        {order.items?.length || 0}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-[#1a1a2e]">
                                        {formatTaka(order.grandTotal)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderField(order._id, "status", e.target.value)}
                                            disabled={updatingId === order._id}
                                            className={`rounded-full border-0 px-2 py-0.5 text-[11px] font-semibold capitalize cursor-pointer focus:ring-2 focus:ring-[#fdc700] ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                                        >
                                            {STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={order.paymentStatus}
                                            onChange={(e) => updateOrderField(order._id, "paymentStatus", e.target.value)}
                                            disabled={updatingId === order._id}
                                            className={`rounded-full border-0 px-2 py-0.5 text-[11px] font-semibold capitalize cursor-pointer focus:ring-2 focus:ring-[#fdc700] ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}
                                        >
                                            {PAYMENT_STATUS_OPTIONS.map((s) => (
                                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1">
                                            <Link
                                                href={`/orders/${order._id}`}
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                title="View details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => deleteOrder(order._id)}
                                                disabled={deletingId === order._id}
                                                className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors"
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                            <p className="text-xs text-gray-500">
                                Page {page} of {totalPages} ({total} orders)
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
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
