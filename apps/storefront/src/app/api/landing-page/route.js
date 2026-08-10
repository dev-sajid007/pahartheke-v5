import { NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get("pageName") || "home";

    if (!BACKEND_API_URL) {
      return NextResponse.json(
        { success: true, data: null, message: "BACKEND_API_URL not set; using local fallback." },
        { status: 200 }
      );
    }

    const res = await fetch(
      `${BACKEND_API_URL}/api/landing-page?pageName=${pageName}`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: true, data: null, message: "Backend response non-OK" },
        { status: 200 }
      );
    }

    const json = await res.json();

    return NextResponse.json({ success: true, data: json?.data || null });
  } catch (error) {
    console.warn("Landing page API fallback:", error.message);
    return NextResponse.json(
      { success: true, data: null, message: error?.message || "Fallback" },
      { status: 200 }
    );
  }
}
