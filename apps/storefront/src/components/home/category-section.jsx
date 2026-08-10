"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { getCategories } from "@/lib/api/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

function CategoriesSkeleton() {
  return (
    <div className="relative z-20 -mt-16 px-4 pb-10 md:-mt-20">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="min-w-0 flex-[0_0_38%] px-1 sm:flex-[0_0_28%] md:flex-[0_0_22%] lg:flex-[0_0_16%]"
          >
            <Card className="rounded-2xl bg-slate-100 dark:bg-slate-900 p-3 shadow-lg border border-slate-200 dark:border-slate-800 h-[175px] sm:h-[200px]">
              <CardContent className="flex flex-col items-center justify-between h-full p-0 text-center">
                <Skeleton className="h-28 w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-4 w-16 bg-slate-200 dark:bg-slate-800 mt-2" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesEmptyState() {
  return (
    <div className="relative z-20 -mt-16 px-4 pb-10 md:-mt-20">
      <Card className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            No categories found
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Categories are not available right now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoriesErrorState({ message, onRetry }) {
  return (
    <div className="relative z-20 -mt-16 px-4 pb-10 md:-mt-20">
      <Card className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Failed to load categories
          </h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {message || "Something went wrong while loading categories."}
          </p>
          <Button
            onClick={onRetry}
            style={{ backgroundColor: "#76B432" }}
            className="mt-4 hover:opacity-90 text-white font-semibold"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CategorySection({ isStandalone = false }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 2500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      setCategories([]);
      setErrorMessage(error?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  if (loading) {
    return <CategoriesSkeleton />;
  }

  if (errorMessage) {
    return (
      <CategoriesErrorState
        message={errorMessage}
        onRetry={loadCategories}
      />
    );
  }

  if (!categories.length) {
    return <CategoriesEmptyState />;
  }
  console.log(categories)
  return (
    <div className={`relative z-20 pb-6 max-w-7xl mx-auto w-full ${isStandalone ? 'pt-6' : '-mt-16 md:-mt-20'}`}>
      <div className="relative px-4 sm:px-8">

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

        {/* Carousel Container with Auto-play */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {categories.map((category) => {
              const categoryImage = category.icon || category.image;
              const hasImage = Boolean(categoryImage && categoryImage.trim() !== "");

              return (
                <Link
                  href={`/category/${category.slug}`}
                  key={category._id || category.id}
                  className="flex-[0_0_38%] px-1 sm:flex-[0_0_28%] md:flex-[0_0_22%] lg:flex-[0_0_16%]"
                >
                  {/* Vertical Card Design */}
                  <div className="group overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md p-2.5 sm:p-3 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-950/10 h-[175px] sm:h-[200px] cursor-pointer">

                    {/* Vertical Image Container (Lomba) */}
                    <div className="h-28 sm:h-36 w-full flex items-center justify-center overflow-hidden relative rounded-xl bg-slate-50 dark:bg-slate-950">
                      <Image
                        src={hasImage ? categoryImage : "/cardImage.svg"}
                        alt={category.name || "Category"}
                        fill
                        sizes="(max-width: 768px) 120px, 200px"
                        unoptimized={hasImage && typeof categoryImage === "string" && categoryImage.startsWith("data:")}
                        className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Category Name */}
                    <div className="text-center w-full min-w-0 overflow-hidden pt-1">
                      <h3
                        style={{
                          color: "#8C9093",
                          display: "block",
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                        title={category.name}
                        className="text-xs sm:text-sm font-bold uppercase tracking-wide leading-tight transition-colors"
                      >
                        {category.name && category.name.length > 20
                          ? category.name.substring(0, 18) + "..."
                          : category.name}
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
    </div>
  );
}