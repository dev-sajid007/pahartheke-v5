async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function getProducts() {
  const res = await fetch("/api/products", { cache: "no-store" });
  const json = await handleResponse(res);
  return json?.data || [];
}

export async function getProductsByCategorySlug(slug) {
  if (!slug) throw new Error("Category slug is required.");
  const res = await fetch(`/api/products/by-category/${slug}`, { cache: "no-store" });
  const json = await handleResponse(res);
  return json?.data || [];
}

export async function getProductBySlug(slug) {
  if (!slug) throw new Error("Product slug is required.");
  const res = await fetch(`/api/products/${slug}`, { cache: "no-store" });
  const json = await handleResponse(res);
  return json?.data || null;
}
