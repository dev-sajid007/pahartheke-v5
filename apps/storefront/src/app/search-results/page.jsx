"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import ProductCard from "@/components/product/product-card";
import { transformProduct } from "@/lib/transform/productTransform";
import {  Search, SlidersHorizontal } from "lucide-react";
import CategorySection from "@/components/home/category-section";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get("q") || searchParams.get("query") || "";
    const [query, setQuery] = useState(initialQuery);
    const [searchInput, setSearchInput] = useState(initialQuery);
    const [rawProducts, setRawProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState("default");

    // Keep query state in sync with URL searchParams
    useEffect(() => {
        const q = searchParams.get("q") || searchParams.get("query") || "";
        setQuery(q);
        setSearchInput(q);
    }, [searchParams]);

    // Fetch products
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
                console.error("Failed to fetch products for search:", err);
                setError("Failed to load search results. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter products by search query
    const displayedProducts = useMemo(() => {
        let list = [...rawProducts];

        if (query.trim()) {
            const q = query.toLowerCase().trim();
            list = list.filter((p) => {
                const nameMatch = (p.name || "").toLowerCase().includes(q);
                const catMatch = (p.categoryName || "").toLowerCase().includes(q);
                const tagMatch = Array.isArray(p.tags) && p.tags.some((t) => String(t).toLowerCase().includes(q));
                const slugMatch = (p.slug || "").toLowerCase().includes(q);
                return nameMatch || catMatch || tagMatch || slugMatch;
            });
        }

        // Sort products
        if (sortBy === "price-low") {
            list.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === "price-high") {
            list.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === "name") {
            list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        }

        return list;
    }, [rawProducts, query, sortBy]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            router.push(`/search-results?q=${encodeURIComponent(searchInput.trim())}`);
        } else {
            router.push("/search-results");
        }
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-16">
                {/* Banner Section */}
                <CategorySection isStandalone={true} />

                {/* Search & Results Section */}
                <section className="container mx-auto px-4 py-8">
                    {/* Controls Bar */}
                    <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800">
                        {/* Search Input Form */}
                        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products by name, category, or tag..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 pl-10 pr-20 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-green-600 focus:bg-white focus:outline-none transition"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#FFC700] hover:bg-yellow-400 text-black px-3 py-1 text-xs font-bold transition"
                            >
                                Search
                            </button>
                        </form>

                        {/* Sort & Count */}
                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                            <span className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                {displayedProducts.length} Products
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
                                {query
                                    ? `No matches found for "${query}". Try checking spelling or searching another keyword.`
                                    : "Type a keyword in the search bar to find products."}
                            </p>
                            {query && (
                                <Link
                                    href="/search-results"
                                    onClick={() => {
                                        setQuery("");
                                        setSearchInput("");
                                    }}
                                    className="mt-4 inline-block px-4 py-2 rounded-xl bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition"
                                >
                                    Clear Search
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Product Grid */}
                    {!loading && !error && displayedProducts.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {displayedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default function SearchResultsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-700 border-t-transparent mx-auto mb-3" />
                        <p className="text-sm font-semibold text-gray-600">Loading search results...</p>
                    </div>
                </div>
            }
        >
            <SearchResultsContent />
        </Suspense>
    );
}
