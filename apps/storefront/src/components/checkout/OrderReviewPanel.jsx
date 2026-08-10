"use client"

import { Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import { removeFromCart, increaseQty, decreaseQty } from "@/features/cart/cartSlice"

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="block h-5 w-1 rounded-full" style={{ backgroundColor: "#76B432" }} />
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
    </div>
  )
}

export default function OrderReviewPanel() {
  const items = useSelector((state) => state.cart.items)
  const dispatch = useDispatch()

  if (!items.length) return null

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <SectionHeader title="Order review" />

      <div className="space-y-2 px-5 pb-5">
        {items.map((item) => {
          const price = Number(item.price || item.sale_price || item.unit_price || 0)
          return (
            <div key={item.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2.5 shadow-sm">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
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
                  <div>
                    <p className="truncate text-sm font-medium text-slate-800">
                      {item.name}
                    </p>
                    {item.variantName && (
                      <span className="inline-block mt-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        Variant: {item.variantName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-sm font-bold" style={{ color: "#76B432" }}>
                      ৳{price}
                    </span>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Qty:</span>
                  <div className="flex items-center rounded-md border border-slate-200 bg-white text-xs">
                    <button
                      onClick={() => dispatch(decreaseQty(item.id))}
                      className="flex h-6 w-6 items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="flex h-6 w-7 items-center justify-center border-x border-slate-200 text-xs font-semibold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(increaseQty(item.id))}
                      className="flex h-6 w-6 items-center justify-center text-slate-600 hover:bg-slate-100 transition"
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