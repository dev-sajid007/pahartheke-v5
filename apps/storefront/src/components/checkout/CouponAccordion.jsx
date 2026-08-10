"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function CouponAccordion({ onApply }) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")

  function handleApply() {
    if (onApply) onApply(code.trim())
    setCode("")
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-3.5 text-left"
      >
        <span className="text-sm font-medium text-slate-700">
          Have any coupon or gift voucher?
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-24" : "max-h-0"
          }`}
      >
        <div className="flex gap-2 border-t border-slate-200 px-5 py-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#76B432] focus:ring-1 focus:ring-[#76B432]/40"
          />
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "#76B432" }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}