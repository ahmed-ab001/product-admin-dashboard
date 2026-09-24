"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

/**
 * ProductModal — modal form for creating or editing a product.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {(productData: object) => Promise<void>} onSubmit
 * @param {object|null} product — null for create, product object for edit
 * @param {Array<{ slug: string; name: string }>} categories
 * @param {boolean} loading
 */
export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product = null,
  categories = [],
  loading = false,
}) {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        brand: product.brand || "",
        category: product.category || (categories[0]?.slug || ""),
        price: product.price !== undefined ? String(product.price) : "",
        stock: product.stock !== undefined ? String(product.stock) : "",
        description: product.description || "",
      });
    } else {
      setFormData({
        title: "",
        brand: "",
        category: categories[0]?.slug || "smartphones",
        price: "",
        stock: "",
        description: "",
      });
    }
    setErrors({});
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Enter a valid positive price";
    }
    if (
      formData.stock === "" ||
      isNaN(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock = "Enter a valid stock quantity";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isEditing
                ? "Update product details in the catalog"
                : "Fill in product specifications to add it to inventory"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="product-title" className="block text-xs font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="product-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`w-full rounded-xl border px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-indigo-600 focus:ring-indigo-100"
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          {/* Brand & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-brand" className="block text-xs font-semibold text-gray-700 mb-1">
                Brand
              </label>
              <input
                id="product-brand"
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony"
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="product-category-input" className="block text-xs font-semibold text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="product-category-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-600 mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="block text-xs font-semibold text-gray-700 mb-1">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="99.99"
                className={`w-full rounded-xl border px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.price
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-indigo-600 focus:ring-indigo-100"
                }`}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="product-stock" className="block text-xs font-semibold text-gray-700 mb-1">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="product-stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className={`w-full rounded-xl border px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 ${
                  errors.stock
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-indigo-600 focus:ring-indigo-100"
                }`}
              />
              {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="product-desc" className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="product-desc"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product summary and key specifications..."
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-sm text-gray-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              id="product-modal-submit-btn"
            >
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
