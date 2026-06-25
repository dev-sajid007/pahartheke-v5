import { NextResponse } from "next/server";

const PRODUCT_API = process.env.EXTERNAL_PRODUCT_API || 'https://posapi.pahartheke.com/api/ecommerce/products';

export async function GET(request, { params }) {
  const { slug } = await params;

  try {
    const url = `${PRODUCT_API}?category=${encodeURIComponent(slug)}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json({ success: false, data: [], message: 'Failed to fetch products' }, { status: res.status });
    }

    const json = await res.json();
    const products = json.data || json.products || [];

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('[by-category] Error:', error.message);
    return NextResponse.json({ success: false, data: [], message: 'Failed to fetch products' }, { status: 500 });
  }
}
