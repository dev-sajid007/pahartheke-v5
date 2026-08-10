const slugify = (text) => {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function transformProduct(apiProduct) {
  const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Cpath d='M80 100l15-20 15 20 15-25 15 25v30H80V100z' fill='%23d1d5db'/%3E%3C/svg%3E";

  let image = placeholder;
  if (apiProduct.image) {
    const img = String(apiProduct.image);
    image = img.startsWith("http") || img.startsWith("data:") ? img : `/images/${img}`;
  }

  const rawPrice = apiProduct.salePrice ?? apiProduct.price ?? apiProduct.sale_price ?? 0;
  const price = Number(rawPrice) || 0;

  const rawPurchase = apiProduct.purchasePrice ?? apiProduct.purchase_price ?? 0;
  const purchasePrice = Number(rawPurchase) || 0;

  const rawStock = apiProduct.currentStock ?? apiProduct.stockQuantity ?? apiProduct.stock ?? 0;
  const stock = Number(rawStock) || 0;

  const validApiSlug =
    apiProduct.slug && apiProduct.slug !== "--" && apiProduct.slug !== "-"
      ? apiProduct.slug
      : null;
  const nameSlug = slugify(apiProduct.name);
  const productId = apiProduct._id || apiProduct.id || "";
  const slug = validApiSlug || nameSlug || productId;

  return {
    id: apiProduct._id || apiProduct.id,
    name: apiProduct.name || "",
    slug,
    description: apiProduct.description || apiProduct.details || "",
    image,
    images: [image],
    price,
    oldPrice: purchasePrice > price ? purchasePrice : null,
    stock,
    rating: 0,
    weight: apiProduct.unit || apiProduct.weight || "pc",
    featured: Boolean(apiProduct.featured || apiProduct.is_featured || apiProduct.isFeatured || Number(apiProduct.featured) === 1),
    tags: Array.isArray(apiProduct.tags) ? apiProduct.tags.map((t) => String(t).trim()) : [],
    createdAt: apiProduct.createdAt || apiProduct.created_at,
    categoryName: apiProduct.category?.name || "",
  };
}

