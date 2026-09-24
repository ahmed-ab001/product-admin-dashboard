"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import axios from "axios";
import { fetchProductsCatalog } from "@/services/productService";
import { getCategories } from "@/services/categoryService";

const VALID_LIMITS = [10, 20, 50];
const VALID_SORTS = [
  "price-asc",
  "price-desc",
  "rating-asc",
  "rating-desc",
  "title-asc",
  "title-desc",
];

/**
 * Normalizes query parameters from the URL safely.
 */
function parseUrlParams(searchParams) {
  // Page
  const rawPage = parseInt(searchParams.get("page"), 10);
  const page = !isNaN(rawPage) && rawPage >= 1 ? rawPage : 1;

  // Limit
  const rawLimit = parseInt(searchParams.get("limit"), 10);
  const limit = VALID_LIMITS.includes(rawLimit) ? rawLimit : 10;

  // Search
  const search = searchParams.get("search") || "";

  // Category
  const category = searchParams.get("category") || "";

  // Sort
  const rawSort = searchParams.get("sort") || "";
  const sort = VALID_SORTS.includes(rawSort) ? rawSort : "";

  return { page, limit, search, category, sort };
}

/**
 * Central custom hook managing products catalog state, URL synchronization,
 * search debouncing, AbortController cancellation, categories, and pagination.
 */
export function useProducts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract normalized state from current URL
  const { page, limit, search, category, sort } = useMemo(
    () => parseUrlParams(searchParams),
    [searchParams]
  );

  // Local state
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Controlled search input for immediate visual feedback
  const [searchInput, setSearchInput] = useState(search);

  // Available categories list
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Active AbortController to cancel older in-flight requests (prevent race conditions)
  const abortControllerRef = useRef(null);

  // Sync search input if URL changes externally (e.g. Back/Forward button)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Load categories list on initial mount
  useEffect(() => {
    let ignore = false;
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (!ignore && Array.isArray(data)) {
          const normalized = data.map((item) =>
            typeof item === "object" && item !== null
              ? { slug: item.slug, name: item.name || item.slug }
              : { slug: item, name: item }
          );
          setCategories(normalized);
        }
      } catch (err) {
        if (!ignore && !axios.isCancel(err)) {
          console.error("Failed to load categories:", err);
        }
      } finally {
        if (!ignore) {
          setCategoriesLoading(false);
        }
      }
    }
    loadCategories();
    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Helper to push updated params to the URL without triggering full page reloads.
   */
  const updateUrl = useCallback(
    (newParams) => {
      const current = parseUrlParams(searchParams);
      const merged = { ...current, ...newParams };

      const params = new URLSearchParams();

      if (merged.page > 1) {
        params.set("page", String(merged.page));
      }
      if (merged.limit !== 10) {
        params.set("limit", String(merged.limit));
      }
      if (merged.search.trim()) {
        params.set("search", merged.search.trim());
      }
      if (merged.category.trim()) {
        params.set("category", merged.category.trim());
      }
      if (merged.sort) {
        params.set("sort", merged.sort);
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  /**
   * Debounce search input: automatically updates URL with search term after 350ms of inactivity.
   * Resets page to 1 whenever search changes.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        updateUrl({ search: searchInput, page: 1 });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput, search, updateUrl]);

  /**
   * Main data fetcher.
   * Cancels in-flight requests using AbortController so old search/filter responses
   * never overwrite newer responses.
   */
  const loadProducts = useCallback(async () => {
    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchProductsCatalog({
        page,
        limit,
        search,
        category,
        sort,
        signal: controller.signal,
      });

      setProducts(result.products || []);
      const totalCount = result.total || 0;
      setTotal(totalCount);

      // Normalize page if URL page exceeds available total pages
      const computedTotalPages = Math.ceil(totalCount / limit) || 1;
      if (page > computedTotalPages && totalCount > 0) {
        updateUrl({ page: computedTotalPages });
      }
    } catch (err) {
      // Ignore cancelled request errors
      if (
        axios.isCancel(err) ||
        err?.name === "CanceledError" ||
        err?.message === "canceled"
      ) {
        return;
      }
      setError(err?.message || "Failed to load products. Please try again.");
    } finally {
      // Only reset loading if this is the active controller
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [page, limit, search, category, sort, updateUrl]);

  // Re-fetch products whenever URL params change
  useEffect(() => {
    loadProducts();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadProducts]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(total / limit) || 1);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const skip = (currentPage - 1) * limit;
  const startItem = total === 0 ? 0 : skip + 1;
  const endItem = Math.min(skip + limit, total);
  const showingText = `Showing ${startItem}–${endItem} of ${total}`;

  // Action handlers
  const handlePageChange = useCallback(
    (newPage) => {
      const validPage = Math.min(Math.max(1, newPage), totalPages);
      if (validPage !== page) {
        updateUrl({ page: validPage });
      }
    },
    [page, totalPages, updateUrl]
  );

  const handleLimitChange = useCallback(
    (newLimit) => {
      const parsed = parseInt(newLimit, 10);
      if (VALID_LIMITS.includes(parsed) && parsed !== limit) {
        updateUrl({ limit: parsed, page: 1 });
      }
    },
    [limit, updateUrl]
  );

  const handleCategoryChange = useCallback(
    (newCategory) => {
      if (newCategory !== category) {
        updateUrl({ category: newCategory, page: 1 });
      }
    },
    [category, updateUrl]
  );

  const handleSortChange = useCallback(
    (newSort) => {
      if (newSort !== sort) {
        updateUrl({ sort: newSort, page: 1 });
      }
    },
    [sort, updateUrl]
  );

  const clearFilters = useCallback(() => {
    setSearchInput("");
    updateUrl({ search: "", category: "", sort: "", page: 1 });
  }, [updateUrl]);

  return {
    products,
    total,
    totalPages,
    currentPage,
    limit,
    search,
    searchInput,
    setSearchInput,
    category,
    categories,
    categoriesLoading,
    sort,
    loading,
    error,
    showingText,
    handlePageChange,
    handleLimitChange,
    handleCategoryChange,
    handleSortChange,
    clearFilters,
    refetch: loadProducts,
  };
}

export default useProducts;
