import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get("pageName") || "home";

    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { success: false, message: "BACKEND_API_URL is not configured." },
        { status: 500 }
      );
    }

    const res = await fetch(
      `${BACKEND_API_URL}/api/landing-page?pageName=${pageName}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: json?.message || "Failed to fetch landing page." },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, data: json?.data || [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
