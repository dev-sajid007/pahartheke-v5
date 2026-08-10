"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Image,
  BadgeDollarSign,
  TrendingUp,
  Info,
  Star,
  ArrowRight,
  Footprints,
  ShoppingBag,
  Truck,
  LayoutGrid,
  Users,
  CircleDollarSign,
  Clock,
  PackageCheck,
  Loader2,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { StatCard, Card, EmptyState } from "@/components/ui";

const sections = [
  { href: "/hero", label: "Hero Section", description: "Hero banner, background video and CTA button.", icon: Image, color: "bg-blue-500" },
  { href: "/affiliate", label: "Affiliate Banner", description: "“Earn Money With Us” — title, banner, steps.", icon: BadgeDollarSign, color: "bg-emerald-500" },
  { href: "/invest", label: "Invest Banner", description: "“Invest With Us” — title, features, CTA.", icon: TrendingUp, color: "bg-violet-500" },
  { href: "/about", label: "About Section", description: "“কেন পাহাড় থেকে” heading, description, process steps.", icon: Info, color: "bg-orange-500" },
  { href: "/reviews", label: "Customer Reviews", description: "Add, edit and remove homepage testimonials.", icon: Star, color: "bg-amber-500" },
  { href: "/footer", label: "Footer", description: "Links, social media and contact information.", icon: Footprints, color: "bg-teal-500" },
  { href: "/product-sections", label: "Product Sections", description: "Featured, Best Sellers and Popular section titles.", icon: LayoutGrid, color: "bg-indigo-500" },
  { href: "/delivery", label: "Delivery", description: "Delivery zones and charges shown at checkout.", icon: Truck, color: "bg-cyan-500" },
];

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/orders?page=1&limit=8");
      setOrders(res.data || []);
      setTotal(res.total || 0);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const paidTotal = orders.reduce((s, o) => s + (o.paymentStatus === "paid" ? o.grandTotal : 0), 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Store overview and quick access to every editable homepage section.
        </p>
      </div>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<ShoppingBag className="h-5 w-5 text-[#1a1a2e]" />}
          label="Total Orders"
          value={loading ? "—" : total}
          hint="Across all statuses"
        />
        <StatCard
          icon={<CircleDollarSign className="h-5 w-5 text-white" />}
          label="Paid Revenue (recent)"
          value={loading ? "—" : `৳${paidTotal.toLocaleString("en-BD")}`}
          hint="Paid orders on this page"
          accent="bg-emerald-500"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-white" />}
          label="Pending Orders"
          value={loading ? "—" : pendingCount}
          hint="Awaiting confirmation"
          accent="bg-amber-500"
        />
        <Link href="/orders" className="block">
          <div className="group flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#fdc700] hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-[#1a1a2e]">Manage Orders</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[#fdc700]">
                Open orders <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent orders */}
        <Card
          title="Recent Orders"
          icon={<ShoppingBag className="h-4 w-4" />}
          actions={
            <Link href="/orders" className="text-xs font-medium text-[#fdc700] hover:text-[#1a1a2e]">
              View all
            </Link>
          }
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin text-[#fdc700]" /> Loading…
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="h-5 w-5" />}
              title="No orders yet"
              description="Orders placed on the storefront will appear here."
            />
          ) : (
            <ul className="divide-y divide-gray-50">
              {orders.map((order) => (
                <li key={order._id}>
                  <Link
                    href={`/orders/${order._id}`}
                    className="group flex items-center justify-between gap-4 py-3 transition"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold text-[#1a1a2e]">
                        {order.orderNumber}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {order.customerName}
                        {order.customerPhone && ` · ${order.customerPhone}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-bold text-[#1a1a2e]">
                        ৳{order.grandTotal.toLocaleString("en-BD")}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          order.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Quick stats note */}
        <Card title="Content Manager" icon={<Users className="h-4 w-4" />} description="Edit any homepage section">
          <div className="grid grid-cols-2 gap-3">
            {sections.map(({ href, label, icon: Icon, color }) => (
              <Link
                key={href}
                href={href}
                className="card-hover flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-3"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4 text-white" />
                </span>
                <span className="truncate text-[13px] font-semibold text-[#1a1a2e]">{label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
