"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const rawImage =
    product?.image ||
    (Array.isArray(product?.images) ? product.images[0] : null);
  const hasImage = Boolean(rawImage && typeof rawImage === "string" && rawImage.trim() !== "");
  const image = hasImage ? rawImage : "/images/fallback-product.png";

  const isInStock = Number(product?.stock ?? 1) > 0;
  const validSlug =
    product?.slug && product.slug !== "--" && product.slug !== "-"
      ? product.slug
      : null;
  const nameSlug = product?.name
    ? product.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
    : "";
  const productId = product?.id || product?._id || "";
  const productSlug = validSlug || nameSlug || productId;
  const weightDisplay = product?.weight || product?.unit || "250gm";
  const price = Number(product?.price) || 0;
  const originalPrice =
    Number(product?.originalPrice || product?.comparePrice || product?.mrp) ||
    null;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round((1 - price / originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInStock) return;

    dispatch(
      addToCart({
        id: product?.id || product?._id || productSlug,
        name: product?.name || "Product",
        price,
        quantity: 1,
        image,
        weight: weightDisplay,
        slug: productSlug,
      })
    );

    toast.success(`${product?.name} added to cart!`, {
      duration: 2000,
      icon: "🛒",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-slate-800 dark:bg-[#111]">

      {/* Image Area */}
      <Link href={`/products/${productSlug}`} className="block relative">
        <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-800/60 sm:h-48">

          {/* Discount Badge */}
          {discount && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-lg bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              {discount}% OFF
            </span>
          )}

          {/* Out of Stock Badge */}
          {!isInStock && (
            <span className="absolute right-2.5 top-2.5 z-10 rounded-lg bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              Out of Stock
            </span>
          )}

          {/* Product Image */}
          <div className="relative h-full w-full p-4">
            <Image
              src={image}
              alt={product?.name || "Product image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              priority={!!product?.featured}
              unoptimized={
                hasImage &&
                typeof image === "string" &&
                image.startsWith("data:")
              }
              className="object-contain transition-transform duration-500 group-hover:scale-[1.06]"
            />
          </div>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-3">

        {/* Product Name */}
        <Link href={`/products/${productSlug}`} className="block">
          <h3 className="line-clamp-1 text-sm font-bold text-slate-400 dark:text-slate-400 md:text-[15px]">
            {product?.name}
          </h3>
        </Link>

        {/* Weight, Price & Stock Row */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">
            {weightDisplay}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-extrabold text-slate-400 dark:text-slate-400">
              ৳{price}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-[10px] text-slate-400 line-through">
                ৳{originalPrice}
              </span>
            )}
          </div>
          <span
            style={{ backgroundColor: "#76B432" }}
            className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs"
          >
            {isInStock ? "in Stock" : "Stock Out"}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!isInStock || added}
          style={isInStock && !added ? { backgroundColor: "#76B432" } : undefined}
          className={`mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all duration-200 active:scale-95
            ${added
              ? "bg-emerald-600 text-white cursor-default"
              : isInStock
                ? "hover:opacity-90 text-slate-100 border border-slate-400/30 cursor-pointer shadow-sm hover:shadow-md"
                : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500"
            }`}
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}