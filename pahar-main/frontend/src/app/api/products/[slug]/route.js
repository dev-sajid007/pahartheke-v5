import { NextResponse } from "next/server";

const POS_API = process.env.EXTERNAL_PRODUCT_API || "https://posapi.pahartheke.com/api/ecommerce/products";

export async function GET(_, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Product slug is required." },
        { status: 400 }
      );
    }

    const res = await fetch(POS_API, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });

    const listData = await res.json();
    const products = listData?.data || [];

    const matched = products.find(
      (p) => p.slug === slug || p._id === slug || p.id === slug
    );

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
