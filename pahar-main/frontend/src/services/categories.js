async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function getCategories() {
  const res = await fetch("/api/categories", { cache: "no-store" });
  const json = await handleResponse(res);
  return Array.isArray(json?.data) ? json.data : [];
}
