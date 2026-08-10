"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { clearCart } from "@/features/cart/cartSlice"
import { submitOrder } from "@/lib/api/orders"
import { mapCartStateToOrderPayload } from "@/lib/api/mappers/order"
import { getDeliveryOptions } from "@/lib/api/landing-page"
import Header from "@/components/common/header"
import OrderReviewPanel from "@/components/checkout/OrderReviewPanel"
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm"
import DeliveryOptions from "@/components/checkout/DeliveryOptions"
import PaymentMethod from "@/components/checkout/PaymentMethod"
import CouponAccordion from "@/components/checkout/CouponAccordion"
import OrderSummary from "@/components/checkout/OrderSummary"

const INITIAL_FORM_STATE = {
  phone: "",
  full_name: "",
  city: "Dhaka",
  address: "",
  email: "",
  area: "",
  zip_code: "",
  country: "Bangladesh",
  order_note: "",
  payment_type: "cash_on_delivery",
  payment_status: "unpaid",
  coupon_code: "",
  coupon_discount: 0,
}

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const cartState = useSelector((state) => state.cart)
  const items = cartState?.items || []
  const authUser = useSelector((state) => state.auth?.user || null)

  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [loading, setLoading] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false) // prevents empty-cart flash during order
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [lastPayload, setLastPayload] = useState(null)

  // Dynamic delivery zones
  const [deliveryOptions, setDeliveryOptions] = useState([])
  const [deliveryLoading, setDeliveryLoading] = useState(true)

  // Fetch delivery zones from CMS
  useEffect(() => {
    getDeliveryOptions()
      .then((opts) => {
        setDeliveryOptions(opts)
        // Auto-select first zone
        if (opts.length > 0) {
          setFormData((prev) => ({
            ...prev,
            city: opts[0].value,
            area: opts[0].value,
            shippingCost: opts[0].cost,
          }))
        }
      })
      .finally(() => setDeliveryLoading(false))
  }, [])

  // Auto-fill user information if authenticated
  useEffect(() => {
    if (authUser) {
      setFormData((prev) => ({
        ...prev,
        full_name: authUser.name || authUser.full_name || prev.full_name,
        email: authUser.email || prev.email,
        phone: authUser.phone || prev.phone,
      }))
    }
  }, [authUser])

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.price || item.sale_price || item.unit_price || 0)
      const quantity = Number(item.quantity || 1)
      return sum + price * quantity
    }, 0)
  }, [items])

  const shipping = useMemo(() => {
    if (!items.length) return 0
    // Look up the cost of the selected zone from dynamic options
    const selectedZone = deliveryOptions.find((opt) => opt.value === formData.city)
    return selectedZone ? selectedZone.cost : (formData.shippingCost || 0)
  }, [items.length, formData.city, formData.shippingCost, deliveryOptions])

  const discount = Number(formData.coupon_discount || 0)

  const total = useMemo(() => {
    return Math.max(subtotal + shipping - discount, 0)
  }, [subtotal, shipping, discount])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function handleSelectPayment(paymentType) {
    setFormData((prev) => ({
      ...prev,
      payment_type: paymentType,
      payment_status: paymentType === "online" ? "pending" : "unpaid",
    }))
  }

  function handleSelectCity(city, cost) {
    setFormData((prev) => ({
      ...prev,
      city,
      area: city,
      shippingCost: cost ?? prev.shippingCost,
    }))
  }

  function handleApplyCoupon(code, discountAmount = 0) {
    setFormData((prev) => ({
      ...prev,
      coupon_code: code,
      coupon_discount: discountAmount,
    }))
  }

  function validateForm() {
    if (!items.length) return "Your cart is empty."
    if (!formData.phone.trim()) return "Phone number is required."
    if (!formData.full_name.trim()) return "Name is required."
    if (!formData.city.trim()) return "Please select a shipping city."
    if (!formData.address.trim()) return "Address is required."
    return ""
  }

  async function placeOrder(payloadOverride = null) {
    setErrorMessage("")
    setSuccessMessage("")

    const validationError = validateForm()
    if (validationError && !payloadOverride) {
      setErrorMessage(validationError)
      return
    }

    setLoading(true)
    setIsOrdering(true) // lock: prevent empty-cart page from showing

    try {
      const payload =
        payloadOverride ||
        mapCartStateToOrderPayload({
          cartState,
          shippingForm: {
            ...formData,
            coupon_code: formData.coupon_code,
            coupon_discount: formData.coupon_discount,
          },
          userId: authUser?.id || null,
        })

      setLastPayload(payload)

      const response = await submitOrder(payload)

      if (response?.success) {
        const orderData = response?.data || {}
        // Save full order for thank-you page
        try { sessionStorage.setItem("lastOrder", JSON.stringify(orderData)) } catch (_) { }

        dispatch(clearCart())
        setFormData(INITIAL_FORM_STATE)

        // Build URL order_id from orderNumber e.g. ORD-20260802-0001 => 202608020001
        const rawNum = orderData.orderNumber || ""
        const urlId = rawNum ? rawNum.replace("ORD-", "").replace(/-/g, "") : rawNum
        router.push(`/checkout/thank-you?order_id=${encodeURIComponent(urlId || rawNum)}`)
      } else {
        setErrorMessage(response?.message || "Failed to place order. Please try again.")
      }
    } catch (error) {
      setErrorMessage(error?.message || "Something went wrong while placing your order.")
    } finally {
      setLoading(false)
    }
  }

  // Full-page loading overlay while order is being processed / redirecting
  if (isOrdering) {
    return (
      <>
        <Header />
        <main className="flex min-h-[80vh] items-center justify-center" style={{ backgroundColor: "#f3f4f6" }}>
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200"
              style={{ borderTopColor: "#76B432" }}
            />
            <p className="text-sm font-semibold text-slate-600">Placing your order...</p>
          </div>
        </main>
      </>
    )
  }

  // Empty cart fallback state
  if (!items.length) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] py-12" style={{ backgroundColor: "#f3f4f6" }}>
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-md">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl text-white" style={{ backgroundColor: "#76B432" }}>
                🛒
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Add some products before proceeding to checkout.
              </p>
              <Link href="/" className="mt-6 inline-block">
                <button className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90" style={{ backgroundColor: "#76B432" }}>
                  Return to shop
                </button>
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="py-6" style={{ backgroundColor: "#f3f4f6" }}>
        <div className="container mx-auto px-4">
          {/* Header & Breadcrumb */}
          <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
          <p className="mt-1 text-xs text-slate-500">
            Home <span className="mx-1 text-slate-400">›</span>{" "}
            <span className="font-semibold" style={{ color: "#76B432" }}>Checkout</span>
          </p>

          {/* Login Banner for Guest Users */}
          {!authUser && (
            <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl border border-[#5a8a25] px-5 py-3.5 text-white shadow-md sm:flex-row sm:items-center" style={{ backgroundColor: "#76B432" }}>
              <p className="text-sm font-medium text-white">
                Have an account? Please log in or register for a faster checkout experience.
              </p>
              <div className="flex gap-2">
                <Link href="/auth/login">
                  <button className="rounded-lg border border-white/50 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10">
                    Login
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-semibold shadow-sm transition hover:bg-slate-100" style={{ color: "#76B432" }}>
                    Register
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mt-6 rounded-xl border px-5 py-4 text-sm font-medium text-white shadow-sm" style={{ backgroundColor: "#76B432", borderColor: "#5a8a25" }}>
              {successMessage}
            </div>
          )}

          {/* Main Checkout Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Left Section: Details & Forms */}
            <div className="space-y-5">
              <OrderReviewPanel />
              <ShippingAddressForm
                formData={formData}
                handleChange={handleChange}
              />
              <DeliveryOptions
                selectedCity={formData.city}
                onSelect={handleSelectCity}
                options={deliveryOptions}
                loading={deliveryLoading}
              />

              {/* Error Message with Retry */}
              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-medium">{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => placeOrder(lastPayload)}
                    disabled={loading}
                    className="mt-3 rounded-lg border border-red-300 bg-white px-4 py-1.5 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
                  >
                    {loading ? "Retrying..." : "Retry Order"}
                  </button>
                </div>
              )}
            </div>

            {/* Right Section: Payment, Coupon & Summary */}
            <div className="space-y-5">
              <PaymentMethod
                selected={formData.payment_type}
                onSelect={handleSelectPayment}
              />
              <CouponAccordion onApply={handleApplyCoupon} />
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discount}
                total={total}
                onPlaceOrder={() => placeOrder()}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}