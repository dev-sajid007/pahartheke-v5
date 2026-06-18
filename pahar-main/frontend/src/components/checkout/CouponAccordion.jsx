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
    <div className="rounded-xl border border-[#E0E0E0] bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-3.5 text-left"
      >
        <span className="text-sm font-medium text-[#1A1A1A]">
          Have any coupon or gift voucher?
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#888] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-24" : "max-h-0"
        }`}
      >
        <div className="flex gap-2 border-t border-[#E0E0E0] px-5 py-3">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 rounded-lg border border-[#E0E0E0] bg-white px-3 py-2 text-sm text-[#1A1A1A] outline-none placeholder:text-[#aaa] focus:border-[#E07B2E]"
          />
          <button
            type="button"
            onClick={handleApply}
            className="rounded-lg bg-[#E07B2E] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
