"use client";

import { useState } from "react";
import Link from "next/link";
import { Crown, Plus, Check, Star } from "lucide-react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { toast } from "sonner";

const PatternBg = () => (
  <svg
    className="absolute inset-0 h-full w-full opacity-[0.12] pointer-events-none z-0"
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 80 80"
  >
    <path
      d="M15 8l2 4 4.5.6-3.2 3.1.8 4.4-4.1-2.1-4.1 2.1.8-4.4-3.2-3.1 4.5-.6z"
      fill="#94a3b8"
    />
    <path
      d="M55 12c-3 0-5.5 2.5-5.5 5.5 0 2 1 3.7 2.5 4.7L47 27l-2-2-2 2 2 2 5-5 1.5 1.5c1 1.5 2.7 2.5 4.7 2.5 3 0 5.5-2.5 5.5-5.5S58 12 55 12z"
      fill="#94a3b8"
    />
    <path
      d="M20 50c-4.5 0-8 4.5-8 9s3 7 8 7 8-2.5 8-7-3.5-9-8-9z"
      fill="#94a3b8"
    />
    <path d="M60 48l10 16H50z" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
  </svg>
);

export default function PopularCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const rawImage =
    product?.image ||
    (Array.isArray(product?.images) ? product.images[0] : null);
  const hasImage = Boolean(
    rawImage && typeof rawImage === "string" && rawImage.trim() !== ""
  );
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
  const ratingVal = product?.rating || "4.52";

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
    <div className="group flex h-[150px] sm:h-[160px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-800 dark:bg-[#111]">
      {/* LEFT — Info Panel */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 min-w-0">
        {/* TOP LABEL */}
        <div className="flex items-center gap-1.5 mb-1">
          <Crown className="h-3.5 w-3.5 fill-[#76B432] stroke-[#76B432] dark:fill-emerald-400 dark:stroke-emerald-300 flex-shrink-0" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#76B432] dark:text-emerald-400">
            Top of the week
          </span>
        </div>

        {/* PRODUCT NAME */}
        <Link href={`/products/${productSlug}`}>
          <h3 className="line-clamp-1 text-sm font-extrabold text-slate-400 dark:text-slate-400 sm:text-[15px]">
            {product?.name}
          </h3>
        </Link>

        {/* WEIGHT + PRICE + STOCK ROW */}
        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
          {/* Weight */}
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-400">
            {weightDisplay}
          </span>
          {/* Price */}
          <span className="text-xs font-extrabold text-slate-400 dark:text-slate-400">
            ৳{price}
          </span>
          {/* In Stock Badge */}
          <span
            style={{ backgroundColor: "#76B432" }}
            className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs"
          >
            {isInStock ? "in Stock" : "Stock Out"}
          </span>
        </div>

        {/* BOTTOM ROW — Add button + Rating */}
        <div className="mt-2 flex items-center gap-3">
          {/* Add to cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isInStock || added}
            style={
              isInStock && !added ? { backgroundColor: "#76B432" } : undefined
            }
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base font-bold transition-all duration-200 active:scale-95
                            ${added
                ? "bg-emerald-600 text-white"
                : isInStock
                  ? "hover:opacity-90 text-slate-100 border border-slate-400/30 shadow-sm cursor-pointer"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500"
              }`}
            aria-label="Add to cart"
          >
            {added ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.5} />
            )}
          </button>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-500 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400">
              {ratingVal}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT — Image Panel */}
      <Link
        href={`/products/${productSlug}`}
        className="relative flex-shrink-0 w-[130px] sm:w-[150px] h-full"
      >
        <div className="relative w-full h-full bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden">
          <PatternBg />
          <div className="relative z-10 h-[110px] w-[110px] sm:h-[128px] sm:w-[128px]">
            <Image
              src={image}
              alt={product?.name || "Popular product"}
              fill
              sizes="(max-width: 640px) 30vw, 20vw"
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
    </div>
  );
}
