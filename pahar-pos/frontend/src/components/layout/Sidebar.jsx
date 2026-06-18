"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  Truck,
  Receipt,
  Banknote,
  Tags,
  ClipboardList,
  LogOut,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  List,
  Award,
  BarChart3,
  CalendarDays,
  TrendingUp,
  Calculator,
  Wallet,
  RotateCcw,
  DollarSign
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { 
    name: "Products", 
    icon: Package,
    subItems: [
      { name: "Product List", href: "/products", icon: List },
      { name: "Add Product", href: "/products/new", icon: PlusCircle },
      { name: "Categories", href: "/categories", icon: Tags },
    ]
  },
  { 
    name: "Sales", 
    icon: ShoppingCart,
    subItems: [
      { name: "Sale List", href: "/sales/history", icon: List },
      { name: "POS (Point of Sale)", href: "/sales", icon: Receipt },
    ]
  },
  { name: "Stock Ledger", href: "/stock", icon: ClipboardList },
  { 
    name: "People", 
    icon: Users,
    subItems: [
      { name: "Customers", href: "/customers", icon: Users },
      { name: "Suppliers", href: "/suppliers", icon: Truck },
      { name: "Badges", href: "/badges", icon: Award },
    ]
  },
  {
    name: "Purchases",
    icon: Receipt,
    subItems: [
      { name: "All Purchases", href: "/purchases", icon: Receipt },
      { name: "Cost Types", href: "/purchases/costs", icon: DollarSign },
    ]
  },
  { name: "Expenses", href: "/expenses", icon: Banknote },
  { 
    name: "Reports", 
    icon: BarChart3,
    subItems: [
      { name: "Daily Sales", href: "/reports/daily-sales", icon: CalendarDays },
      { name: "Product Sales", href: "/reports/product-sales", icon: Package },
      { name: "Gross Profit", href: "/reports/profit", icon: TrendingUp },
      { name: "COGS Report", href: "/reports/cogs", icon: Calculator },
      { name: "Expense Report", href: "/reports/expenses", icon: Wallet },
      { name: "Return Sales", href: "/reports/returns", icon: RotateCcw },
    ]
  },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const toggleDropdown = (name) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar transition-transform sm:translate-x-0">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4 custom-scrollbar">
        {/* Brand Logo Area */}
        <div className="mb-8 flex items-center pl-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <span className="text-xl font-bold">P</span>
          </div>
          <span className="ml-3 self-center whitespace-nowrap text-xl font-bold tracking-tight text-foreground">
            PAHAR POS
          </span>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-1.5 font-medium">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isDropdownOpen = openDropdown === item.name;
            const isParentActive = hasSubItems && item.subItems.some(sub => pathname === sub.href);
            const isSingleActive = !hasSubItems && pathname === item.href;
            
            return (
              <li key={item.name} className="space-y-1">
                {hasSubItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`group flex w-full items-center justify-between rounded-xl p-3 text-sm transition-all duration-200 ${
                        isParentActive || isDropdownOpen
                          ? "bg-sidebar-accent/50 text-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5" />
                        <span className="ml-3">{item.name}</span>
                      </div>
                      {isDropdownOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {isDropdownOpen && (
                      <ul className="ml-4 space-y-1 border-l border-border pl-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {item.subItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;
                          return (
                            <li key={sub.name}>
                              <Link
                                href={sub.href}
                                className={`flex items-center rounded-lg p-2.5 text-xs transition-all duration-200 ${
                                  isSubActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                                }`}
                              >
                                <SubIcon className="h-4 w-4" />
                                <span className="ml-3">{sub.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`group flex items-center rounded-xl p-3 text-sm transition-all duration-200 ${
                      isSingleActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-transform duration-200 ${
                        isSingleActive ? "" : "group-hover:scale-110"
                      }`}
                    />
                    <span className="ml-3">{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Bottom Actions */}
        <div className="mt-auto pb-4 pt-4 border-t border-border/50">
          <button 
            onClick={handleLogout}
            className="group flex w-full items-center rounded-xl p-3 text-sm font-medium text-rose-500 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="ml-3">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
