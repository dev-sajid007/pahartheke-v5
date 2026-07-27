"use client"

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="block h-5 w-1 rounded-full bg-[#22c55e]" />
      <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
    </div>
  )
}

function TruckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

export default function PaymentMethod({ selected, onSelect }) {
  const isSelected = selected === "cash_on_delivery"

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white">
      <SectionHeader title="Payment method" />

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => onSelect("cash_on_delivery")}
          className={`relative flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-left transition ${
            isSelected
              ? "border-[#22c55e]"
              : "border-[#E0E0E0] hover:border-gray-300"
          }`}
        >
          <TruckIcon />
          <span className="text-sm font-medium text-[#1A1A1A]">
            Cash on Delivery
          </span>
          {isSelected && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#22c55e] text-white">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </button>

        <div className="mt-3 rounded-lg bg-[#FEF9F0] px-4 py-3">
          <p className="text-xs leading-relaxed text-[#888]">
            অনুগ্রহ করে আপনার অর্ডারটি নিশ্চিত করুন। ডেলিভারি চার্জ যোগ হবে এবং পণ্য হাতে পেয়ে পেমেন্ট করুন (ক্যাশ অন ডেলিভারি)। আপনার ঠিকানা সঠিকভাবে দিন।
          </p>
        </div>
      </div>
    </div>
  )
}
