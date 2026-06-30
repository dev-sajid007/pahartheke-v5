"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCategories } from "@/services/categories";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function CategoriesSkeleton() {
  return (
    <div className="relative z-20 -mt-16 px-4 pb-10 md:-mt-20">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="min-w-0 flex-[0_0_70%] px-2 sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_18%]">
            <div className="rounded-2xl bg-[#f2f2f2] p-6 shadow-lg animate-pulse">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="mb-4 h-16 w-16 rounded-full bg-gray-300" />
                <div className="h-5 w-24 rounded bg-gray-300" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesEmptyState() {
  return (
    <div className="relative z-20 -mt-16 px-4 pb-10 md:-mt-20">
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-[#2b2b2b]">No categories found</h3>
        <p className="mt-2 text-sm text-muted-foreground">Categories are not available right now.</p>
      </div>
    </div>
  );
}

function CategoriesErrorState({ message, onRetry }) {
  return (
    <div className="relative z-20 -mt-16 px-4 pb-10 md:-mt-20">
      <div className="rounded-2xl border bg-white p-10 text-center">
        <h3 className="text-lg font-semibold text-red-600">Failed to load categories</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message || "Something went wrong."}</p>
        <Button onClick={onRetry} className="mt-4">Retry</Button>
      </div>
    </div>
  );
}

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const scrollRef = useRef(null);

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

  if (loading) return <CategoriesSkeleton />;
  if (errorMessage) return <CategoriesErrorState message={errorMessage} onRetry={loadCategories} />;
  if (!categories.length) return <CategoriesEmptyState />;

  return (
    <div className="relative z-20 -mt-16 px-4 pb-10 md:-mt-20">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <Link
            href={`/category/${category.slug}`}
            key={category._id || category.id}
            className="snap-start flex-[0_0_70%] px-2 sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_20%]"
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1">
              <div className="h-[140px] w-full overflow-hidden">
                <img
                  src={category.icon || category.image || "/images/fallback-category.png"}
                  alt={category.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-sm font-semibold text-[#2b2b2b]">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
