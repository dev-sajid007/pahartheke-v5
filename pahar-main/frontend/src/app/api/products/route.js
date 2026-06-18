let cache = null;
const CACHE_TTL = 5 * 60 * 1000;

const POS_API = process.env.EXTERNAL_PRODUCT_API || "https://posapi.pahartheke.com/api/ecommerce/products";

export async function GET() {
  try {
    const now = Date.now();

    if (cache && now - cache.timestamp < CACHE_TTL) {
      return new Response(JSON.stringify(cache.data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch(POS_API, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ data: [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = await res.json();
    const products = Array.isArray(json?.data) ? json.data : [];

    const response = { data: products };

    cache = { data: response, timestamp: now };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Products API Error:", err.message || err);
    return new Response(JSON.stringify({ data: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
