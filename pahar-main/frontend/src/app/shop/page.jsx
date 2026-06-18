"use client";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ShopSidebar from "@/components/common/Sidebar";
import { useMemo, useState } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Kalo Jeera Honey",
    desc: "Pure raw black seed honey from Chittagong hills",
    price: 480,
    originalPrice: 600,
    badge: "Organic",
    emoji: "🍯",
    category: "honey-bee",
    tags: ["Organic", "Raw"],
    inStock: true,
    isNew: false,
  },
  {
    id: 2,
    name: "Red Aromatic Rice",
    desc: "Fragrant heirloom red rice grown without pesticides",
    price: 180,
    originalPrice: null,
    badge: "Hilltract",
    emoji: "🌾",
    category: "rice-grains",
    tags: ["Hilltract", "Natural"],
    inStock: true,
    isNew: false,
  },
  {
    id: 3,
    name: "Wild Turmeric Powder",
    desc: "Stone-ground wild turmeric from Bandarban highlands",
    price: 220,
    originalPrice: 280,
    badge: "Organic",
    emoji: "🟡",
    category: "spices-herbs",
    tags: ["Organic", "Traditional"],
    inStock: true,
    isNew: false,
  },
  {
    id: 4,
    name: "Dried Hill Jackfruit",
    desc: "Sun-dried jackfruit chips, no added sugar or preservatives",
    price: 150,
    originalPrice: null,
    badge: null,
    emoji: "🍈",
    category: "fruits-dry",
    tags: ["Seasonal", "Natural"],
    inStock: true,
    isNew: true,
  },
  {
    id: 5,
    name: "Mustard Hill Oil",
    desc: "Cold-pressed pure mustard oil from local mustard seeds",
    price: 320,
    originalPrice: 380,
    badge: "Organic",
    emoji: "🫙",
    category: "oils-ghee",
    tags: ["Organic", "Raw"],
    inStock: true,
    isNew: false,
  },
  {
    id: 6,
    name: "Forest Beeswax Honey",
    desc: "Raw unfiltered beeswax honey with natural pollen",
    price: 550,
    originalPrice: 700,
    badge: "Organic",
    emoji: "🐝",
    category: "honey-bee",
    tags: ["Organic", "Raw", "Natural"],
    inStock: true,
    isNew: false,
  },
];

const CATEGORIES = [
  { label: "All Products", value: "" },
  { label: "Rice & Grains", value: "rice-grains" },
  { label: "Honey & Bee", value: "honey-bee" },
  { label: "Spices & Herbs", value: "spices-herbs" },
  { label: "Fruits & Dry", value: "fruits-dry" },
  { label: "Oils & Ghee", value: "oils-ghee" },
];

const TAGS = [
  "Organic",
  "Hilltract",
  "Raw",
  "Natural",
  "Seasonal",
  "Traditional",
];

export default function ShopPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [showFilter, setShowFilter] = useState(false);

  const filteredProducts = useMemo(() => {
    let items = [...PRODUCTS];

    if (category) {
      items = items.filter((item) => item.category === category);
    }

    if (search) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.desc.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedTags.length) {
      items = items.filter((item) =>
        selectedTags.every((tag) => item.tags.includes(tag))
      );
    }

    items = items.filter((item) => item.price <= maxPrice);

    if (inStockOnly) {
      items = items.filter((item) => item.inStock);
    }

    if (sort === "price-asc") {
      items.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      items.sort((a, b) => b.price - a.price);
    }

    if (sort === "newest") {
      items.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    }

    return items;
  }, [category, search, selectedTags, maxPrice, inStockOnly, sort]);

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // const Sidebar = () => (
  //   <div className="bg-white border border-[#e2ead8] rounded-2xl p-5">
  //     {/* CATEGORY */}
  //     <div className="mb-6">
  //       <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">
  //         Categories
  //       </h3>

  //       <div className="space-y-2">
  //         {CATEGORIES.map((cat) => (
  //           <button
  //             key={cat.value}
  //             onClick={() => {
  //               setCategory(cat.value);
  //               setShowFilter(false);
  //             }}
  //             className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${
  //               category === cat.value
  //                 ? "bg-green-100 text-green-800 font-bold"
  //                 : "hover:bg-green-50 text-gray-600"
  //             }`}
  //           >
  //             {cat.label}
  //           </button>
  //         ))}
  //       </div>
  //     </div>

  //     {/* PRICE */}
  //     <div className="mb-6">
  //       <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">
  //         Price Range
  //       </h3>

  //       <input
  //         type="range"
  //         min="0"
  //         max="2000"
  //         step="50"
  //         value={maxPrice}
  //         onChange={(e) => setMaxPrice(Number(e.target.value))}
  //         className="w-full accent-green-700"
  //       />

  //       <div className="flex justify-between mt-2 text-sm">
  //         <span className="text-gray-500">৳0</span>

  //         <span className="font-bold text-green-700">
  //           ৳{maxPrice}
  //         </span>
  //       </div>
  //     </div>

  //     {/* TAGS */}
  //     <div className="mb-6">
  //       <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">
  //         Tags
  //       </h3>

  //       <div className="flex flex-wrap gap-2">
  //         {TAGS.map((tag) => (
  //           <button
  //             key={tag}
  //             onClick={() => toggleTag(tag)}
  //             className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
  //               selectedTags.includes(tag)
  //                 ? "bg-green-100 border-green-300 text-green-700"
  //                 : "border-gray-200 text-gray-500 hover:border-green-400"
  //             }`}
  //           >
  //             {tag}
  //           </button>
  //         ))}
  //       </div>
  //     </div>

  //     {/* STOCK */}
  //     <div>
  //       <label className="flex items-center gap-2 text-sm text-gray-600">
  //         <input
  //           type="checkbox"
  //           checked={inStockOnly}
  //           onChange={(e) => setInStockOnly(e.target.checked)}
  //           className="accent-green-700"
  //         />

  //         In stock only
  //       </label>
  //     </div>
  //   </div>
  // );

  return (
<>

<Header/>

    <div className="min-h-screen bg-[#faf7f0] text-[#1a2e1a]">
      {/* HERO */}
      <section className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 flex items-center justify-between gap-5">
          <div>
            <p className="text-xs sm:text-sm opacity-70 mb-2">
              Home › Shop
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
              Hill Tract Organics
            </h1>

            <p className="text-sm sm:text-base opacity-80 max-w-xl">
              Direct from local farmers of Chittagong & Rangamati
            </p>
          </div>

          <div className="hidden md:block text-7xl opacity-20">
            🌄
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-5 lg:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block sticky top-20 h-fit">
            <ShopSidebar
                category={category}
                setCategory={setCategory}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedTags={selectedTags}
                toggleTag={toggleTag}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
            />
          </aside>

          {/* CONTENT */}
          <div>
            {/* MOBILE FILTER BTN */}
            <button
              onClick={() => setShowFilter(true)}
              className="lg:hidden mb-4 w-full bg-white border border-[#e2ead8] rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2"
            >
              ⚙️ Filters
            </button>

            {/* SEARCH BAR */}
            <div className="bg-white border border-[#e2ead8] rounded-2xl p-3 sm:p-4 flex flex-col lg:flex-row gap-3 lg:items-center justify-between mb-5">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-600"
              />

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">
                    Price Low to High
                  </option>
                  <option value="price-desc">
                    Price High to Low
                  </option>
                  <option value="newest">Newest</option>
                </select>

                <span className="text-sm text-gray-500 font-semibold whitespace-nowrap">
                  {filteredProducts.length} products
                </span>
              </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product) => {
                const discount = product.originalPrice
                  ? Math.round(
                      (1 -
                        product.price / product.originalPrice) *
                        100
                    )
                  : null;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-[#e2ead8] rounded-2xl overflow-hidden hover:-translate-y-1 transition duration-300"
                  >
                    {/* IMAGE */}
                    <div className="h-32 sm:h-40 md:h-44 bg-[#f4ede0] flex items-center justify-center relative">
                      <span className="text-5xl sm:text-6xl">
                        {product.emoji}
                      </span>

                      {discount && (
                        <span className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      )}

                      {!discount && product.badge && (
                        <span className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* BODY */}
                    <div className="p-3 sm:p-4">
                      <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-[11px] sm:text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                        {product.desc}
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-base sm:text-lg font-bold text-green-700">
                              ৳{product.price}
                            </span>

                            {product.originalPrice && (
                              <span className="text-xs sm:text-sm text-gray-400 line-through">
                                ৳{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          disabled={!product.inStock}
                          className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                            product.inStock
                              ? "bg-green-700 text-white hover:bg-green-900"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {product.inStock
                            ? "Add to Cart"
                            : "Out Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* EMPTY */}
            {!filteredProducts.length && (
              <div className="text-center py-16 text-gray-500">
                <h3 className="text-xl font-bold mb-2">
                  No products found
                </h3>

                <p>Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MOBILE DRAWER */}
      {showFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* overlay */}
          <div
            onClick={() => setShowFilter(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* drawer */}
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-[#faf7f0] p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Filters</h2>

              <button
                onClick={() => setShowFilter(false)}
                className="text-sm font-semibold"
              >
                ✕ Close
              </button>
            </div>

            <ShopSidebar 
              category={category}
              setCategory={setCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedTags={selectedTags}
              toggleTag={toggleTag}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              setShowFilter={setShowFilter}
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <Footer/>
    </div>
</>
  );
}