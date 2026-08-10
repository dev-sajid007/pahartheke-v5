"use client";

import ProductSlider from "@/components/product/product-slider";
import { transformProduct } from "@/lib/transform/productTransform";
import { getLatestProducts } from "@/lib/utils";
import { getSection } from "@/lib/api/landing-page";
import { useEffect, useState } from "react";

const DEFAULT_TITLE = "Popular Items";
const DEFAULT_SUBTITLE = "Customers' favorite items";

export default function PopularItems() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState(DEFAULT_TITLE);
    const [subtitle, setSubtitle] = useState(DEFAULT_SUBTITLE);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products", { cache: "no-store" });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                const rawProducts = data?.data || [];

                const normalized = rawProducts.map(transformProduct);
                setProducts(normalized);
            } catch (err) {
                console.error("Failed to fetch products for popular items:", err);
                setError("Failed to load popular items. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        // Fetch dynamic labels
        getSection("home", "popular_items")
            .then((s) => {
                if (s) {
                    setTitle(s.title || DEFAULT_TITLE);
                    setSubtitle(s.subtitle || DEFAULT_SUBTITLE);
                }
            })
            .catch(() => { });
    }, []);

    if (loading) {
        return (
            <section className="w-full bg-gray-50 py-10 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || !products.length) {
        return null;
    }

    const filtered = products.filter((p) =>
        p.tags?.some((t) =>
            ["popular", "popular-item", "popular_item", "popular-items", "popularitem"].includes(String(t).toLowerCase())
        )
    );

    const finalProducts = filtered.length > 0 ? filtered : getLatestProducts(products, 10);

    return (
        <section className="w-full bg-gray-50 py-10 dark:bg-gray-900/50 overflow-hidden">
            <ProductSlider
                products={finalProducts}
                title={title}
                subtitle={subtitle}
                navigationId="popular-items"
                cardType="horizontal"
                viewAllLink="/collections/popular-items"
            />
        </section>
    );
}
