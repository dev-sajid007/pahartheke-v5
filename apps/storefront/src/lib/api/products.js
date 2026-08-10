/**
 * Server-side product fetching utilities.
 *
 * These functions call the external POS API directly (server-to-server),
 * so there is no dependency on NEXT_PUBLIC_APP_URL or VERCEL_URL.
 * Internal Next.js API routes (/api/products) are still available for
 * client-side fetching but are NOT used here.
 */

const POS_API = process.env.EXTERNAL_PRODUCT_API;
const API_KEY = process.env.ECOMMERCE_API_KEY;

async function fetchFromPOS(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "x-api-key": API_KEY || "",
    },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    throw new Error(`POS API responded with status ${res.status}`);
  }

  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
}

export async function getProducts() {
  if (!POS_API) {
    console.warn("EXTERNAL_PRODUCT_API is not set.");
    return [];
  }

  try {
    return await fetchFromPOS(POS_API);
  } catch (error) {
    console.error("getProducts error:", error?.message || error);
    return [];
  }
}

export async function getProductsByCategorySlug(slug) {
  if (!slug) {
    return getProducts();
  }

  if (!POS_API) {
    console.warn("EXTERNAL_PRODUCT_API is not set.");
    return [];
  }

  try {
    const url = `${POS_API}?category=${encodeURIComponent(slug)}`;
    const products = await fetchFromPOS(url);

    // If no products found for this category, fall back to all products
    if (!products || products.length === 0) {
      return getProducts();
    }

    return products;
  } catch (error) {
    console.warn("getProductsByCategorySlug error, falling back to all products:", error?.message || error);
    return getProducts();
  }
}

export async function getProductBySlug(slug) {
  if (!slug) {
    throw new Error("Product slug is required.");
  }

  if (!POS_API) {
    throw new Error("EXTERNAL_PRODUCT_API is not set.");
  }

  const url = `${POS_API}?slug=${encodeURIComponent(slug)}`;
  const products = await fetchFromPOS(url);

  // Return the first matching product
  if (Array.isArray(products) && products.length > 0) {
    return products[0];
  }

  return null;
}