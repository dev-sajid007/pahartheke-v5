const BACKEND_API_URL = process.env.BACKEND_API_URL;

function getImageUrl(path) {
  if (!path) return null;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const baseUrl = BACKEND_API_URL?.replace(/\/api\/v\d+\/?$/, "") || "";
  const cleanPath = String(path).replace(/^\/+/, "");

  return `${baseUrl}/${cleanPath}`;
}

export function normalizeCategory(category) {
  const parentId =
    category?.parent_id === null || category?.parent_id === undefined
      ? null
      : Number(category.parent_id);

  return {
    id: Number(category?.id),
    name: category?.name || "",
    slug: category?.slug || "",
    image: getImageUrl(category?.banner || category?.icon),
    parentId,
    level: parentId ? 2 : 1,
  };
}