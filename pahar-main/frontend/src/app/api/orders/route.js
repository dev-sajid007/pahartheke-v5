import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function POST(request) {
  try {
    const payload = await request.json();

    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { success: false, message: "BACKEND_API_URL is not configured." },
        { status: 500 }
      );
    }

    const response = await fetch(`${BACKEND_API_URL}/api/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
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
        data: result?.data || result,
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
