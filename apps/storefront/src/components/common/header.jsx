"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { useSelector } from "react-redux"
import { useState, useCallback, useSyncExternalStore } from "react"

import CartSheet from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  // { label: "Shop", href: "/shop" },
  { label: "Invest", href: "/invest" },
]

export default function Header() {
  const router = useRouter()
  const items = useSelector((state) => state.cart.items)
  const totalQty = items.reduce((total, item) => total + item.quantity, 0)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`)
      setMobileSearchOpen(false)
    }
  }, [searchQuery, router])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src="/images/logo.png"
            alt="Pahar Theke"
            className="h-8 md:h-10 w-auto"
            onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='40' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' fill='%232d6a4f' rx='4'/%3E%3Ctext x='12' y='26' font-family='sans-serif' font-size='14' font-weight='bold' fill='white'%3EPahar%3C/text%3E%3C/svg%3E" }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 ml-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 rounded-md hover:bg-green-50 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search — Desktop */}
        <form onSubmit={handleSearch} className="flex-1 max-w-lg hidden sm:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-9 bg-gray-50 border-gray-200 text-sm rounded-lg"
            />
          </div>
        </form>

        {/* Mobile Search Toggle */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          aria-label="Search"
        >
          <Search className="h-5 w-5 text-gray-700" />
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <CartSheet>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && totalQty > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#fdc700] px-1 text-[10px] font-bold text-black">
                  {totalQty}
                </span>
              )}
            </Button>
          </CartSheet>

          <Link href="/auth/login">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-9 bg-gray-50 border-gray-200 text-sm rounded-lg"
            />
          </form>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl p-5">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-3 text-sm font-medium text-gray-700 hover:text-green-700 rounded-md hover:bg-green-50 transition"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2" />
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-3 text-sm font-medium text-gray-700 hover:text-green-700 rounded-md hover:bg-green-50 transition"
              >
                Sign In / Register
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
