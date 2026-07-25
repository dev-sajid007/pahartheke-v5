import { NextResponse } from "next/server";
import { posApi, posHeaders } from "@/lib/endpoints";

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!payload.items || !payload.items.length) {
      return NextResponse.json(
        { success: false, error: "No items in order." },
        { status: 400 }
      );
    }

    const response = await fetch(posApi.orders(), {
      method: "POST",
      headers: {
        ...posHeaders(),
        "Content-Type": "application/json",
      },
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
      console.error("POS API order error:", response.status, result);
      return NextResponse.json(
        {
          success: false,
          error:
            result?.message ||
            result?.error ||
            `Order request failed with status ${response.status}`,
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
        error: error?.message || "Something went wrong while placing order.",
      },
      { status: 500 }
    );
  }
}
