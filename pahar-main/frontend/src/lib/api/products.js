import { apiGet } from "@/lib/api/client";

export async function getProducts() {
  const response = await apiGet("/api/products", {
    cache: "no-store",
  });

  return response?.data || [];
}

export async function getProductsByCategorySlug(slug) {
  if (!slug) {
    throw new Error("Category slug is required.");
  }

  const response = await apiGet(`/api/products/by-category/${slug}`, {
    cache: "no-store",
  });

  return response?.data || [];
}

export async function getProductBySlug(slug) {
  if (!slug) {
    throw new Error("Product slug is required.");
  }

  const response = await apiGet(`/api/products/${slug}`, {
    cache: "no-store",
  });

  return response?.data || null;
}