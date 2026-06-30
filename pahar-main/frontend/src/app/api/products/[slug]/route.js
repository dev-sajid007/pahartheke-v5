import { NextResponse } from "next/server";
import { posApi, posHeaders } from "@/lib/endpoints";

export async function GET(_, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Product slug is required." },
        { status: 400 }
      );
    }

    const res = await fetch(posApi.product(slug), {
      headers: posHeaders(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Product not found." },
        { status: res.status }
      );
    }

    const json = await res.json();

    return NextResponse.json(
      { success: true, data: json?.data || json || null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product detail error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
