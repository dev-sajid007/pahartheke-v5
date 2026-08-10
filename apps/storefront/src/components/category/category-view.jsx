"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import { getCategories } from "@/lib/api/categories";

export default function CategoryView({ currentSlug, initialProducts = [], initialCategories = [] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [loadingCategories, setLoadingCategories] = useState(initialCategories.length === 0);
  const [sortBy, setSortBy] = useState("high-to-low");
  const [sortedProducts, setSortedProducts] = useState(initialProducts);

  // Embla Carousel setup without Auto-play for static category navigation
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    dragFree: false,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Load categories if not provided initially
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
      setLoadingCategories(false);
      return;
    }

    let cancelled = false;
    async function loadCats() {
      try {
        setLoadingCategories(true);
        const data = await getCategories();
        if (!cancelled && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories in CategoryView:", err);
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    }
    loadCats();
    return () => {
      cancelled = true;
    };
  }, [initialCategories]);

  useEffect(() => {
    if (!emblaApi) return;

    if (categories.length > 0 && currentSlug) {
      const activeIndex = categories.findIndex(
        (cat) => (cat.slug || "").toLowerCase() === currentSlug.toLowerCase()
      );
      if (activeIndex !== -1) {
        const visibleSlides = emblaApi.slidesInView() || [];
        if (!visibleSlides.includes(activeIndex)) {
          emblaApi.scrollTo(activeIndex, true);
        }
      }
    }
  }, [emblaApi, categories, currentSlug]);

  // Handle sorting logic
  useEffect(() => {
    let list = [...initialProducts];
    if (sortBy === "high-to-low") {
      list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "low-to-high") {
      list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "a-to-z") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "z-to-a") {
      list.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    }
    setSortedProducts(list);
  }, [sortBy, initialProducts]);

  // Format category display title
  const formattedTitle = currentSlug
    ? currentSlug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Category Products";

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* 1. TOP CATEGORY NAV CAROUSEL */}
      {loadingCategories ? (
        <div className="mb-8 flex gap-3 overflow-hidden py-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[175px] sm:h-[200px] w-full min-w-[120px] shrink-0 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="relative mb-8 px-4 sm:px-8">
          {/* Left Arrow Button */}
          <button
            onClick={scrollPrev}
            type="button"
            style={{ backgroundColor: "#76B432" }}
            className="absolute -left-1 sm:-left-2 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-slate-100 shadow-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95 border border-slate-300/20 cursor-pointer"
            aria-label="Previous Category"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
          </button>

          {/* Embla Slider Container with Auto-play */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {categories.map((cat) => {
                const isActive =
                  (cat.slug || "").toLowerCase() ===
                  (currentSlug || "").toLowerCase();
                const categoryImage = cat.icon || cat.image;
                const hasImage = Boolean(
                  categoryImage && categoryImage.trim() !== ""
                );
                const iconSrc = hasImage ? categoryImage : "/cardImage.svg";

                return (
                  <Link
                    key={cat._id || cat.id || cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex-[0_0_38%] px-1 sm:flex-[0_0_28%] md:flex-[0_0_22%] lg:flex-[0_0_16%]"
                  >
                    <div
                      style={
                        isActive
                          ? {
                            backgroundColor: "#76B432",
                            borderColor: "#76B432",
                          }
                          : undefined
                      }
                      className={`group overflow-hidden rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-between transition-all duration-300 h-[175px] sm:h-[200px] cursor-pointer ${isActive
                        ? "text-white shadow-xl shadow-emerald-950/20 scale-[1.02] border-2"
                        : "bg-white text-slate-800 border border-slate-200/80 shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800"
                        }`}
                    >
                      {/* Vertical Image Container (Lomba) */}
                      <div className="h-28 sm:h-36 w-full flex items-center justify-center overflow-hidden relative rounded-xl bg-slate-50 dark:bg-slate-950">
                        <Image
                          src={iconSrc}
                          alt={cat.name || "Category"}
                          fill
                          sizes="(max-width: 768px) 120px, 200px"
                          unoptimized={
                            hasImage &&
                            typeof iconSrc === "string" &&
                            iconSrc.startsWith("data:")
                          }
                          className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Category Name */}
                      <div className="text-center w-full min-w-0 overflow-hidden pt-1">
                        <h3
                          style={{
                            color: isActive ? "#FFFFFF" : "#8C9093",
                            display: "block",
                            width: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap"
                          }}
                          title={cat.name}
                          className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-tight transition-colors"
                        >
                          {cat.name && cat.name.length > 20
                            ? cat.name.substring(0, 18) + "..."
                            : cat.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={scrollNext}
            type="button"
            style={{ backgroundColor: "#76B432" }}
            className="absolute -right-1 sm:-right-2 top-1/2 -translate-y-1/2 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-slate-100 shadow-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95 border border-slate-300/20 cursor-pointer"
            aria-label="Next Category"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
          </button>
        </div>
      ) : null}

      {/* 2. TITLE & SORT DROPDOWN ROW */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-[#76B432] dark:text-white md:text-3xl">
          {formattedTitle}
        </h1>

        {/* Sort Dropdown */}
        <div className="relative inline-block">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2 pr-8 text-xs font-semibold text-[#8C9093] shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="high-to-low">High to Low</option>
            <option value="low-to-high">Low to High</option>
            <option value="a-to-z">Name: A to Z</option>
            <option value="z-to-a">Name: Z to A</option>
            <option value="featured">Featured</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* 3. PRODUCT CARDS GRID */}
      {!sortedProducts.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="text-5xl mb-3">📦</div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            No products found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            No products are currently available in this category.
          </p>
          <Link
            href="/"
            style={{ backgroundColor: "#76B432" }}
            className="mt-4 inline-block rounded-xl hover:opacity-90 text-white text-sm font-bold px-5 py-2.5 transition shadow-md"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
