import apiClient from "@/lib/axios";

/**
 * Fetch a paginated list of products with optional sorting and cancellation.
 *
 * @param {{ limit?: number; skip?: number; sortBy?: string; order?: 'asc'|'desc'; signal?: AbortSignal }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function getProducts({
  limit = 10,
  skip = 0,
  sortBy,
  order,
  signal,
} = {}) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const { data } = await apiClient.get("/products", {
    params,
    signal,
  });
  return data;
}

/**
 * Fetch a single product by ID.
 *
 * @param {number|string} id
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<object>}
 */
export async function getProductById(id, { signal } = {}) {
  const { data } = await apiClient.get(`/products/${id}`, { signal });
  return data;
}

/**
 * Search products by a query string with optional sorting and cancellation.
 *
 * @param {string} query
 * @param {{ limit?: number; skip?: number; sortBy?: string; order?: 'asc'|'desc'; signal?: AbortSignal }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function searchProducts(
  query,
  { limit = 10, skip = 0, sortBy, order, signal } = {}
) {
  const params = { q: query, limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const { data } = await apiClient.get("/products/search", {
    params,
    signal,
  });
  return data;
}

/**
 * Fetch all products belonging to a specific category.
 *
 * @param {string} category  — slug as returned by /products/categories
 * @param {{ limit?: number; skip?: number; sortBy?: string; order?: 'asc'|'desc'; signal?: AbortSignal }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function getProductsByCategory(
  category,
  { limit = 10, skip = 0, sortBy, order, signal } = {}
) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const { data } = await apiClient.get(
    `/products/category/${encodeURIComponent(category)}`,
    {
      params,
      signal,
    }
  );
  return data;
}

/**
 * High-level product catalog fetcher combining search, category, sort, and pagination.
 *
 * Strategy for Combined Search + Category:
 * DummyJSON does not natively support querying /products/search with a category filter,
 * nor /products/category with a search query.
 * When BOTH search and category are active:
 * 1. We query /products/category/{category}?limit=0 to retrieve all items in that category.
 * 2. We filter the items by the search keyword client-side.
 * 3. We apply the requested sort and slice the paginated window.
 *
 * @param {{
 *   page?: number;
 *   limit?: number;
 *   search?: string;
 *   category?: string;
 *   sort?: string;
 *   signal?: AbortSignal;
 * }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function fetchProductsCatalog({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sort = "",
  signal,
} = {}) {
  // Parse sort string, e.g. "price-asc" -> sortBy: "price", order: "asc"
  let sortBy;
  let order;
  if (sort && sort.includes("-")) {
    const [field, dir] = sort.split("-");
    if (["price", "rating", "title"].includes(field) && ["asc", "desc"].includes(dir)) {
      sortBy = field;
      order = dir;
    }
  }

  const cleanSearch = search.trim();
  const cleanCategory = category.trim();
  const skip = (Math.max(1, page) - 1) * limit;

  // Case 1: Both search and category are active
  if (cleanSearch && cleanCategory) {
    // Fetch all items from the selected category
    const catData = await apiClient.get(
      `/products/category/${encodeURIComponent(cleanCategory)}`,
      {
        params: { limit: 0 },
        signal,
      }
    );

    const allCatProducts = catData.data?.products || [];
    const lowerQuery = cleanSearch.toLowerCase();

    // Client-side keyword filter
    let filtered = allCatProducts.filter((p) => {
      const matchTitle = p.title?.toLowerCase().includes(lowerQuery);
      const matchBrand = p.brand?.toLowerCase().includes(lowerQuery);
      const matchDesc = p.description?.toLowerCase().includes(lowerQuery);
      return matchTitle || matchBrand || matchDesc;
    });

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
    }

    const total = filtered.length;
    const paginatedProducts = filtered.slice(skip, skip + limit);

    return {
      products: paginatedProducts,
      total,
      skip,
      limit,
    };
  }

  // Case 2: Only search is active
  if (cleanSearch) {
    return searchProducts(cleanSearch, { limit, skip, sortBy, order, signal });
  }

  // Case 3: Only category is active
  if (cleanCategory) {
    return getProductsByCategory(cleanCategory, { limit, skip, sortBy, order, signal });
  }

  // Case 4: Default list (neither search nor category)
  return getProducts({ limit, skip, sortBy, order, signal });
}

/**
 * Create a new product.
 *
 * @param {object} productData
 * @returns {Promise<object>}
 */
export async function createProduct(productData) {
  const { data } = await apiClient.post("/products/add", productData);
  return data;
}

/**
 * Update an existing product by ID.
 *
 * @param {number|string} id
 * @param {object} productData
 * @returns {Promise<object>}
 */
export async function updateProduct(id, productData) {
  const { data } = await apiClient.put(`/products/${id}`, productData);
  return data;
}

/**
 * Delete a product by ID.
 *
 * @param {number|string} id
 * @returns {Promise<{ isDeleted: boolean; deletedOn: string }>}
 */
export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/products/${id}`);
  return data;
}
