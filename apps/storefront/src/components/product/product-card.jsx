"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const router = useRouter();

  const image =
    product?.image ||
    (Array.isArray(product?.images) ? product.images[0] : null) ||
    "/images/fallback-product.png";

  const isInStock = Number(product?.stock ?? 0) > 0;
  const productSlug = product.slug || product.id;

  const handleViewDetails = (event) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/products/${productSlug}`);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-gray-800 dark:bg-[#111]">
      <Link href={`/products/${productSlug}`} className="block">
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 to-orange-100 p-4 sm:h-48">
          {!isInStock && (
            <span className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
              Out of Stock
            </span>
          )}
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-3">
        <div className="space-y-2">
          <Link href={`/products/${productSlug}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-gray-800 transition-colors group-hover:text-amber-700 dark:text-gray-100 dark:group-hover:text-amber-400">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ৳{product.price}
            </span>
            {product.oldPrice ? (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.oldPrice}
              </span>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewDetails}
          className="ThemeColor mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold shadow-sm transition hover:brightness-95 active:scale-[0.97]"
        >
          <ShoppingCart className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  );
}
