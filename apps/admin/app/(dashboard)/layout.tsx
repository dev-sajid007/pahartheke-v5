"use client";

import Sidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { Globe, ExternalLink } from "lucide-react";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/hero": "Hero Section",
  "/product-sections": "Product Sections",
  "/affiliate": "Affiliate Banner",
  "/invest": "Invest Banner",
  "/about": "About Section",
  "/reviews": "Customer Reviews",
  "/delivery": "Delivery",
  "/footer": "Footer",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const title =
    pathname.startsWith("/orders/") ? "Order Details" : TITLES[pathname] || "Admin";

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <Sidebar />

      <div className="pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/85 px-8 backdrop-blur">
          <h1 className="text-base font-bold text-[#1a1a2e]">{title}</h1>
          <a
            href="http://localhost:7103"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-[#fdc700] hover:text-[#1a1a2e]"
          >
            <Globe className="h-3.5 w-3.5" />
            View Storefront
            <ExternalLink className="h-3 w-3" />
          </a>
        </header>

        <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
