import { NextResponse } from "next/server";

const POS_API = process.env.EXTERNAL_PRODUCT_API;
const API_KEY = process.env.ECOMMERCE_API_KEY;

const slugify = (text) => {
  if (!text) return "";
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export async function GET(_, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required." },
        { status: 400 }
      );
    }

    const lowerSlug = slug.toLowerCase();
    const normSlug = slugify(slug);

    // Try direct product endpoint first (works with both slug and MongoDB ObjectId)
    const directRes = await fetch(`${POS_API}/${encodeURIComponent(slug)}`, {
      headers: {
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
      next: { revalidate: 300 },
    });

    if (directRes.ok) {
      const directJson = await directRes.json();
      const product = directJson?.data;
      if (product) {
        return NextResponse.json(
          { success: true, data: product },
          { status: 200 }
        );
      }
    }

    // Fallback: fetch all products and find by slug/id/name match
    const allRes = await fetch(POS_API, {
      headers: {
        Accept: "application/json",
        "x-api-key": API_KEY,
      },
      next: { revalidate: 300 },
    });

    if (!allRes.ok) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const listData = await allRes.json();
    const products = listData?.data || [];

    const matched = products.find((p) => {
      const pId = String(p._id || p.id || "");
      const pSlugRaw = p.slug ? String(p.slug).toLowerCase() : "";
      const pSlugNorm = p.slug ? slugify(p.slug) : "";
      const pNameSlug = p.name ? slugify(p.name) : "";

      return (
        pId === slug ||
        pSlugRaw === lowerSlug ||
        (pSlugNorm && pSlugNorm !== "-" && pSlugNorm === normSlug) ||
        (pNameSlug && pNameSlug === normSlug) ||
        (pNameSlug && pNameSlug === lowerSlug)
      );
    });

    if (!matched) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: matched },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}

