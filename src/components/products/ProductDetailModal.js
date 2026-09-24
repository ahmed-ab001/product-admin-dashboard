"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";

/**
 * ProductDetailModal — provides a detailed view of a product's attributes.
 */
export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  onEdit,
}) {
  if (!isOpen || !product) return null;

  const hasStock = product.stock > 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

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

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs font-semibold text-indigo-600">
                  {product.brand}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6">
          {/* Main Image */}
          <div className="relative h-64 w-full rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, 320px"
                className="object-contain p-4"
                unoptimized
              />
            ) : (
              <span className="text-gray-400 text-sm">No preview image</span>
            )}
          </div>

          {/* Quick Stats & Details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <p className="text-3xl font-extrabold text-gray-900">
                ${Number(product.price).toFixed(2)}
                {product.discountPercentage ? (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md ml-2 inline-block align-middle">
                    -{product.discountPercentage}% OFF
                  </span>
                ) : null}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-500">
                  <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-gray-900">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>
                </div>
                <span className="text-gray-300">&bull;</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    !hasStock
                      ? "bg-red-50 text-red-700"
                      : isLowStock
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {!hasStock
                    ? "Out of stock"
                    : isLowStock
                    ? `Low Stock (${product.stock})`
                    : `${product.stock} in stock`}
                </span>
              </div>
            </div>

            <div className="bg-gray-50/80 rounded-xl p-3.5 border border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-400">SKU</span>
                <span className="font-mono font-medium text-gray-900">
                  {product.sku || `PRD-${product.id}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Warranty</span>
                <span className="font-medium text-gray-900">
                  {product.warrantyInformation || "1 Year Standard"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="font-medium text-gray-900">
                  {product.shippingInformation || "Standard 3-5 days"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Description
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onEdit(product);
              }}
            >
              Edit Product
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
