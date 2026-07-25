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
  ChevronRight,
  Mountain,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hero", label: "Hero Section", icon: Image },
  { href: "/affiliate", label: "Affiliate Banner", icon: BadgeDollarSign },
  { href: "/invest", label: "Invest Banner", icon: TrendingUp },
  { href: "/about", label: "About Section", icon: Info },
  { href: "/reviews", label: "Customer Reviews", icon: Star },
  { href: "/footer", label: "Footer", icon: Footprints },
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-[#1a1a2e] flex flex-col z-50">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#fdc700]">
          <Mountain className="h-5 w-5 text-[#1a1a2e]" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white leading-tight">পাহাড় থেকে</p>
          <p className="text-[10px] text-white/50 leading-tight">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Content Manager
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1 text-sm font-medium transition-all ${
                active
                  ? "bg-[#fdc700] text-[#1a1a2e]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
