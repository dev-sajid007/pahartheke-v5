"use client";

import Link from "next/link";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ShopSidebar from "@/components/common/Sidebar";
import { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { toast } from "sonner";



function normalizeProduct(p, index, nameToSlug = {}) {
  try {
    const price = Number(p.salePrice ?? p.price ?? 0);
    const stock = Number(p.currentStock ?? p.stockQuantity ?? p.stock ?? 0);
    const rawImg = String(p.image || (Array.isArray(p.images) ? p.images[0] : "") || "/images/fallback-product.png");
    const imageUrl = rawImg.startsWith("http") || rawImg.startsWith("data:") ? rawImg : `/images/${rawImg.replace(/^\//, "")}`;

    let category;
    if (typeof p.category === "object" && p.category?.slug) {
      category = p.category.slug;
    } else if (p.category) {
      const catStr = String(p.category);
      category = nameToSlug[catStr.toLowerCase()] || catStr;
    } else {
      category = "";
    }

    return {
      id: p._id || p.id || `prod-${index}`,
      name: p.name || "Product",
      desc: p.description || "",
      price,
      originalPrice: Number(p.oldPrice || p.purchasePrice || p.purchase_price || 0) || null,
      badge: p.tags?.length ? p.tags[0] : null,
      image: imageUrl,
      slug: p.slug || p._id || "",
      category,
      tags: p.tags || [],
      inStock: stock > 0,
      isNew: false,
    };
  } catch {
    return null;
  }
}



export default function ShopPage() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
      if (searchParams.has("search")) {
        setSearch(searchParams.get("search"));
      }

      let fetchedCategories = [];
      try {
        const catRes = await fetch("/api/categories", { cache: "no-store" });
        if (catRes.ok) {
          const json = await catRes.json();
          const raw = json.data || json.categories || [];
          if (raw.length) {
            fetchedCategories = [
              { label: "All Products", value: "" },
              ...raw.map((c) => ({ label: c.name, value: c.slug })),
            ];
          }
        }
      } catch (err) {
        console.error("Categories fetch failed:", err);
      }
      setCategories(fetchedCategories);

      const nameToSlug = {};
      for (const c of fetchedCategories) {
        if (c.label && c.value) {
          nameToSlug[c.label.toLowerCase()] = c.value;
        }
      }

      try {
        const prodRes = await fetch("/api/products", { cache: "no-store" });
        if (prodRes.ok) {
          const json = await prodRes.json();
          const raw = json.data || json.products || [];
          if (raw.length) {
            const mapped = raw.map((p, i) => normalizeProduct(p, i, nameToSlug)).filter(Boolean);
            setProducts(mapped);
            const allTags = [...new Set(mapped.flatMap((p) => p.tags))];
            setTags(allTags);
          }
        }
      } catch (err) {
        console.error("Products fetch failed:", err);
        toast.error("Failed to load products. Please try again.");
      }

      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let items = [...products];

    if (category) {
      items = items.filter((item) => item.category === category);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.desc.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedTags.length) {
      items = items.filter((item) =>
        selectedTags.every((tag) => item.tags.includes(tag))
      );
    }

    items = items.filter((item) => item.price <= maxPrice);

    if (inStockOnly) {
      items = items.filter((item) => item.inStock);
    }

    if (sort === "price-asc") {
      items.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      items.sort((a, b) => b.price - a.price);
    }

    if (sort === "newest") {
      items.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }

    return items;
  }, [category, search, selectedTags, maxPrice, inStockOnly, sort]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // const Sidebar = () => (


  return (
<>

<Header/>

    <div className="min-h-screen bg-[#faf7f0] text-[#1a2e1a]">
      {/* HERO */}
      <section className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 flex items-center justify-between gap-5">
          <div>
            <p className="text-xs sm:text-sm opacity-70 mb-2">
              Home › Shop
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
              Hill Tract Organics
            </h1>

            <p className="text-sm sm:text-base opacity-80 max-w-xl">
              Direct from local farmers of Chittagong & Rangamati
            </p>
          </div>

          <div className="hidden md:block text-7xl opacity-20">
            🌄
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-5 lg:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block sticky top-20 h-fit">
            <ShopSidebar
                categories={categories}
                tags={tags}
                category={category}
                setCategory={setCategory}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
            />
          </aside>

          {/* CONTENT */}
          <div>
            {/* MOBILE FILTER BTN */}
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden mb-4 w-full bg-white border border-[#e2ead8] rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              ⚙️ Filters
            </button>

            {/* SEARCH BAR */}
            <div className="bg-white border border-[#e2ead8] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row gap-3 lg:items-center justify-between mb-5">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-600"
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">
                    Price Low to High
                  </option>
                  <option value="price-desc">
                    Price High to Low
                  </option>
                  <option value="newest">Newest</option>
                </select>

                <span className="text-sm text-gray-500 font-semibold whitespace-nowrap">
                  {filteredProducts.length} products
                </span>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="h-10 w-10 border-4 border-green-200 border-t-green-700 rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading products...</p>
              </div>
            ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product) => {
                const discount = product.originalPrice
                  ? Math.round(
                      (1 -
                        product.price / product.originalPrice) *
                        100
                    )
                  : null;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-[#e2ead8] rounded-2xl overflow-hidden hover:-translate-y-1 transition duration-300"
                  >
                      {/* IMAGE */}
                      <Link href={`/products/${product.slug || product.id}`}>
                        <div className="h-32 sm:h-40 md:h-44 bg-[#f4ede0] flex items-center justify-center relative overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />

                      {discount && (
                        <span className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      )}

                      {!discount && product.badge && (
                        <span className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    </Link>

                    {/* BODY */}
                    <div className="p-3 sm:p-4">
                      <Link href={`/products/${product.slug || product.id}`}>
                        <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2 line-clamp-1 hover:text-green-700 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-[11px] sm:text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                        {product.desc}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base sm:text-lg font-bold text-green-700">
                              ৳{product.price}
                            </span>

                            {product.originalPrice && (
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ৳{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          disabled={!product.inStock}
                          onClick={() => {
                            if (!product.inStock) return;
                            dispatch(addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              quantity: 1,
                              slug: product.slug,
                            }));
                            toast.success(`${product.name} added to cart`);
                          }}
                          className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                            product.inStock
                              ? "bg-green-700 text-white hover:bg-green-900"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {product.inStock
                            ? "Add to Cart"
                            : "Out Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {/* EMPTY */}
            {!loading && !filteredProducts.length && (
              <div className="text-center py-16 text-gray-500">
                <h3 className="text-xl font-bold mb-2">
                  No products found
                </h3>

                <p>Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE DRAWER */}
      {showFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div
            onClick={() => setShowFilter(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* drawer */}
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-[#faf7f0] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>

              <button
                onClick={() => setShowFilter(false)}
                className="text-sm font-semibold"
              >
                ✕ Close
              </button>
            </div>

            <ShopSidebar 
              categories={categories}
              tags={tags}
              category={category}
              setCategory={setCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              setShowFilter={setShowFilter}
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer/>
    </div>
</>
  );
}