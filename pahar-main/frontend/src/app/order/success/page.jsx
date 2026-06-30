"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, Package, MapPin, CreditCard } from "lucide-react"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default function OrderSuccessPage() {
  const [order] = useState(() => {
    try {
      const data = sessionStorage.getItem("lastOrder")
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  })

  if (!order) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
          <Package className="h-12 w-12 text-gray-300" />
          <h2 className="text-xl font-bold text-gray-700">No order found</h2>
          <p className="text-sm text-gray-500">Your order details are not available.</p>
          <Link
            href="/shop"
            className="mt-2 rounded-lg bg-[#E07B2E] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Browse products
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  const items = order.items || []
  const subtotal = order.subtotal || 0
  const shipping = order.shippingCost || 0
  const discount = order.discount || 0
  const total = order.grandTotal || 0
  const invoiceNo = order.invoiceNo || "N/A"
  const orderDate = order.order_date
    ? new Date(order.order_date).toLocaleDateString("en-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A"

  return (
    <>
      <Header />
      <main className="bg-[#f5f5f5] py-8 dark:bg-background min-h-screen">
        <div className="mx-auto max-w-3xl px-4">
          {/* Success Banner */}
          <div className="rounded-xl border border-green-200 bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-[#1A1A1A]">
              Order Placed Successfully!
            </h1>
            <p className="mt-1 text-sm text-[#888]">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Info */}
          <div className="mt-5 rounded-xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#888]">Invoice</p>
                <p className="text-sm font-bold text-[#1A1A1A]">{invoiceNo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#888]">Date</p>
                <p className="text-sm font-medium text-[#1A1A1A]">{orderDate}</p>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          {(order.customerName || order.customerPhone) && (
            <div className="mt-4 rounded-xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#1A1A1A]">
                <MapPin className="h-4 w-4 text-[#E07B2E]" />
                Delivery Address
              </h2>
              <div className="mt-3 space-y-1 text-sm text-[#555]">
                {order.customerName && <p>{order.customerName}</p>}
                {order.customerPhone && <p>{order.customerPhone}</p>}
                {order.customerAddress && <p>{order.customerAddress}</p>}
                {order.customerCity && <p>{order.customerCity}</p>}
              </div>
            </div>
          )}

          {/* Items */}
          {items.length > 0 && (
            <div className="mt-4 rounded-xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#1A1A1A]">
                <Package className="h-4 w-4 text-[#E07B2E]" />
                Order Items
              </h2>
              <div className="mt-3 divide-y divide-[#E0E0E0]">
                {items.map((item, i) => {
                  const productName =
                    typeof item.product === "object"
                      ? item.product?.name
                      : item.productName || `Product #${i + 1}`
                  const itemTotal = (item.salePrice || 0) * (item.quantity || 0)
                  return (
                    <div key={i} className="flex items-center justify-between py-3 text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium text-[#1A1A1A]">{productName}</p>
                        {item.variantName && (
                          <p className="text-xs text-[#888]">{item.variantName}</p>
                        )}
                        <p className="text-xs text-[#888]">
                          ৳{item.salePrice || 0} x {item.quantity || 0}
                        </p>
                      </div>
                      <p className="ml-4 shrink-0 font-semibold text-[#1A1A1A]">
                        ৳{itemTotal}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Payment & Summary */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* Payment Method */}
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#1A1A1A]">
                <CreditCard className="h-4 w-4 text-[#E07B2E]" />
                Payment
              </h2>
              <p className="mt-2 text-sm font-medium capitalize text-[#555]">
                {order.paymentType?.replace(/_/g, " ") || "Cash on Delivery"}
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#1A1A1A]">Summary</h2>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-[#555]">
                  <span>Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">৳{subtotal}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between text-[#555]">
                    <span>Shipping</span>
                    <span className="font-medium text-[#1A1A1A]">৳{shipping}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-৳{discount}</span>
                  </div>
                )}
                <div className="border-t border-[#E0E0E0]" />
                <div className="flex justify-between text-base">
                  <span className="font-bold text-[#1A1A1A]">Total</span>
                  <span className="text-lg font-bold text-green-700">৳{total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="rounded-lg bg-[#E07B2E] px-6 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-[#E0E0E0] bg-white px-6 py-3 text-center text-sm font-semibold text-[#1A1A1A] hover:bg-gray-50"
            >
              Go to Home
            </Link>
          </div>

          {/* Note */}
          <p className="mt-6 text-center text-xs text-[#888]">
            A confirmation message has been sent to your provided contact. For any
            inquiries, please contact our support team.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
