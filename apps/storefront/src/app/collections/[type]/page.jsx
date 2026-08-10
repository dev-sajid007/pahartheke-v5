"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import ProductCard from "@/components/product/product-card";
import { transformProduct } from "@/lib/transform/productTransform";
import { getLatestProducts } from "@/lib/utils";
import { ArrowLeft, Sparkles, Tag, Crown, Search, SlidersHorizontal } from "lucide-react";

export default function CollectionPage() {
    const params = useParams();
    const router = useRouter();
    const collectionType = params?.type || "all";

    const [rawProducts, setRawProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("default");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/products", { cache: "no-store" });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                const items = data?.data || [];
                const normalized = items.map(transformProduct);
                setRawProducts(normalized);
            } catch (err) {
                console.error("Failed to fetch collection products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Determine section details based on collectionType
    const collectionInfo = useMemo(() => {
        const type = collectionType.toLowerCase();

        if (type === "featured" || type === "featured-products") {
            return {
                title: "Featured Products",
                subtitle: "Handpicked select items this week",
                icon: <Sparkles className="h-6 w-6 text-amber-500" />,
                filter: (products) => {
                    const featured = products.filter(
                        (p) =>
                            Boolean(p.featured) ||
                            p.tags?.some((t) =>
                                ["featured", "featured-product", "featured-item", "featured-products"].includes(String(t).toLowerCase())
                            )
                    );
                    return featured.length > 0 ? featured : getLatestProducts(products, 12);
                },
                cardStyle: "featured",
            };
        }

        if (type === "best-sellers" || type === "bestsellers") {
            return {
                title: "Best Sellers",
                subtitle: "Top seller products of this week",
                icon: <Tag className="h-6 w-6 text-amber-500 fill-amber-400" />,
                filter: (products) => {
                    const filtered = products.filter((p) =>
                        p.tags?.some((t) =>
                            ["best-seller", "bestseller", "best_seller", "bestsellers", "best-sellers"].includes(String(t).toLowerCase())
                        )
                    );
                    return filtered.length > 0 ? filtered : getLatestProducts(products, 12);
                },
                cardStyle: "bestseller",
            };
        }

        if (type === "popular" || type === "popular-items") {
            return {
                title: "Popular Items",
                subtitle: "Customers' favorite items",
                icon: <Crown className="h-6 w-6 text-amber-500 fill-amber-400" />,
                filter: (products) => {
                    const filtered = products.filter((p) =>
                        p.tags?.some((t) =>
                            ["popular", "popular-item", "popular_item", "popular-items", "popularitem"].includes(String(t).toLowerCase())
                        )
                    );
                    return filtered.length > 0 ? filtered : getLatestProducts(products, 12);
                },
                cardStyle: "popular",
            };
        }

        // Default / Generic collection
        const formattedTitle = collectionType
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

        return {
            title: formattedTitle || "Product Collection",
            subtitle: "Browse our select high quality items",
            icon: <Sparkles className="h-6 w-6 text-amber-500" />,
            filter: (products) => {
                const tagMatch = products.filter((p) =>
                    p.tags?.some((t) => t.toLowerCase() === collectionType.toLowerCase())
                );
                return tagMatch.length > 0 ? tagMatch : products;
            },
            cardStyle: "standard",
        };
    }, [collectionType]);

    // Apply filters and sorting
    const displayedProducts = useMemo(() => {
        let list = collectionInfo.filter(rawProducts);

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name?.toLowerCase().includes(q) ||
                    p.categoryName?.toLowerCase().includes(q)
            );
        }

        if (sortBy === "price-low") {
            list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === "price-high") {
            list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === "name") {
            list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        }

        return list;
    }, [rawProducts, collectionInfo, search, sortBy]);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
              

                {/* Content Container */}
                <section className="container mx-auto px-4 py-8">
                    {/* Controls Bar: Search & Sort */}
                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800">
                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search items in collection..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-600 focus:bg-white focus:outline-none transition"
                            />
                        </div>

                        {/* Sort & Stats */}
                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                            <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {displayedProducts.length} {displayedProducts.length === 1 ? "Product" : "Products"}
                            </span>

                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-gray-400 hidden sm:block" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-800 dark:text-gray-200 outline-none cursor-pointer focus:border-green-600"
                                >
                                    <option value="default">Sort by: Default</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading Skeleton */}
                    {loading && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-72 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                                />
                            ))}
                        </div>
                    )}

                    {/* Error Message */}
                    {!loading && error && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
                            <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && displayedProducts.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 p-12 text-center bg-white dark:bg-gray-900">
                            <div className="text-5xl mb-3">🔍</div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                No products found
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {search ? `No matches found for "${search}"` : "No products available in this collection."}
                            </p>
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="mt-4 px-4 py-2 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    )}

                    {/* Product Grid */}
                    {!loading && !error && displayedProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {displayedProducts.map((product) => (
                                <div key={product.id} className="h-full">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}
