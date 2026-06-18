"use client";

import ProductSlider from "@/components/product/product-slider";
import { transformProduct } from "@/lib/transform/productTransform";
import { getLatestProducts } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
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

        const normalized = rawProducts.map(transformProduct);
        setProducts(normalized);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-gray-50 py-10 dark:bg-gray-900/50">
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

  if (error) {
    return (
      <section className="w-full bg-gray-50 py-10 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="w-full bg-gray-50 py-10 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">No products available</p>
        </div>
      </section>
    );
  }

  const featured = products.filter((p) => Number(p.featured) === 1);
  const finalProducts = featured.length > 0 ? featured : getLatestProducts(products, 10);

  return (
    <section className="w-full bg-gray-50 py-10 dark:bg-gray-900/50">
      <ProductSlider products={finalProducts} />
    </section>
  );
}
