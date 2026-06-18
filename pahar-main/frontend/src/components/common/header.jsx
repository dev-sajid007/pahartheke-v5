"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Menu } from "lucide-react"
import { useSelector } from "react-redux"

import CartSheet from "@/components/cart/cart-sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const items = useSelector((state) => state.cart.items)
  const totalQty = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Mobile Menu */}
        <button className="lg:hidden p-2 -ml-2 rounded-md hover:bg-gray-100">
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src="https://pahartheke.com/assets/img/logo.png"
            alt="Logo"
            className="h-8 md:h-10 w-auto"
          />
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="h-9 w-full pl-9 bg-gray-50 border-gray-200 text-sm rounded-lg"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <CartSheet>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalQty > 0 && (
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
    </header>
  )
}
