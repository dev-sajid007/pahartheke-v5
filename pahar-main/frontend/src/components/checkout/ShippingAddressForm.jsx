"use client"

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="block h-5 w-1 rounded-full bg-[#E07B2E]" />
      <h2 className="text-base font-bold text-[#1A1A1A]">{title}</h2>
    </div>
  )
}

export default function ShippingAddressForm({ formData, handleChange }) {
  return (
    <div className="rounded-xl border border-[#E0E0E0] bg-white">
      <SectionHeader title="Shipping Address" />

      <div className="space-y-4 px-5 pb-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-[#555]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none placeholder:text-[#aaa] focus:border-[#E07B2E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#555]">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none placeholder:text-[#aaa] focus:border-[#E07B2E]"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#555]">
              Email (optional)
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none placeholder:text-[#aaa] focus:border-[#E07B2E]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[#555]">
            Delivery Address <span className="text-red-500">*</span>
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Thana, District, Area"
            className="w-full rounded-lg border border-[#E0E0E0] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none placeholder:text-[#aaa] focus:border-[#E07B2E]"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[#555]">
            Order Notes (optional)
          </label>
          <textarea
            name="order_note"
            value={formData.order_note}
            onChange={handleChange}
            placeholder="Any special instructions for your order..."
            rows={3}
            className="w-full resize-none rounded-lg border border-[#E0E0E0] bg-white px-3.5 py-2.5 text-sm text-[#1A1A1A] outline-none placeholder:text-[#aaa] focus:border-[#E07B2E]"
          />
        </div>
      </div>
    </div>
  )
}
