import { NextResponse } from "next/server";

const POS_API_BASE =
  process.env.POS_API_BASE_URL ||
  (process.env.EXTERNAL_PRODUCT_API
    ? process.env.EXTERNAL_PRODUCT_API.replace(/\/products$/, "")
    : "https://posapi.pahartheke.com/api/ecommerce");

export async function GET(_, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required." },
        { status: 400 }
      );
    }

    const res = await fetch(`${POS_API_BASE}/products/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json(
      { success: true, data: json?.data || json || null },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
