import apiClient from "@/lib/axios";

/**
 * Fetch a paginated list of products.
 *
 * @param {{ limit?: number; skip?: number }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function getProducts({ limit = 10, skip = 0 } = {}) {
  const { data } = await apiClient.get("/products", {
    params: { limit, skip },
  });
  return data;
}

/**
 * Fetch a single product by ID.
 *
 * @param {number|string} id
 * @returns {Promise<object>}
 */
export async function getProductById(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
}

/**
 * Search products by a query string.
 *
 * @param {string} query
 * @param {{ limit?: number; skip?: number }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function searchProducts(query, { limit = 10, skip = 0 } = {}) {
  const { data } = await apiClient.get("/products/search", {
    params: { q: query, limit, skip },
  });
  return data;
}

/**
 * Create a new product.
 * Note: DummyJSON fakes the write — it returns the created object but does not
 * persist it across requests.
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

/**
 * Fetch all products belonging to a specific category.
 *
 * @param {string} category  — slug as returned by /products/categories
 * @param {{ limit?: number; skip?: number }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function getProductsByCategory(category, { limit = 10, skip = 0 } = {}) {
  const { data } = await apiClient.get(`/products/category/${category}`, {
    params: { limit, skip },
  });
  return data;
}
