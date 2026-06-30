import { NextResponse } from "next/server";
import { posApi, posHeaders } from "@/lib/endpoints";

export async function GET(_, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Category slug is required." },
        { status: 400 }
      );
    }

    const res = await fetch(posApi.productsByCategory(slug), {
      headers: posHeaders(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, data: [], error: "Failed to fetch products" },
        { status: res.status }
      );
    }

    const json = await res.json();
    const products = json.data || json.products || [];

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Products by category error:", error);
    return NextResponse.json(
      { success: false, data: [], error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
