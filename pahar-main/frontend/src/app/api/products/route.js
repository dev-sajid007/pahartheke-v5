const POS_API = process.env.EXTERNAL_PRODUCT_API || "https://posapi.pahartheke.com/api/ecommerce/products";

export async function GET() {
  try {
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

    return new Response(JSON.stringify({ data: products }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Products API Error:", err.message || err);
    return new Response(JSON.stringify({ data: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
