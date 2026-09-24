"use client";

import Image from "next/image";

/**
 * Mobile-optimized product card list with action buttons.
 */
export default function ProductCardList({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
}) {
  return (
    <div className="block md:hidden divide-y divide-gray-100">
      {products.map((product) => {
        const hasStock = product.stock > 0;
        const isLowStock = product.stock > 0 && product.stock <= 10;

        return (
          <div
            key={product.id}
            className="p-4 sm:p-5 flex flex-col gap-3 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Product Thumbnail */}
              <div className="relative w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200/60 shadow-xs">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No img
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 capitalize">
                    {product.category}
                  </span>
                  <span className="font-bold text-gray-900 text-base">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2 leading-snug">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between mt-3 text-xs">
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-gray-700">
                    <svg
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>

                  {/* Stock Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      !hasStock
                        ? "bg-red-50 text-red-700"
                        : isLowStock
                        ? "bg-amber-50 text-amber-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
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
                </div>
              </div>
            </div>

            {/* Mobile Actions Toolbar */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
              {onViewProduct && (
                <button
                  type="button"
                  onClick={() => onViewProduct(product)}
                  className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  View
                </button>
              )}
              {onEditProduct && (
                <button
                  type="button"
                  onClick={() => onEditProduct(product)}
                  className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-amber-600 bg-gray-50 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  Edit
                </button>
              )}
              {onDeleteProduct && (
                <button
                  type="button"
                  onClick={() => onDeleteProduct(product)}
                  className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
