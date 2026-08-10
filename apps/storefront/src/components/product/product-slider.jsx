"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Tag, Crown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ProductCard from "./product-card";
import PopularCard from "./popular-card";

export default function ProductSlider({
  products = [],
  title = "Best Selling Products",
  subtitle = "Our most popular picks this season",
  navigationId = "best-selling",
  icon = null,
  cardType = "vertical",
  viewAllLink = "/products",
}) {
  if (!products || products.length === 0) return null;

  // Header icon selector helper
  const renderHeaderIcon = () => {
    if (icon) return icon;
    if (navigationId === "best-sellers") {
      return <Tag className="h-5 w-5 fill-emerald-600 stroke-emerald-700 dark:fill-emerald-400 dark:stroke-emerald-300" />;
    }
    if (navigationId === "popular-items") {
      return <Crown className="h-5 w-5 fill-emerald-600 stroke-emerald-700 dark:fill-emerald-400 dark:stroke-emerald-300" />;
    }
    return <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
  };

  return (
    <section className="w-full relative py-6">
      <div className="container mx-auto px-4 min-w-0">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-[#76B432] dark:bg-emerald-950/50 dark:text-emerald-400">
              {renderHeaderIcon()}
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#76B432] dark:text-white md:text-2xl">
                {title}
              </h2>
              {subtitle && (
                <p className="hidden text-xs text-[#8C9093] dark:text-gray-400 sm:block mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Decorative Horizontal Line */}
          <div className="hidden md:block flex-1 h-[1px] bg-gray-200/80 mx-6 dark:bg-gray-800" />

          {/* View All Link */}
          <Link
            href={viewAllLink}
            className="flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 transition hover:underline cursor-pointer"
          >
            View All
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Swiper Slider Wrapper */}
        <div className="relative group px-1 w-full min-w-0">
          {/* Previous Button */}
          <button
            className={`custom-prev-${navigationId} absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200 active:scale-95 cursor-pointer 
              ${
                navigationId === "best-sellers"
                  ? "bg-[#76B432] hover:bg-[#76B432] text-slate-100 border-2 border-slate-300 shadow-emerald-900/20"
                  : "bg-[#76B432] hover:bg-[#76B432]  text-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-600 dark:text-emerald-400 dark:hover:bg-slate-700"
              }`}
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Next Button */}
          <button
            className={`custom-next-${navigationId} absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all duration-200 active:scale-95 cursor-pointer
              ${
                navigationId === "best-sellers"
                  ? "bg-[#76B432] hover:bg-[#76B432] text-slate-100 border-2 border-slate-300 shadow-emerald-900/20"
                  : "bg-[#76B432] hover:bg-[#76B432]  text-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-600 dark:text-emerald-400 dark:hover:bg-slate-700"
              }`}
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Background Highlight Accent */}
          {navigationId === "best-sellers" && (
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full h-[130px] z-0 rounded-2xl pointer-events-none opacity-15 "
              aria-hidden="true"
            />
          )}

          {/* Swiper Component */}
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            observer={true}
            observeParents={true}
            resizeObserver={true}
            onSwiper={(swiper) => {
              setTimeout(() => {
                swiper.update();
              }, 100);
            }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: `.custom-next-${navigationId}`,
              prevEl: `.custom-prev-${navigationId}`,
            }}
            breakpoints={
              cardType === "horizontal"
                ? {
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 2 },
                    1280: { slidesPerView: 2 },
                  }
                : {
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                  }
            }
            className="!pb-2 z-10 w-full min-w-0"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id || product._id || product.slug} className="h-auto">
                <div className="h-full py-1">
                  {cardType === "horizontal" ? (
                    <PopularCard product={product} />
                  ) : (
                    <ProductCard product={product} />
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}