import { posApi, posHeaders } from "@/lib/endpoints";

export async function GET() {
  try {
    const res = await fetch(posApi.products(), {
      headers: posHeaders(),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return Response.json(
        { success: false, error: `Products API returned ${res.status}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    const products = Array.isArray(json?.data) ? json.data : [];

    return Response.json({ success: true, data: products });
  } catch (err) {
    console.error("Products API Error:", err);
    return Response.json(
      { success: false, error: err.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
