"use client";

export default function ProductToolbar({
  searchInput,
  setSearchInput,
  category,
  categories,
  categoriesLoading,
  sort,
  limit,
  onCategoryChange,
  onSortChange,
  onLimitChange,
  onClearFilters,
  onAddProduct,
  total,
  hasActiveFilters,
}) {
  const selectedCategoryObj = categories.find((c) => c.slug === category);
  const categoryDisplayName = selectedCategoryObj?.name || category;

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            id="product-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by title, brand, description..."
            className="block w-full rounded-xl border border-gray-300 bg-white pl-10 pr-9 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          {searchInput && (
            <button
              type="button"
              id="clear-search-btn"
              onClick={() => setSearchInput("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters & Actions Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative">
            <label htmlFor="category-select" className="sr-only">
              Filter by Category
            </label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={categoriesLoading}
              className="rounded-xl border border-gray-300 bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <label htmlFor="sort-select" className="sr-only">
              Sort Products
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white py-2 pl-3.5 pr-8 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
            >
              <option value="">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
            </select>
          </div>

          {/* Page Size Selector */}
          <div className="relative flex items-center gap-1.5">
            <label htmlFor="limit-select" className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">
              Per page:
            </label>
            <select
              id="limit-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded-xl border border-gray-300 bg-white py-2 pl-3 pr-7 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              id="reset-filters-btn"
              onClick={onClearFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition-colors px-3 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          )}

          {/* Add Product Button */}
          {onAddProduct && (
            <button
              type="button"
              id="add-product-btn"
              onClick={onAddProduct}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-indigo-100 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Product</span>
            </button>
          )}
        </div>
      </div>

      {/* Explicit Combined Strategy Notice */}
      {searchInput.trim() && category && (
        <div className="flex items-center justify-between rounded-xl bg-indigo-50/80 border border-indigo-100 px-4 py-2.5 text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Searching for <strong>&ldquo;{searchInput}&rdquo;</strong> filtered within category <strong>&ldquo;{categoryDisplayName}&rdquo;</strong> ({total} match{total === 1 ? "" : "es"}).
            </span>
          </div>
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className="text-indigo-600 hover:text-indigo-900 underline font-medium ml-2 shrink-0"
          >
            Search all categories instead
          </button>
        </div>
      )}
    </div>
  );
}
