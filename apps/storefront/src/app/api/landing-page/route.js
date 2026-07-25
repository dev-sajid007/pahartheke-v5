import { NextResponse } from "next/server";
import { landingApi } from "@/lib/endpoints";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get("pageName") || "home";

    const res = await fetch(landingApi.page(pageName), {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json({ success: true, data: [] });
    }

    const json = await res.json();
    return NextResponse.json({ success: true, data: json?.data || [] });
  } catch (error) {
    console.error("Landing page error (degraded):", error?.message);
    return NextResponse.json({ success: true, data: [] });
  }
}
