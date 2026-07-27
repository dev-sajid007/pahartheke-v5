"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { clearCart } from "@/features/cart/cartSlice"
import { submitOrder } from "@/services/orders"
import { mapCartStateToOrderPayload } from "@/services/orderMapper"
import Header from "@/components/common/header"
import OrderReviewPanel from "@/components/checkout/OrderReviewPanel"
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm"
import DeliveryOptions from "@/components/checkout/DeliveryOptions"
import PaymentMethod from "@/components/checkout/PaymentMethod"
import CouponAccordion from "@/components/checkout/CouponAccordion"
import OrderSummary from "@/components/checkout/OrderSummary"
import Alert from "@/components/ui/alert"

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const cartState = useSelector((state) => state.cart)
  const items = cartState?.items || []
  const authUser = useSelector((state) => state.user?.user || null)

  const [formData, setFormData] = useState({
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
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [lastPayload, setLastPayload] = useState(null)

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.price || item.sale_price || item.unit_price || 0)
      const quantity = Number(item.quantity || 1)
      return sum + price * quantity
    }, 0)
  }, [items])

  const shipping = useMemo(() => {
    if (!items.length) return 0
    return formData.city === "Dhaka" ? 65 : 150
  }, [items.length, formData.city])

  const discountPercent = Number(formData.coupon_discount || 0)

  const discountAmount = useMemo(() => {
    return Math.round(subtotal * (discountPercent / 100))
  }, [subtotal, discountPercent])

  const total = useMemo(() => {
    return Math.max(subtotal + shipping - discountAmount, 0)
  }, [subtotal, shipping, discountAmount])

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

  function handleSelectCity(city) {
    setFormData((prev) => ({
      ...prev,
      city,
    }))
  }

  function handleApplyCoupon(code, discountPercent) {
    setFormData((prev) => ({
      ...prev,
      coupon_code: code,
      coupon_discount: discountPercent,
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
          subtotal,
          deliveryCharge: shipping,
        })

      setLastPayload(payload)

      const response = await submitOrder(payload)

      if (response?.success) {
        dispatch(clearCart())
        if (response.data) {
          try {
            sessionStorage.setItem("lastOrder", JSON.stringify(response.data))
          } catch { /* ignore */ }
        }
        router.push("/order/success")
      } else {
        setErrorMessage(response?.message || "Failed to place order.")
      }
    } catch (error) {
      setErrorMessage(error?.message || "Failed to place order.")
    } finally {
      setLoading(false)
    }
  }

  async function handlePlaceOrder() {
    await placeOrder()
  }

  if (!items.length && !successMessage) {
    return (
      <>
        <Header />
        <main className="bg-[#f8f9fa] py-10 dark:bg-background">
          <div className="container mx-auto px-4">
            <div className="rounded-xl border border-[#E0E0E0] bg-white p-12 text-center">
              <h2 className="text-xl font-semibold text-[#1A1A1A]">
                Your cart is empty
              </h2>
              <p className="mt-2 text-sm text-[#888]">
                Add some products before placing an order.
              </p>
              <Link href="/shop">
                <button className="mt-5 rounded-lg bg-[#22c55e] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
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
      <main className="bg-[#f8f9fa] py-6 dark:bg-background">
        <div className="container mx-auto px-4">
          {/* Title */}
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Checkout</h1>

          {/* Breadcrumb */}
          <p className="mt-1 text-xs text-[#888]">
            Home{" "}
            <span className="mx-1 text-[#ccc]">›</span>{" "}
            <span className="text-[#22c55e]">Checkout</span>
          </p>

          {/* Login Banner */}
          <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-lg bg-[#22c55e] px-5 py-3 sm:flex-row sm:items-center">
            <p className="text-sm font-medium text-white">
              Have any account? please login or register
            </p>
            <div className="flex gap-2">
              <Link href="/auth/login">
                <button className="rounded-lg border border-white px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/10">
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="rounded-lg bg-white px-4 py-1.5 text-xs font-semibold text-[#22c55e] hover:bg-white/90">
                  Register
                </button>
              </Link>
            </div>
          </div>

          {successMessage ? (
            <Alert
              variant="success"
              message={successMessage}
              onDismiss={() => setSuccessMessage("")}
              className="mt-6"
            />
          ) : null}

          {/* Main Content */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            {/* Left Column */}
            <div className="space-y-5">
              <OrderReviewPanel />
              <ShippingAddressForm
                formData={formData}
                handleChange={handleChange}
              />
              <DeliveryOptions
                selectedCity={formData.city}
                onSelect={handleSelectCity}
              />

              {errorMessage ? (
                <Alert
                  variant="destructive"
                  message={errorMessage}
                  onRetry={() => placeOrder(lastPayload)}
                  retryLabel="Retry"
                  loading={loading}
                  onDismiss={() => setErrorMessage("")}
                />
              ) : null}
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <PaymentMethod
                selected={formData.payment_type}
                onSelect={handleSelectPayment}
              />
              <CouponAccordion onApply={handleApplyCoupon} />
              <OrderSummary
                subtotal={subtotal}
                shipping={shipping}
                discount={discountAmount}
                total={total}
                onPlaceOrder={handlePlaceOrder}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
