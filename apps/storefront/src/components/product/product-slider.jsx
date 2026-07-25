"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import ProductCard from "./product-card"

export default function ProductSlider({ products = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(updateScrollButtons, 400);
  };

  return (
    <section className="w-full">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                Best Selling Products
              </h2>
              <p className="hidden text-sm text-gray-500 dark:text-gray-400 sm:block">
                Our most popular picks this season
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden gap-1 sm:flex">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:bg-amber-50 hover:text-amber-600 disabled:opacity-30 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button className="flex items-center gap-1 rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10">
              View All
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1 sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[270px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
