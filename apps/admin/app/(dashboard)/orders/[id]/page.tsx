"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import { PageHeader, Card, Badge, STATUS_COLORS, Select } from "@/components/ui";

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

export default function OrderDetailPage() {
  const params = useParams();
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
      <div className="flex items-center justify-center gap-3 py-24 text-sm text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-[#fdc700]" /> Loading order…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto mt-20 max-w-lg text-center">
        <p className="mb-4 font-medium text-red-600">{error || "Order not found"}</p>
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
    <div>
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Placed {formatDate(order.createdAt)}
          </span>
        }
        breadcrumb={[
          { href: "/", label: "Dashboard" },
          { href: "/orders", label: "Orders" },
          { href: `/orders/${order._id}`, label: order.orderNumber },
        ]}
        actions={
          <div className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-400" />
            <Badge color={STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}>{order.status}</Badge>
          </div>
        }
      />

      {/* Status controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Order Status">
          <Select
            value={order.status}
            onChange={(e) => updateField("status", e.target.value)}
            disabled={updating}
            className="capitalize"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </Select>
        </Card>
        <Card title="Payment Status">
          <Select
            value={order.paymentStatus}
            onChange={(e) => updateField("paymentStatus", e.target.value)}
            disabled={updating}
            className="capitalize"
          >
            {PAYMENT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </Select>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title={`Order Items (${order.items.length})`} icon={<Package className="h-4 w-4" />}>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, i) => (
                <div key={item._id || i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  {item.productImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.productImage} alt={item.productName} className="h-14 w-14 rounded-xl object-cover ring-1 ring-gray-100" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-xs text-gray-400">No img</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-[#1a1a2e]">{item.productName}</p>
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
                    <p className="mt-1 text-xs text-gray-400">
                      {formatTaka(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold text-[#1a1a2e]">{formatTaka(item.total)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Subtotal</span>
                <span>{formatTaka(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Shipping</span>
                <span>{formatTaka(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-600">
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
              <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-bold text-[#1a1a2e]">
                <span>Grand Total</span>
                <span className="text-base">{formatTaka(order.grandTotal)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Customer" icon={<User className="h-4 w-4" />}>
            <div className="space-y-2 text-sm">
              <p className="font-semibold text-[#1a1a2e]">{order.customerName}</p>
              <p className="text-gray-500">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-gray-500">{order.customerEmail}</p>}
            </div>
          </Card>

          <Card title="Shipping Address" icon={<MapPin className="h-4 w-4" />}>
            <p className="text-sm leading-relaxed text-gray-600">{fullAddress || "No address provided"}</p>
          </Card>

          <Card title="Payment" icon={<CreditCard className="h-4 w-4" />}>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-medium capitalize text-[#1a1a2e]">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Status</span>
                <Badge color={STATUS_COLORS[order.paymentStatus] || "bg-gray-100 text-gray-600"}>{order.paymentStatus}</Badge>
              </div>
            </div>
          </Card>

          {(order.notes || order.deliveryNotes) && (
            <Card title="Notes" icon={<FileText className="h-4 w-4" />}>
              {order.notes && (
                <div className="mb-2">
                  <p className="mb-1 text-[10px] font-semibold uppercase text-gray-400">Customer Note</p>
                  <p className="text-sm text-gray-600">{order.notes}</p>
                </div>
              )}
              {order.deliveryNotes && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase text-gray-400">Delivery Note</p>
                  <p className="text-sm text-gray-600">{order.deliveryNotes}</p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>
    </div>
  );
}
