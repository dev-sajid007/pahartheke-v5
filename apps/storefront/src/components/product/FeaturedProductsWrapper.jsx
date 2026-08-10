"use client";

import { useEffect, useState } from "react";
import ProductSlider from "@/components/product/product-slider";
import { getLatestProducts } from "@/lib/utils";
import { transformProduct } from "@/lib/transform/productTransform";

export default function FeaturedProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const raw = data?.data || [];
        setProducts(raw.map(transformProduct));
      } catch (err) {
        console.error(err);
      }
    }, 120 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!products?.length) return null;

  const finalProducts = getLatestProducts(products, 10);

  return (
    <section className="w-full bg-gray-100 my-6 py-6 dark:bg-gray-900 dark:text-white">
      <div className="relative">
        <div
          className="absolute top-80 left-0 w-full h-[100px] bg-yellow-400 rounded-xl pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative container mx-auto px-4 py-5">
          <ProductSlider products={finalProducts} />
        </div>
      </div>
    </section>
  );
}
