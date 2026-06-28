function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

export function mapCartItemsToOrderItems(cartItems = []) {
  if (!Array.isArray(cartItems)) return [];

  return cartItems
    .filter((item) => item && (item.id || item.productId))
    .map((item) => ({
      product: item.productId || item.id,
      quantity: toNumber(item.quantity || 1, 1),
      salePrice: toNumber(item.price || item.sale_price || item.salePrice || 0),
      variantId: item.variantId || undefined,
      variantName: item.variantName || undefined,
    }));
}

export function mapCartStateToOrderPayload({
  cartState,
  shippingForm,
  userId = null,
}) {
  const customerInfo = {
    full_name: shippingForm?.full_name || "",
    phone: shippingForm?.phone || "",
    email: shippingForm?.email || "",
    address: shippingForm?.address || "",
    city: shippingForm?.city || "",
    area: shippingForm?.area || shippingForm?.city || "",
    zip_code: shippingForm?.zip_code || "",
    country: shippingForm?.country || "Bangladesh",
  };

  return {
    items: mapCartItemsToOrderItems(cartState?.items || []),
    customerInfo,
    note: shippingForm?.order_note || "",
    payment_type: shippingForm?.payment_type || "cash_on_delivery",
    payment_status: shippingForm?.payment_status || "unpaid",
    coupon_code: shippingForm?.coupon_code || "",
    coupon_discount: toNumber(shippingForm?.coupon_discount || 0),
    user_id: userId ? toNumber(userId) : null,
  };
}
