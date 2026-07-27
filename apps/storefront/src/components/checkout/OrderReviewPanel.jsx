"use client"

import { Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import { removeFromCart, increaseQty, decreaseQty } from "@/features/cart/cartSlice"

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="block h-5 w-1 rounded-full bg-[#22c55e]" />
      <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
    </div>
  )
}

export default function OrderReviewPanel() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  if (!items.length) return null

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white">
      <SectionHeader title="Order review" />

      <div className="space-y-1 px-5 pb-5">
        {items.map((item) => {
          const price = Number(item.price || item.sale_price || item.unit_price || 0)
          return (
            <div key={item.id} className="flex items-start gap-3 rounded-lg p-2">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100">
                <Image
                  src={
                    Array.isArray(item.image)
                      ? item.image[0]
                      : item.image || "/images/fallback-product.png"
                  }
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium text-[#1A1A1A]">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-sm font-bold text-[#1A1A1A]">
                      ৳{price}
                    </span>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="rounded p-0.5 text-red-400 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#888]">Qty:</span>
                  <div className="flex items-center rounded-md border border-[#E0E0E0] text-xs">
                    <button
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="flex h-6 w-6 items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-gray-50"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="flex h-6 w-7 items-center justify-center border-x border-[#E0E0E0] text-xs font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="flex h-6 w-6 items-center justify-center text-[#888] hover:text-[#1A1A1A] hover:bg-gray-50"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
