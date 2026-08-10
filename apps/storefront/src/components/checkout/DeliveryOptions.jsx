"use client"

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="block h-5 w-1 rounded-full" style={{ backgroundColor: "#76B432" }} />
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
    </div>
  )
}

export default function DeliveryOptions({ selectedCity, onSelect, options = [], loading = false }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <SectionHeader title="Delivery" />
        <div className="space-y-2 px-5 pb-5">
          {[1, 2].map((n) => (
            <div key={n} className="h-12 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <SectionHeader title="Delivery" />

      <div className="space-y-2 px-5 pb-5">
        {options.map((opt) => {
          const isSelected = selectedCity === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value, opt.cost)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left transition ${isSelected
                ? "border-[#76B432] bg-[#76B432]/8"
                : "border-slate-200 bg-slate-50 hover:border-[#76B432]/50"
                }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${isSelected
                    ? "border-[#76B432]"
                    : "border-slate-300"
                    }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "#76B432" }} />
                  )}
                </span>
                <span className="text-sm font-medium text-slate-700">
                  {opt.label}
                </span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "#76B432" }}>
                ৳{opt.cost}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}