"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "@/components/common/header"

function CheckIcon() {
    return (
        <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}

function formatPaymentMethod(method) {
    const map = {
        cash: "Cash on Delivery",
        bkash: "bKash",
        nagad: "Nagad",
        card: "Card",
        bank_transfer: "Bank Transfer",
    }
    return map[method] || method || "Cash on Delivery"
}

function formatDate(dateStr) {
    if (!dateStr) return ""
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

function ThankYouContent() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("order_id")

    const [order, setOrder] = useState(null)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        if (!orderId) {
            setNotFound(true)
            return
        }

        try {
            const stored = sessionStorage.getItem("lastOrder")
            if (stored) {
                const parsed = JSON.parse(stored)
                if (
                    parsed.orderNumber === orderId ||
                    parsed._id === orderId ||
                    String(parsed.orderNumber).replace("ORD-", "").replace(/-/g, "") === orderId
                ) {
                    setOrder(parsed)
                    return
                }
            }
        } catch (_) { }

        setOrder({ orderNumber: orderId, _notFull: true })
    }, [orderId])

    if (!orderId || notFound) {
        return (
            <>
                <Header />
                <main className="min-h-[70vh] py-16" style={{ backgroundColor: "#f3f4f6" }}>
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-2xl font-bold text-slate-800">Order not found</h1>
                        <Link href="/">
                            <button
                                className="mt-6 rounded-xl px-8 py-3 text-sm font-bold text-white transition hover:opacity-90"
                                style={{ backgroundColor: "#76B432" }}
                            >
                                Continue Shopping
                            </button>
                        </Link>
                    </div>
                </main>
            </>
        )
    }

    if (!order) {
        return (
            <>
                <Header />
                <main className="min-h-[70vh] py-16" style={{ backgroundColor: "#f3f4f6" }}>
                    <div className="container mx-auto px-4 flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200" style={{ borderTopColor: "#76B432" }} />
                    </div>
                </main>
            </>
        )
    }

    const displayOrderNumber = order.orderNumber
        ? (order.orderNumber.startsWith("ORD-") ? `#${order.orderNumber.replace("ORD-", "").replace(/-/g, "")}` : `#${order.orderNumber}`)
        : `#${orderId}`

    const items = order.items || []
    const subtotal = order.subtotal || 0
    const shipping = order.shipping || 0
    const discount = order.discount || 0
    const grandTotal = order.grandTotal || 0
    const customerName = order.customerName || ""
    const customerPhone = order.customerPhone || ""
    const city = order.customerAddress?.city || order.customerAddress?.state || ""

    return (
        <>
            <Header />
            <main className="py-10 min-h-[80vh]" style={{ backgroundColor: "#f3f4f6" }}>
                <div className="container mx-auto max-w-5xl px-4">

                    {/* Top Hero Card */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                        <div
                            className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
                            style={{ backgroundColor: "#76B432" }}
                        >
                            <CheckIcon />
                        </div>

                        <h1 className="text-2xl font-extrabold text-slate-800 md:text-3xl">
                            Thank You — Order Confirmed!
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            We&apos;ve received your order. Our team will contact you shortly.
                        </p>

                        <Link href="/">
                            <button
                                className="mt-6 rounded-xl border border-slate-300 px-8 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#76B432] hover:text-[#76B432]"
                            >
                                Continue Shopping
                            </button>
                        </Link>
                    </div>

                    {/* Details Grid */}
                    <div className="grid gap-6 md:grid-cols-2">

                        {/* Order Summary Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-base font-bold text-slate-800">Order Summary</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="text-slate-500">Order number</span>
                                    <span className="font-semibold text-slate-800">{displayOrderNumber}</span>
                                </div>

                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-semibold text-slate-800">
                                        {formatDate(order.createdAt) || formatDate(new Date().toISOString())}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <span className="text-slate-500">Payment method</span>
                                    <span className="font-semibold text-slate-800">
                                        {formatPaymentMethod(order.paymentMethod)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-base font-bold" style={{ color: "#76B432" }}>Total</span>
                                    <span className="text-lg font-extrabold" style={{ color: "#76B432" }}>
                                        {grandTotal.toLocaleString()} ৳
                                    </span>
                                </div>
                            </div>

                            {/* Delivery To */}
                            {(customerName || customerPhone || city) && (
                                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                        Delivery To
                                    </p>
                                    {customerName && <p className="text-sm font-bold text-slate-800">{customerName}</p>}
                                    {customerPhone && <p className="text-sm text-slate-600">{customerPhone}</p>}
                                    {city && <p className="mt-0.5 text-sm font-medium" style={{ color: "#76B432" }}>{city}</p>}
                                </div>
                            )}
                        </div>

                        {/* Order Details Card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-5 text-base font-bold text-slate-800">Order Details</h2>

                            {items.length > 0 ? (
                                <div className="space-y-3">
                                    {items.map((item, i) => (
                                        <div key={i} className="flex items-start justify-between border-b border-slate-100 pb-3">
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{item.productName}</p>
                                                <p className="text-xs text-slate-400">Qty {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">
                                                {(item.total || item.price * item.quantity || 0).toLocaleString()} ৳
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400">No item details available.</p>
                            )}

                            {/* Totals */}
                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span>{subtotal.toLocaleString()} ৳</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between" style={{ color: "#76B432" }}>
                                        <span>Discount</span>
                                        <span>-{discount.toLocaleString()} ৳</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-500">
                                    <span>Shipping</span>
                                    <span>{shipping.toLocaleString()} ৳</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-3">
                                    <span className="font-bold text-slate-800">Total</span>
                                    <span className="font-extrabold text-slate-800 text-base">
                                        {grandTotal.toLocaleString()} ৳
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    )
}

export default function ThankYouPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#76B432]" />
                </div>
            }
        >
            <ThankYouContent />
        </Suspense>
    )
}
