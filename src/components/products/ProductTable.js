"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Custom HTML table representation of the products list for desktop screens.
 * Strictly avoids table libraries in compliance with requirements.
 * Product title links to /products/[id] for the dedicated detail page.
 */
export default function ProductTable({
  products,
  onEditProduct,
  onDeleteProduct,
}) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th scope="col" className="py-3.5 px-6">Product</th>
            <th scope="col" className="py-3.5 px-4">Category</th>
            <th scope="col" className="py-3.5 px-4">Price</th>
            <th scope="col" className="py-3.5 px-4">Rating</th>
            <th scope="col" className="py-3.5 px-6">Stock Status</th>
            <th scope="col" className="py-3.5 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {products.map((product) => {
            const hasStock = product.stock > 0;
            const isLowStock = product.stock > 0 && product.stock <= 10;

            return (
              <tr
                key={product.id}
                className="hover:bg-gray-50/70 transition-colors group"
              >
                {/* Product Image + Title */}
                <td className="py-3.5 px-6">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200/60 shadow-xs">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          sizes="48px"
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-semibold text-gray-900 leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors hover:underline"
                      >
                        {product.title}
                      </Link>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">
                        {product.brand || "Generic"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-gray-900 text-base">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </td>

                {/* Rating */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {Number(product.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Stock Status */}
                <td className="py-3.5 px-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      !hasStock
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : isLowStock
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        !hasStock
                          ? "bg-red-500"
                          : isLowStock
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    {!hasStock
                      ? "Out of stock"
                      : isLowStock
                      ? `Low (${product.stock})`
                      : `${product.stock} in stock`}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="py-3.5 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* View Details — navigates to /products/[id] */}
                    <Link
                      href={`/products/${product.id}`}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Details"
                      aria-label={`View details for ${product.title}`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>

                    {onEditProduct && (
                      <button
                        type="button"
                        onClick={() => onEditProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Product"
                        aria-label={`Edit ${product.title}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}

                    {onDeleteProduct && (
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(product)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                        aria-label={`Delete ${product.title}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
