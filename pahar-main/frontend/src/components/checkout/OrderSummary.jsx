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
    <div className="rounded-xl border border-[#E0E0E0] bg-white p-5">
      <h2 className="mb-4 text-base font-bold text-[#1A1A1A]">Summary</h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-[#555]">
          <span>Sub total</span>
          <span className="font-medium text-[#1A1A1A]">{subtotal} BDT</span>
        </div>

        <div className="flex justify-between text-[#555]">
          <span>Delivery cost</span>
          <span className="font-medium text-[#1A1A1A]">{shipping} BDT</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon discount</span>
            <span className="font-medium">-{discount} BDT</span>
          </div>
        )}

        <div className="border-t border-[#E0E0E0]" />

        <div className="flex justify-between text-base">
          <span className="font-bold text-[#1A1A1A]">Total</span>
          <span className="text-lg font-bold text-[#1A1A1A]">{total} BDT</span>
        </div>
      </div>

      <label className="mt-5 flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 appearance-none rounded border-2 border-[#E07B2E] bg-white checked:bg-[#E07B2E] checked:border-[#E07B2E] transition-colors"
        />
        <span className="text-xs leading-relaxed text-[#555]">
          I have read and agree to the{" "}
          <a href="/terms" className="text-[#E07B2E] underline">Terms and Conditions</a>
          ,{" "}
          <a href="/privacy-policy" className="text-[#E07B2E] underline">Privacy Policy</a>
          {" & "}
          <a href="/refund-policy" className="text-[#E07B2E] underline">Refund and Return Policy</a>.
        </span>
      </label>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={!agreed || loading}
        className={`mt-4 w-full rounded-lg py-3 text-sm font-bold uppercase tracking-wide text-white transition ${
          agreed && !loading
            ? "bg-[#E07B2E] hover:opacity-90"
            : "cursor-not-allowed bg-gray-300"
        }`}
      >
        {loading ? "Processing..." : `Place Order ${total}`}
      </button>
    </div>
  )
}
