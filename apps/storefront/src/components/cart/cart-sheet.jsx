"use client"

import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import {
  removeFromCart,
  increaseQty,
  decreaseQty,
  setCartOpen,
} from "@/features/cart/cartSlice"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Plus, ShoppingCart, Trash2, Zap } from "lucide-react"
import Image from "next/image"

export default function CartSheet({ children }) {
  const items = useSelector((state) => state.cart.items)
  const open = useSelector((state) => state.cart.isOpen)
  const dispatch = useDispatch()

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <Sheet open={open} onOpenChange={(val) => dispatch(setCartOpen(val))}>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">

        {/* ── Header ── */}
        <SheetHeader className="flex flex-row items-center justify-between border-b px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold">
            <ShoppingCart className="h-5 w-5 text-[#76B432]" />
            Your Cart
          </SheetTitle>
          {items.length > 0 && (
            <span className="rounded-full text-[#76B432] px-2.5 py-0.5 text-xs font-bold text-black">
              {items.length} item{items.length > 1 ? "s" : ""}
            </span>
          )}
        </SheetHeader>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col overflow-y-auto">

          {/* Empty State */}
          {items.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#76B432]/20">
                <ShoppingCart className="h-12 w-12 text-[#76B432]" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">
                  Add some products to get started!
                </p>
              </div>
              <SheetClose asChild>
                <Link href="/">
                  <Button className="mt-2 bg-[#76B432] text-white hover:bg-[#659b2a] cursor-pointer font-semibold">
                    Browse Products
                  </Button>
                </Link>
              </SheetClose>
            </div>
          )}

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-3 p-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-xl border bg-background p-3 transition hover:border-[#76B432]/50"
                >
                  {/* Thumbnail */}
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={Array.isArray(item.image) ? item.image[0] : (item.image || "/images/fallback-product.png")}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    {item.variantName && (
                      <span className="w-fit rounded bg-[#76B432]/15 px-2 py-0.5 text-[11px] font-bold text-[#76B432]">
                        Variant: {item.variantName}
                      </span>
                    )}
                    <p className="text-sm font-bold text-[#76B432]">৳{item.price}</p>

                    {/* Qty Stepper */}
                    <div className="flex w-fit items-center overflow-hidden rounded-lg border text-sm">
                      <button
                        onClick={() => dispatch(decreaseQty(item.id))}
                        className="px-2.5 py-1 font-bold transition hover:bg-muted"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(increaseQty(item.id))}
                        className="px-2.5 py-1 font-bold transition hover:bg-muted"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Line total + Remove */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <p className="text-xs text-muted-foreground">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="rounded-md p-1 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer (only when cart has items) ── */}
        {items.length > 0 && (
          <div className="space-y-4 border-t bg-background px-5 py-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">Subtotal</span>
              <span className="text-xl font-bold text-[#76B432]">
                ৳{subtotal.toFixed(2)}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              {/* Add More */}
              <SheetClose asChild>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="w-full border-[#76B432]/40 bg-[#76B432]/10 text-[#76B432] hover:bg-[#76B432]/20 hover:text-[#76B432] font-semibold"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add More Items
                  </Button>
                </Link>
              </SheetClose>

              {/* Complete Order */}
              <SheetClose asChild>
                <Link href="/checkout">
                  <Button className="w-full bg-[#76B432] text-white hover:bg-[#659b2a] font-semibold">
                    <Zap className="mr-2 h-4 w-4" />
                    Complete Order
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </div>
        )}

      </SheetContent>
    </Sheet>
  )
}