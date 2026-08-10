"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  BadgeDollarSign,
  TrendingUp,
  Info,
  Star,
  Footprints,
  ShoppingBag,
  Mountain,
  LogOut,
  Bus,
  CarTaxiFront,
} from "lucide-react";

const contentItems = [
  { href: "/hero", label: "Hero Section", icon: Image, desc: "Banner, video & CTA" },
  { href: "/product-sections", label: "Product Sections", icon: CarTaxiFront, desc: "Section titles" },
  { href: "/affiliate", label: "Affiliate Banner", icon: BadgeDollarSign, desc: "Earn money section" },
  { href: "/invest", label: "Invest Banner", icon: TrendingUp, desc: "Invest section" },
  { href: "/about", label: "About Section", icon: Info, desc: "About & process" },
  { href: "/reviews", label: "Customer Reviews", icon: Star, desc: "Testimonials" },
  { href: "/delivery", label: "Delivery", icon: Bus, desc: "Zones & charges" },
  { href: "/footer", label: "Footer", icon: Footprints, desc: "Links & contact" },
];

const storeItems = [
  { href: "/orders", label: "Orders", icon: ShoppingBag, desc: "Customer orders" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "admin_token=; path=/; max-age=0";
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const renderItem = ({ href, label, icon: Icon, desc }: (typeof contentItems)[number]) => {
    const active = isActive(href);
    return (
      <Link
        key={href}
        href={href}
        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
          active
            ? "bg-[#fdc700] text-[#1a1a2e]"
            : "text-white/65 hover:bg-white/[0.06] hover:text-white"
        }`}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{label}</span>
        {active && (
          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#1a1a2e]/80" />
        )}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-[#17182b]">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdc700] shadow-lg shadow-[#fdc700]/20">
          <Mountain className="h-5 w-5 text-[#1a1a2e]" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white leading-tight">পাহাড় থেকে</p>
          <p className="text-[11px] text-white/40">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
            Overview
          </p>
          {renderItem({ href: "/", label: "Dashboard", icon: LayoutDashboard, desc: "Overview" })}
        </div>

        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
            Store
          </p>
          {storeItems.map((item) => renderItem({ ...item, href: item.href }))}
        </div>

        <div>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
            Content Manager
          </p>
          {contentItems.map((item) => renderItem(item))}
        </div>
      </nav>

      <div className="border-t border-white/[0.06] px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/45 transition hover:bg-white/[0.06] hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
