import { NextResponse } from "next/server";

const POS_ORDERS_URL = process.env.POS_API_BASE_URL
  ? `${process.env.POS_API_BASE_URL}/orders`
  : "https://posapi.pahartheke.com/api/ecommerce/orders";

const ECOMMERCE_API_KEY = process.env.ECOMMERCE_API_KEY;

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload.items || !payload.items.length) {
      return NextResponse.json(
        { success: false, message: "No items in order." },
        { status: 400 }
      );
    }

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (ECOMMERCE_API_KEY) {
      headers["x-api-key"] = ECOMMERCE_API_KEY;
    }

    const response = await fetch(POS_ORDERS_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
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
            `Order request failed with status ${response.status}`,
          error: result,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: result?.message || "Order placed successfully.",
        data: result?.data || result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order Route Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong while placing order.",
      },
      { status: 500 }
    );
  }
}
