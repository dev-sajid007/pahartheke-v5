import { NextResponse } from "next/server";

const POS_API = process.env.EXTERNAL_CATEGORIES_API ;
const API_KEY = process.env.ECOMMERCE_API_KEY ;

export async function GET() {
  try {
    const res = await fetch(POS_API, {
      headers: {
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn("External categories API returned non-OK status:", res.status);
      return NextResponse.json(
        { success: true, data: [] },
        { status: 200 }
      );
    }

    const json = await res.json();
    const categories = Array.isArray(json?.data) ? json.data : [];

    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error) {
    console.error("Categories API Error:", error.message || error);
    return NextResponse.json(
      { success: true, data: [] },
      { status: 200 }
    );
  }
}
