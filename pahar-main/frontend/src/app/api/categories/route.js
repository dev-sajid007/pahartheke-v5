import { NextResponse } from "next/server";

const POS_API = process.env.EXTERNAL_CATEGORIES_API || "https://posapi.pahartheke.com/api/ecommerce/categories";

export async function GET() {
  try {
    const res = await fetch(POS_API, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch categories." },
        { status: res.status }
      );
    }

    const categories = Array.isArray(json?.data) ? json.data : [];

    return NextResponse.json(
      { success: true, data: categories },
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
