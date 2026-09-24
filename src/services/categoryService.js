import apiClient from "@/lib/axios";

/**
 * Fetch all available product categories.
 * Returns an array of category objects: { slug, name, url }
 *
 * @returns {Promise<Array<{ slug: string; name: string; url: string }>>}
 */
export async function getCategories() {
  const { data } = await apiClient.get("/products/categories");
  return data;
}

/**
 * Fetch products filtered by a specific category slug.
 *
 * @param {string} slug          — category slug e.g. "smartphones"
 * @param {{ limit?: number; skip?: number }} options
 * @returns {Promise<{ products: object[]; total: number; skip: number; limit: number }>}
 */
export async function getProductsByCategory(slug, { limit = 10, skip = 0 } = {}) {
  const { data } = await apiClient.get(`/products/category/${slug}`, {
    params: { limit, skip },
  });
  return data;
}
