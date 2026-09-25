"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/services/productService";
import { createProduct, updateProduct, deleteProduct } from "@/services/productService";
import { useProductMutations } from "@/context/ProductMutationsContext";
import { getCategories } from "@/services/categoryService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import ProductModal from "@/components/products/ProductModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast from "@/components/ui/Toast";

// ── Star Rating Display ───────────────────────────────────────────────────────
function StarRating({ rating = 0, reviewCount }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= full ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-900">
        {Number(rating).toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-400">
          ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}

// ── Stock Badge ───────────────────────────────────────────────────────────────
function StockBadge({ stock }) {
  const outOfStock = stock === 0;
  const lowStock = stock > 0 && stock <= 10;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
        outOfStock
          ? "bg-red-50 text-red-700 border border-red-200"
          : lowStock
          ? "bg-amber-50 text-amber-700 border border-amber-200"
          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          outOfStock ? "bg-red-500" : lowStock ? "bg-amber-500" : "bg-emerald-500"
        }`}
      />
      {outOfStock ? "Out of Stock" : lowStock ? `Low Stock — ${stock} left` : `${stock} in stock`}
    </span>
  );
}

// ── Review Card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }) {
  const stars = Math.round(review.rating || 0);
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {review.reviewerName || "Anonymous"}
          </p>
          {review.date && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(review.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <svg
              key={s}
              className={`w-3.5 h-3.5 ${s <= stars ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}

// ── Image Gallery ─────────────────────────────────────────────────────────────
function ImageGallery({ images = [], thumbnail, title }) {
  const allImages = Array.from(
    new Set([thumbnail, ...images].filter(Boolean))
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-64 sm:h-80 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        No images available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
        <Image
          src={allImages[activeIndex]}
          alt={`${title} — image ${activeIndex + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
          className="object-contain p-4"
          unoptimized
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                idx === activeIndex
                  ? "border-indigo-500 shadow-md shadow-indigo-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Not Found State ───────────────────────────────────────────────────────────
function ProductNotFound({ id }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="mb-6 flex items-center justify-center w-24 h-24 rounded-full bg-red-50">
        <svg
          className="w-12 h-12 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
      <p className="text-gray-500 max-w-md mb-8">
        {id
          ? `No product with ID "${id}" exists in the catalog. It may have been removed or the ID is invalid.`
          : "This product does not exist or the ID is invalid."}
      </p>
      <Link href="/products">
        <Button variant="primary" size="lg">
          ← Back to Products
        </Button>
      </Link>
    </div>
  );
}

// ── Detail Skeleton ───────────────────────────────────────────────────────────
function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-6 w-32 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-80 bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
          <div className="h-10 w-28 bg-gray-200 rounded" />
          <div className="h-4 w-36 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { applyToProduct, recordEdit, recordDelete } = useProductMutations();

  const [rawProduct, setRawProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // CRUD modal state
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const lockRef = useRef(false);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  // Load categories for the edit modal
  useEffect(() => {
    let ignore = false;
    getCategories()
      .then((data) => {
        if (!ignore && Array.isArray(data)) {
          setCategories(
            data.map((item) =>
              typeof item === "object" && item !== null
                ? { slug: item.slug, name: item.name || item.slug }
                : { slug: item, name: item }
            )
          );
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  // Fetch the product
  useEffect(() => {
    const numId = parseInt(id, 10);
    if (!id || isNaN(numId) || numId <= 0) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setFetchError(null);

    getProductById(numId)
      .then((data) => {
        if (!cancelled) setRawProduct(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err?.message || "";
        // DummyJSON returns a 404 with message "Product with id '...' not found"
        if (
          msg.toLowerCase().includes("not found") ||
          msg.includes("404") ||
          err?.response?.status === 404
        ) {
          setNotFound(true);
        } else {
          setFetchError(msg || "Failed to load product details.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Apply local mutations (edit/delete overlay)
  const product = rawProduct ? applyToProduct(rawProduct) : null;
  const isLocallyDeleted = rawProduct && !product;

  // ── Edit handler ─────────────────────────────────────────────────────────
  const handleSaveEdit = async (formData) => {
    if (lockRef.current || actionLoading) return;
    lockRef.current = true;
    setActionLoading(true);
    try {
      const updated = await updateProduct(product.id, formData);
      const merged = { ...product, ...formData, ...updated };
      recordEdit(product.id, merged);
      // Update raw so the page reflects changes immediately
      setRawProduct((prev) => ({ ...prev, ...formData, ...updated }));
      showToast(`"${formData.title}" updated successfully!`, "success");
      setEditOpen(false);
    } catch (err) {
      showToast(err?.message || "Failed to update product", "error");
    } finally {
      setActionLoading(false);
      lockRef.current = false;
    }
  };

  // ── Delete handler ────────────────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!product || lockRef.current || actionLoading) return;
    lockRef.current = true;
    setActionLoading(true);
    try {
      await deleteProduct(product.id);
      recordDelete(product.id);
      showToast(`"${product.title}" deleted.`, "success");
      setDeleteOpen(false);
      // Navigate back to list after a brief moment so the toast is visible
      setTimeout(() => router.replace("/products"), 1200);
    } catch (err) {
      showToast(err?.message || "Failed to delete product", "error");
      setActionLoading(false);
      lockRef.current = false;
    }
  };

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <DetailSkeleton />
      </main>
    );
  }

  if (notFound || isLocallyDeleted) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <ProductNotFound id={id} />
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="mb-4 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to load product</h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">{fetchError}</p>
          <div className="flex gap-3">
            <Link href="/products">
              <Button variant="secondary">← Back to Products</Button>
            </Link>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  const reviews = product.reviews || [];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* Breadcrumb nav */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link
          href="/products"
          className="hover:text-indigo-600 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Products
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-xs">
          {product.title}
        </span>
      </nav>

      {/* Main product card */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden mb-6">
        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left: image gallery */}
          <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
            <ImageGallery
              images={product.images}
              thumbnail={product.thumbnail}
              title={product.title}
            />
          </div>

          {/* Right: product info */}
          <div className="p-6 sm:p-8 flex flex-col">
            {/* Category & brand */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 capitalize">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs font-semibold text-gray-500">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-3">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mb-4">
              <StarRating
                rating={product.rating}
                reviewCount={reviews.length}
              />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-extrabold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-sm font-semibold">
                  −{Number(product.discountPercentage).toFixed(1)}% OFF
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              <StockBadge stock={product.stock ?? 0} />
            </div>

            {/* Metadata table */}
            <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-2.5 text-sm mb-6">
              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-gray-400">SKU</span>
                  <span className="font-mono text-xs font-medium text-gray-900">{product.sku}</span>
                </div>
              )}
              {product.warrantyInformation && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Warranty</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">{product.warrantyInformation}</span>
                </div>
              )}
              {product.shippingInformation && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 text-right max-w-[60%]">{product.shippingInformation}</span>
                </div>
              )}
              {product.availabilityStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Availability</span>
                  <span className="font-medium text-gray-900">{product.availabilityStatus}</span>
                </div>
              )}
              {product.minimumOrderQuantity && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Min Order</span>
                  <span className="font-medium text-gray-900">{product.minimumOrderQuantity} unit{product.minimumOrderQuantity !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-auto">
              <Button
                id="detail-edit-btn"
                variant="primary"
                onClick={() => setEditOpen(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Product
              </Button>
              <Button
                id="detail-delete-btn"
                variant="danger"
                onClick={() => setDeleteOpen(true)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Description section */}
        {product.description && (
          <div className="px-6 sm:px-8 py-6 border-t border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>

      {/* Reviews section */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            Customer Reviews
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({reviews.length})
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reviews.map((review, idx) => (
              <ReviewCard key={review.reviewerEmail || idx} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* Edit modal */}
      <ProductModal
        isOpen={editOpen}
        onClose={() => !actionLoading && setEditOpen(false)}
        onSubmit={handleSaveEdit}
        product={product}
        categories={categories}
        loading={actionLoading}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => !actionLoading && setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={actionLoading}
      />

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </main>
  );
}
