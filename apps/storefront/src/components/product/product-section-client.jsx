"use client";

import { useEffect, useState } from "react";
import ProductSlider from "@/components/product/product-slider";
import { transformProduct } from "@/lib/transform/productTransform";
import { getLatestProducts } from "@/lib/utils";


export default function ProductSectionClient({
    title,
    subtitle,
    navigationId,
    cardType = "vertical",
    viewAllLink = "/products",
    filterTags = [],
    useFeatured = false,
    sectionClass = "w-full bg-gray-50 py-10 dark:bg-gray-900/50",
}) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products", { cache: "no-store" });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                const rawProducts = data?.data || [];
                setProducts(rawProducts.map(transformProduct));
            } catch (err) {
                console.error(`[ProductSectionClient:${navigationId}] Fetch error:`, err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [navigationId]);

 
    if (loading) {
        return (
            <section className={sectionClass}>
                <div className="container mx-auto px-4">
                    <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

  
    if (error || !products.length) return null;

    
    const tagSet = filterTags.map((t) => t.toLowerCase());

    const filtered = products.filter((p) => {
        if (useFeatured && Boolean(p.featured)) return true;
        if (!tagSet.length) return false;
        return p.tags?.some((t) => tagSet.includes(String(t).toLowerCase()));
    });

    const finalProducts = filtered.length > 0 ? filtered : getLatestProducts(products, 10);

    console.log(products)
    return (
        <section className={sectionClass}>
            <ProductSlider
                products={finalProducts}
                title={title}
                subtitle={subtitle}
                navigationId={navigationId}
                cardType={cardType}
                viewAllLink={viewAllLink}
            />
        </section>
    );
}
