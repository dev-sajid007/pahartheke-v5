export function mapCartStateToOrderPayload({ cartState, shippingForm, userId, subtotal, deliveryCharge }) {
  const items = (cartState?.items || []).map((item) => ({
    product: item.productId || item.id,
    quantity: item.quantity || 1,
    salePrice: item.price || 0,
    variantId: item.variantId || undefined,
    variantName: item.variantName || undefined,
  }));

  const calculatedSubtotal = subtotal || items.reduce((s, i) => s + i.salePrice * i.quantity, 0);
  const calculatedDelivery = deliveryCharge || 0;
  const discountPercent = Number(shippingForm?.coupon_discount) || 0;
  const discountAmount = Math.round(calculatedSubtotal * (discountPercent / 100));

  return {
    customerInfo: {
      name: shippingForm?.full_name || "",
      phone: shippingForm?.phone || "",
      email: shippingForm?.email || "",
      address: shippingForm?.address || "",
      city: shippingForm?.city || "",
      area: shippingForm?.area || "",
      zipCode: shippingForm?.zip_code || "",
      country: shippingForm?.country || "Bangladesh",
    },
    items,
    note: shippingForm?.order_note || "",
    payment_type: shippingForm?.payment_type || "cash_on_delivery",
    discount: discountAmount,
    shippingCost: calculatedDelivery,
  };
}
