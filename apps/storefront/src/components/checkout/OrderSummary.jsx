"use client"

import { useState } from "react"

export default function OrderSummary({
  subtotal,
  shipping,
  discount,
  total,
  onPlaceOrder,
  loading,
}) {
  const [agreed, setAgreed] = useState(true)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-800">Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-500">
          <span>Sub total</span>
          <span className="font-medium text-slate-800">{subtotal} BDT</span>
        </div>

        <div className="flex justify-between text-slate-500">
          <span>Delivery cost</span>
          <span className="font-medium text-slate-800">{shipping} BDT</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between" style={{ color: "#76B432" }}>
            <span>Coupon discount</span>
            <span className="font-medium">-{discount} BDT</span>
          </div>
        )}

        <div className="border-t border-slate-200" />

        <div className="flex justify-between text-base">
          <span className="font-bold text-slate-800">Total</span>
          <span className="text-lg font-bold" style={{ color: "#76B432" }}>{total} BDT</span>
        </div>
      </div>

      <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 appearance-none rounded border-2 bg-white transition-colors"
          style={{
            borderColor: agreed ? "#76B432" : "#cbd5e1",
            backgroundColor: agreed ? "#76B432" : "white",
          }}
        />
        <span className="text-xs leading-relaxed text-slate-500">
          I have read and agree to the{" "}
          <a href="#" className="font-medium underline" style={{ color: "#76B432" }}>Terms and Conditions</a>
          ,{" "}
          <a href="#" className="font-medium underline" style={{ color: "#76B432" }}>Privacy Policy</a>
          {" & "}
          <a href="#" className="font-medium underline" style={{ color: "#76B432" }}>Refund and Return Policy</a>.
        </span>
      </label>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={!agreed || loading}
        className="mt-4 w-full rounded-lg py-3 text-sm font-bold uppercase tracking-wide text-white transition"
        style={{
          backgroundColor: agreed && !loading ? "#76B432" : "#d1d5db",
          color: agreed && !loading ? "#fff" : "#9ca3af",
          cursor: agreed && !loading ? "pointer" : "not-allowed",
        }}
      >
        {loading ? "Processing..." : `Place Order ৳${total}`}
      </button>
    </div>
  )
}