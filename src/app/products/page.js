"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { getProducts, searchProducts } from "@/services/productService";
import PageWrapper from "@/components/layout/PageWrapper";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = debouncedQuery.trim()
        ? await searchProducts(debouncedQuery.trim(), { limit: 10 })
        : await getProducts({ limit: 10 });
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err?.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "Admin";

  return (
    <PageWrapper className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Session Active
              </span>
              <span className="text-xs text-gray-400">&bull;</span>
              <span className="text-xs text-gray-500 font-mono">
                @{user?.username || "user"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your catalog inventory and monitor products in real time.
            </p>
          </div>
          {user?.image && (
            <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-200/60 self-start sm:self-center">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-indigo-50 border border-indigo-100">
                <Image
                  src={user.image}
                  alt={displayName}
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-left pr-2">
                <p className="text-xs font-semibold text-gray-900">{displayName}</p>
                <p className="text-[11px] text-gray-500 truncate max-w-[140px]">
                  {user.email || "admin@example.com"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Total Products</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Products on Page</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              {products.length}
            </p>
          </div>
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Auth Status</p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1">
              Protected
            </p>
          </div>
          <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-medium text-gray-500">Role</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Products Catalog Section */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Products Catalog</h2>
            <p className="text-xs text-gray-500">
              Showing active inventory items from DummyJSON API
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="search-products-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <Button
              variant="secondary"
              size="md"
              onClick={fetchProducts}
              disabled={loading}
              title="Refresh products list"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-20">
            <LoadingSpinner size="lg" label="Loading product catalog..." />
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorState message={error} onRetry={fetchProducts} />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No products found"
              description={
                searchQuery
                  ? `No products matched "${searchQuery}". Try a different keyword.`
                  : "No products available in this category."
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th scope="col" className="py-3.5 px-4 sm:px-6">Product</th>
                  <th scope="col" className="py-3.5 px-4 hidden md:table-cell">Category</th>
                  <th scope="col" className="py-3.5 px-4">Price</th>
                  <th scope="col" className="py-3.5 px-4 hidden sm:table-cell">Stock</th>
                  <th scope="col" className="py-3.5 px-4 hidden lg:table-cell">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200/50">
                          {p.thumbnail && (
                            <Image
                              src={p.thumbnail}
                              alt={p.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 leading-snug line-clamp-1">
                            {p.title}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {p.brand || "Standard"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      ${p.price?.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.stock > 10
                            ? "bg-green-50 text-green-700"
                            : p.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-gray-600 text-xs">
                      ★ {p.rating?.toFixed(1) || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
