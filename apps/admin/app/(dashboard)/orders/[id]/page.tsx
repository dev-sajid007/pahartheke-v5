"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Package,
    User,
    MapPin,
    CreditCard,
    FileText,
    Loader2,
    Truck,
    Clock,
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
    variantId?: string;
    variantName?: string;
    sku?: string;
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

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-indigo-100 text-indigo-800 border-indigo-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-700 border-gray-200",
};

const PAYMENT_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-700",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatTaka(amount?: number | null) {
    return `৳${(amount ?? 0).toLocaleString("en-BD")}`;
}

function InfoCard({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a2e]">
                    <Icon className="h-4 w-4 text-[#fdc700]" />
                </div>
                <h3 className="text-sm font-bold text-[#1a1a2e]">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        apiFetch(`/orders/${id}`)
            .then((res) => setOrder(res.data))
            .catch((e) => setError(e.message || "Failed to load order"))
            .finally(() => setLoading(false));
    }, [id]);

    const updateField = async (field: string, value: string) => {
        if (!order) return;
        setUpdating(true);
        try {
            await apiFetch(`/orders/${id}`, {
                method: "PUT",
                body: JSON.stringify({ [field]: value }),
            });
            setOrder({ ...order, [field]: value });
        } catch (e) {
            alert("Failed to update. " + (e instanceof Error ? e.message : ""));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#fdc700]" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-lg mx-auto mt-20 text-center">
                <p className="text-red-600 font-medium mb-4">{error || "Order not found"}</p>
                <Link href="/orders" className="text-sm text-[#fdc700] hover:underline">
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const address = order.customerAddress;
    const fullAddress = [address?.street, address?.city, address?.state, address?.zipCode, address?.country]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-[#1a1a2e] flex items-center gap-1">
                    <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
                </Link>
                <span>/</span>
                <Link href="/orders" className="hover:text-[#1a1a2e]">Orders</Link>
                <span>/</span>
                <span className="text-[#1a1a2e] font-medium">{order.orderNumber}</span>
            </div>

            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a2e]">Order {order.orderNumber}</h1>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Placed {formatDate(order.createdAt)}
                    </p>
                </div>
                <div className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                    <Truck className="h-3.5 w-3.5" />
                    {order.status}
                </div>
            </div>

            {/* Status Controls */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Order Status</label>
                    <select
                        value={order.status}
                        onChange={(e) => updateField("status", e.target.value)}
                        disabled={updating}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium capitalize focus:outline-none focus:ring-2 focus:ring-[#fdc700] disabled:opacity-50"
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Payment Status</label>
                    <select
                        value={order.paymentStatus}
                        onChange={(e) => updateField("paymentStatus", e.target.value)}
                        disabled={updating}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium capitalize focus:outline-none focus:ring-2 focus:ring-[#fdc700] disabled:opacity-50"
                    >
                        {PAYMENT_STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left column: Items */}
                <div className="lg:col-span-2">
                    <InfoCard icon={Package} title={`Order Items (${order.items.length})`}>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, i) => (
                                <div key={item._id || i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                                    {item.productImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="h-14 w-14 rounded-xl object-cover ring-1 ring-gray-100"
                                        />
                                    ) : (
                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-400 text-xs">
                                            No img
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-semibold text-[#1a1a2e] truncate">{item.productName}</p>
                                        {(item.variantName || item.sku || item.variantId) && (
                                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                                                {item.variantName && (
                                                    <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 font-medium text-amber-800 ring-1 ring-inset ring-amber-600/20">
                                                        Variant: {item.variantName}
                                                    </span>
                                                )}
                                                {item.sku && (
                                                    <span className="inline-flex items-center rounded bg-gray-50 px-1.5 py-0.5 font-mono text-[11px] text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                        SKU: {item.sku}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formatTaka(item.price)} × {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-[#1a1a2e] whitespace-nowrap">
                                        {formatTaka(item.total)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Price breakdown */}
                        <div className="mt-4 border-t border-gray-100 pt-4 space-y-1.5">
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Subtotal</span>
                                <span>{formatTaka(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Shipping</span>
                                <span>{formatTaka(order.shipping)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-xs text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatTaka(order.discount)}</span>
                                </div>
                            )}
                            {order.tax > 0 && (
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>Tax</span>
                                    <span>{formatTaka(order.tax)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm font-bold text-[#1a1a2e] pt-2 border-t border-gray-100">
                                <span>Grand Total</span>
                                <span className="text-base">{formatTaka(order.grandTotal)}</span>
                            </div>
                        </div>
                    </InfoCard>
                </div>

                {/* Right column: Customer + Payment + Notes */}
                <div className="space-y-5">
                    <InfoCard icon={User} title="Customer">
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold text-[#1a1a2e]">{order.customerName}</p>
                            <p className="text-gray-500">{order.customerPhone}</p>
                            {order.customerEmail && <p className="text-gray-500">{order.customerEmail}</p>}
                        </div>
                    </InfoCard>

                    <InfoCard icon={MapPin} title="Shipping Address">
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {fullAddress || "No address provided"}
                        </p>
                    </InfoCard>

                    <InfoCard icon={CreditCard} title="Payment">
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium text-[#1a1a2e] capitalize">{order.paymentMethod}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${PAYMENT_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </InfoCard>

                    {(order.notes || order.deliveryNotes) && (
                        <InfoCard icon={FileText} title="Notes">
                            {order.notes && (
                                <div className="mb-2">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Customer Note</p>
                                    <p className="text-sm text-gray-600">{order.notes}</p>
                                </div>
                            )}
                            {order.deliveryNotes && (
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase mb-1">Delivery Note</p>
                                    <p className="text-sm text-gray-600">{order.deliveryNotes}</p>
                                </div>
                            )}
                        </InfoCard>
                    )}
                </div>
            </div>

            {/* Back button */}
            <div className="mt-8">
                <Link
                    href="/orders"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Orders
                </Link>
            </div>
        </div>
    );
}
