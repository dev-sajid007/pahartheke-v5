export async function getCategories() {
  if (typeof window === "undefined") {
    // Server-side fetch from POS API directly
    const POS_API = process.env.EXTERNAL_CATEGORIES_API;
    const API_KEY = process.env.ECOMMERCE_API_KEY;
    if (!POS_API) {
      console.warn("EXTERNAL_CATEGORIES_API is not set on the server.");
      return [];
    }
    try {
      const res = await fetch(POS_API, {
        headers: {
          Accept: "application/json",
          "x-api-key": API_KEY || "",
        },
        cache: "no-store",
      });
      if (!res.ok) {
        throw new Error(`POS API responded with status ${res.status}`);
      }
      const json = await res.json();
      return Array.isArray(json?.data) ? json.data : [];
    } catch (error) {
      console.error("getCategories server error:", error?.message || error);
      return [];
    }
  }

  // Client-side relative fetch
  const res = await fetch("/api/categories", {
    cache: "no-store",
  });

  const result = await res.json();

  return Array.isArray(result?.data) ? result.data : [];
}