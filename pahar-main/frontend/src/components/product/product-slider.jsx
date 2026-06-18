"use client"

import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"

import ProductCard from "./product-card"

export default function ProductSlider({ products = [] }) {
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
              <button className="custom-prev flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:bg-amber-50 hover:text-amber-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="custom-next flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:bg-amber-50 hover:text-amber-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-400">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button className="flex items-center gap-1 rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10">
              View All
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="!pb-2"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="h-full transition-transform duration-300 hover:-translate-y-1">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
