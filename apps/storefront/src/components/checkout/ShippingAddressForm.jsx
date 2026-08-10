"use client"

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="block h-5 w-1 rounded-full" style={{ backgroundColor: "#76B432" }} />
      <h2 className="text-base font-bold text-slate-800">{title}</h2>
    </div>
  )
}

export default function ShippingAddressForm({ formData, handleChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <SectionHeader title="Shipping Address" />

      <div className="space-y-4 px-5 pb-5">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Full Name <span style={{ color: "#76B432" }}>*</span>
          </label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#76B432] focus:ring-1 focus:ring-[#76B432]/40"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Mobile Number <span style={{ color: "#76B432" }}>*</span>
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#76B432] focus:ring-1 focus:ring-[#76B432]/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Email (optional)
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#76B432] focus:ring-1 focus:ring-[#76B432]/40"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Delivery Address <span style={{ color: "#76B432" }}>*</span>
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Thana, District, Area"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#76B432] focus:ring-1 focus:ring-[#76B432]/40"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Order Notes (optional)
          </label>
          <textarea
            name="order_note"
            value={formData.order_note}
            onChange={handleChange}
            placeholder="Any special instructions for your order..."
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 transition focus:border-[#76B432] focus:ring-1 focus:ring-[#76B432]/40"
          />
        </div>
      </div>
    </div>
  )
}