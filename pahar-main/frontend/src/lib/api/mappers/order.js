function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
}

function toNullable(value) {
  return value === undefined || value === null || value === "" ? null : value;
}

export function mapCartItemToOrderItem(item = {}) {
  return {
    product_id: toNumber(item.id),
    name: item.name || "",
    image: Array.isArray(item.image) ? item.image[0] : (item.image || ""),
    price: toNumber(item.price || item.sale_price || item.unit_price || 0),
    quantity: toNumber(item.quantity || 1, 1),
    tax: toNumber(item.tax || 0),
    discount: toNumber(item.discount || 0),
    variation: toNullable(
      item.variation ||
        item.variation_id ||
        item.variationId ||
        item.selectedVariation
    ),
    shipping_cost: toNumber(
      item.shipping_cost || item.shippingCost || item.delivery_charge || 0
    ),
  };
}

export function mapCartItemsToOrderItems(cartItems = []) {
  if (!Array.isArray(cartItems)) return [];

  return cartItems
    .filter((item) => item && item.id)
    .map(mapCartItemToOrderItem);
}

export function mapCartStateToOrderPayload({
  cartState,
  shippingForm,
  userId = null,
}) {
  return {
    user_id: userId ? toNumber(userId) : null,
    payment_type: shippingForm?.payment_type || "cash_on_delivery",
    payment_status: shippingForm?.payment_status || "unpaid",
    coupon_code: shippingForm?.coupon_code || "",
    coupon_discount: toNumber(shippingForm?.coupon_discount || 0),
    shipping_address: {
      full_name: shippingForm?.full_name || "",
      phone: shippingForm?.phone || "",
      email: shippingForm?.email || "",
      address: shippingForm?.address || "",
      city: shippingForm?.city || "",
      area: shippingForm?.area || shippingForm?.city || "",
      zip_code: shippingForm?.zip_code || "",
      country: shippingForm?.country || "Bangladesh",
      order_note: shippingForm?.order_note || "",
    },
    cart_items: mapCartItemsToOrderItems(cartState?.items || []),
  };
}