import { NextResponse } from "next/server";

const POS_API_URL = process.env.POS_API_URL;
const ECOMMERCE_API_KEY = process.env.ECOMMERCE_API_KEY;

function toPosOrder(payload) {
  const address = payload.shipping_address || {};

  return {
    externalOrderId: payload.checkout_id,
    items: (payload.cart_items || []).map((item) => ({
      product: item.product_id,
      variantId: item.variant_id,
      variantName: item.variant_name,
      quantity: item.quantity,
      salePrice: item.price,
    })),
    customerInfo: {
      name: address.full_name,
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
    },
    note: address.order_note,
    payment_type: payload.payment_type,
    payment_status: payload.payment_status,
    discount: payload.coupon_discount,
    shippingCost: payload.shipping_cost,
  };
}

function toStorefrontOrder(sale, payload) {
  const address = payload.shipping_address || {};
  const cartItems = payload.cart_items || [];

  return {
    ...sale,
    orderNumber: sale.invoiceNo,
    shipping: sale.shippingCost,
    paymentMethod: sale.paymentType === "online" ? "bkash" : "cash",
    customerAddress: {
      street: sale.customerAddress || address.address || "",
      city: sale.customerCity || address.city || "",
      state: address.area || "",
      zipCode: address.zip_code || "",
      country: address.country || "Bangladesh",
    },
    items: (sale.items || []).map((item, index) => ({
      ...item,
      productName: cartItems[index]?.name || "Product",
      productImage: cartItems[index]?.image || "",
      price: item.salePrice,
      total: item.subtotal,
    })),
  };
}

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!POS_API_URL || !ECOMMERCE_API_KEY) {
      return NextResponse.json(
        { success: false, message: "POS checkout API is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(`${POS_API_URL.replace(/\/+$/, "")}/api/ecommerce/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-api-key": ECOMMERCE_API_KEY,
      },
      body: JSON.stringify(toPosOrder(payload)),
      cache: "no-store",
    });

    const rawText = await response.text();

    let result;
    try {
      result = rawText ? JSON.parse(rawText) : null;
    } catch {
      result = rawText;
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message:
            result?.message ||
            result?.error ||
            `Backend request failed with status ${response.status}`,
          error: result,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result?.message || "Order placed successfully.",
        data: toStorefrontOrder(result?.data || result, payload),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order Route Error:", error);

    const isTimeout =
      error?.cause?.code === "ETIMEDOUT" ||
      error?.code === "ETIMEDOUT" ||
      error?.message?.includes("fetch failed");

    return NextResponse.json(
      {
        success: false,
        message: isTimeout
          ? "Backend server did not respond in time. Please try again."
          : error?.message || "Something went wrong while placing order.",
      },
      { status: 500 }
    );
  }
}
