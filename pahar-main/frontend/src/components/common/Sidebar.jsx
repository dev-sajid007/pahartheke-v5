export default function ShopSidebar({
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  selectedTags,
  toggleTag,
  inStockOnly,
  setInStockOnly,
  setShowFilter,
  categories = [],
  tags = [],
}) {
  return (
    <div className="bg-white border border-[#e2ead8] rounded-2xl p-5">
      {/* CATEGORY */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">
          Categories
        </h3>

        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setCategory(cat.value);

                if (setShowFilter) {
                  setShowFilter(false);
                }
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${
                category === cat.value
                  ? "bg-green-100 text-green-800 font-bold"
                  : "hover:bg-green-50 text-gray-600"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* PRICE */}
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">
          Price Range
        </h3>

        <input
          type="range"
          min="0"
          max="2000"
          step="50"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-green-700"
        />

        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-500">৳0</span>

          <span className="font-bold text-green-700">
            ৳{maxPrice}
          </span>
        </div>
      </div>

      {/* TAGS */}
      {tags.length > 0 && (
      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 mb-4">
          Tags
        </h3>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
                selectedTags.includes(tag)
                  ? "bg-green-100 border-green-300 text-green-700"
                  : "border-gray-200 text-gray-500 hover:border-green-400"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      )}

      {/* STOCK */}
      <div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-green-700"
          />

          In stock only
        </label>
      </div>
    </div>
  );
}