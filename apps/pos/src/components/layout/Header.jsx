"use client";

"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Menu } from "lucide-react";

export default function Header() {
  const [user] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : { name: "User", role: "" };
    } catch {
      return { name: "User", role: "" };
    }
  });

  const initials = user.name
    ? user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile Menu Toggle & Search */}
      <div className="flex flex-1 items-center gap-4">
        <button className="rounded-lg p-2 text-foreground hover:bg-sidebar-accent sm:hidden">
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden max-w-md flex-1 items-center relative sm:flex">
          <Search className="absolute left-3 h-4 w-4 text-sidebar-foreground" />
          <input
            type="text"
            placeholder="Search anywhere..."
            className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications */}
        <button className="relative rounded-full p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
          </span>
        </button>

        {/* Divider */}
        <div className="hidden h-6 w-px bg-border sm:block"></div>

        {/* User Profile */}
        <button className="flex items-center gap-3 rounded-full border border-border bg-card p-1 pr-3 transition-all hover:bg-sidebar-accent shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </div>
          <div className="hidden flex-col items-start text-left sm:flex">
            <span className="text-xs font-semibold leading-none text-foreground">{user.name}</span>
            <span className="mt-1 text-[10px] font-medium leading-none text-sidebar-foreground">{user.role || "User"}</span>
          </div>
        </button>
      </div>
    </header>
  );
}
