"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, Phone } from "lucide-react"
import { useSelector } from "react-redux"

import CartSheet from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const items = useSelector((state) => state.cart.items)
  const totalQty = items.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/search-results")
    }
    setMobileSearchOpen(false)
  }

  return (
    <div className="sticky top-0 z-50">
      {/* ── Top Contact Bar ── */}
      <div className="bg-[#1a1a2e] text-white text-sm py-1.5 px-4 flex items-center justify-center gap-2">
        <Phone className="h-3 w-3 text-[#fdc700]" />
        <span className="text-slate-300">যোগাযোগ করুন:</span>
        <a
          href="tel:01531532139"
          className="font-semibold text-[#fdc700] hover:text-yellow-300 tracking-wide transition"
        >
          +88 01531532139
        </a>
      </div>

      {/* ── Main Header ── */}
      <header className="bg-[#76B432] backdrop-blur-md shadow-sm overflow-visible dark:bg-slate-900/90 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center gap-3 relative">

          {/* Mobile Menu */}
          <button className="lg:hidden p-2 -ml-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 relative z-10 translate-y-6 bg-white p-1.5 rounded-full shadow-xl border-4 border-slate-100 dark:border-slate-900 flex items-center justify-center aspect-square"
          >
            <Image
              src="https://pahartheke.com/assets/img/logo.png"
              alt="Pahar Theke Logo - Authentic Natural Products"
              width={85}
              height={85}
              className="h-12 md:h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Search Bar — smaller, max-w-xs */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xs ml-4">
            <div className="relative w-full">
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full pl-8 pr-3 bg-white border-slate-300 text-xs rounded focus:bg-white focus:border-emerald-600 outline-none transition dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto">

            {/* Mobile search icon */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="lg:hidden p-2 rounded-md hover:bg-white/20 transition"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-white" />
            </button>

            {/* Cart */}
            <CartSheet>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 text-slate-700 hover:text-slate-900 hover:bg-white/20 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalQty > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#fdc700] px-1 text-[10px] font-bold text-black">
                    {totalQty}
                  </span>
                )}
              </Button>
            </CartSheet>

            {/* User */}
            <Link href="/auth/login">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-700 hover:text-slate-900 hover:bg-white/20 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile search expandable panel */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-white/20 px-4 py-2.5 bg-[#5e9028]">
            <form onSubmit={handleSearch} className="relative">
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <Search className="h-4 w-4" />
              </button>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="h-9 w-full pl-9 pr-4 bg-white border-slate-300 text-sm rounded-lg focus:border-emerald-600 outline-none"
              />
            </form>
          </div>
        )}
      </header>
    </div>
  )
}