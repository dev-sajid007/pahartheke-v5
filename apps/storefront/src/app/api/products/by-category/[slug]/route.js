import { NextResponse } from "next/server";

const POS_API = process.env.EXTERNAL_PRODUCT_API ;
const API_KEY = process.env.ECOMMERCE_API_KEY ;

export async function GET(req, { params }) {
    try {
        const resolvedParams = await params;
        const rawSlug = resolvedParams?.slug || "";
        const slug = decodeURIComponent(rawSlug).toLowerCase().trim();

        // Build the API URL: use ?category= for specific category, plain URL for "all"
        const apiUrl = (!slug || slug === "all")
            ? POS_API
            : `${POS_API}?category=${encodeURIComponent(slug)}`;

        const res = await fetch(apiUrl, {
            headers: {
                Accept: "application/json",
                "x-api-key": API_KEY,
            },
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.warn("Category products API failed with status:", res.status);
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        const json = await res.json();
        const products = Array.isArray(json?.data) ? json.data : [];

        return NextResponse.json({ success: true, data: products }, { status: 200 });
    } catch (error) {
        console.error("Error in category products API:", error);
        return NextResponse.json(
            { success: true, data: [] },
            { status: 200 }
        );
    }
}
