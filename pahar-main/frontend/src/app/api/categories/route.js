import { NextResponse } from "next/server";
import { posApi, posHeaders } from "@/lib/endpoints";

export async function GET() {
  try {
    const res = await fetch(posApi.categories(), {
      headers: posHeaders(),
      next: { revalidate: 300 },
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: json?.message || "Failed to fetch categories." },
        { status: res.status }
      );
    }

    const categories = Array.isArray(json?.data) ? json.data : [];

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("Categories error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
