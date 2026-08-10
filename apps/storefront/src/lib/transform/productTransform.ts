export function transformProduct(rawProduct: any) {
  if (!rawProduct) return null

  const image = rawProduct.image
    ? String(rawProduct.image).startsWith("http") || String(rawProduct.image).startsWith("data:")
      ? String(rawProduct.image)
      : `/images/${rawProduct.image}`
    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Cpath d='M80 100l15-20 15 20 15-25 15 25v30H80V100z' fill='%23d1d5db'/%3E%3C/svg%3E"

  const rawPrice = rawProduct.salePrice ?? rawProduct.price ?? rawProduct.sale_price ?? 0
  const price = Number(rawPrice) || 0

  const rawStock = rawProduct.currentStock ?? rawProduct.stockQuantity ?? rawProduct.stock ?? rawProduct.quantity ?? 0
  const stock = Number(rawStock) || 0

  return {
    id: rawProduct.id?.toString() || rawProduct._id?.toString() || '',
    name: rawProduct.name || rawProduct.title || '',
    slug: rawProduct.slug || generateSlug(rawProduct.name || rawProduct.title || ''),
    description: rawProduct.description || rawProduct.details || '',
    image,
    images: [image],
    price,
    oldPrice: Number(rawProduct.purchasePrice || rawProduct.purchase_price || 0) > price
      ? Number(rawProduct.purchasePrice || rawProduct.purchase_price || 0)
      : null,
    stock,
    rating: 0,
    weight: rawProduct.unit || 'pc',
    tags: Array.isArray(rawProduct.tags) ? rawProduct.tags.map((t: any) => String(t).trim()) : [],
    featured: Boolean(rawProduct.featured || rawProduct.is_featured || rawProduct.isFeatured || Number(rawProduct.featured) === 1),
    status: rawProduct.status || 'active',
    category: rawProduct.category ? transformCategory(rawProduct.category) : null,
    createdAt: rawProduct.created_at || rawProduct.createdAt || new Date().toISOString(),
    updatedAt: rawProduct.updated_at || rawProduct.updatedAt || new Date().toISOString(),
  }
}

export function transformCategory(rawCategory: any) {
  if (!rawCategory) return null

  return {
    id: rawCategory.id?.toString() || rawCategory._id?.toString() || '',
    name: rawCategory.name || '',
    slug: rawCategory.slug || generateSlug(rawCategory.name || ''),
    description: rawCategory.description || '',
    image: rawCategory.image || rawCategory.category_image || '',
    parentId: rawCategory.parent_id || rawCategory.parentId || null,
    status: rawCategory.status || 'active',
    createdAt: rawCategory.created_at || rawCategory.createdAt || new Date().toISOString(),
    updatedAt: rawCategory.updated_at || rawCategory.updatedAt || new Date().toISOString(),
  }
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}