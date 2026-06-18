export async function getCategories() {
  const res = await fetch("/api/categories", {
    cache: "no-store",
  });

  const result = await res.json();

  return Array.isArray(result?.data) ? result.data : [];
}