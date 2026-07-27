"use client"

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="block h-5 w-1 rounded-full bg-[#22c55e]" />
      <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
    </div>
  )
}

export default function DeliveryOptions({ selectedCity, onSelect }) {
  const options = [
    { value: "Dhaka", label: "Inside Dhaka", cost: 65 },
    { value: "Outside", label: "Out side dhaka", cost: 150 },
  ]

  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white">
      <SectionHeader title="Delivery" />

      <div className="space-y-2 px-5 pb-5">
        {options.map((opt) => {
          const isSelected = selectedCity === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-[#22c55e] bg-[#FEF5ED]"
                  : "border-[#E0E0E0] bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition ${
                    isSelected
                      ? "border-[#22c55e]"
                      : "border-[#ccc]"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                  )}
                </span>
                <span className="text-sm font-medium text-[#1A1A1A]">
                  {opt.label}
                </span>
              </div>
              <span className="text-sm font-semibold text-[#1A1A1A]">
                ৳{opt.cost}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
