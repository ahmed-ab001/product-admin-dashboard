"use client";

import { Suspense, useState, useCallback } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { createProduct, updateProduct, deleteProduct } from "@/services/productService";
import PageWrapper from "@/components/layout/PageWrapper";
import ProductToolbar from "@/components/products/ProductToolbar";
import ProductTable from "@/components/products/ProductTable";
import ProductCardList from "@/components/products/ProductCardList";
import Pagination from "@/components/products/Pagination";
import ProductModal from "@/components/products/ProductModal";
import ProductDetailModal from "@/components/products/ProductDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Toast from "@/components/ui/Toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";

/**
 * ProductsContent is wrapped in Suspense to safely support Next.js useSearchParams.
 */
function ProductsContent() {
  const { user } = useAuth();
  const {
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
    refetch,
  } = useProducts();

  // Local state for modals & CRUD actions
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingProduct(null);
    setModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((prod) => {
    setEditingProduct(prod);
    setModalOpen(true);
  }, []);

  const handleOpenDetailModal = useCallback((prod) => {
    setDetailProduct(prod);
  }, []);

  const handleOpenDeleteDialog = useCallback((prod) => {
    setDeleteTarget(prod);
  }, []);

  const handleSaveProduct = async (formData) => {
    setActionLoading(true);
    try {
      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, formData);
        showToast(`Product "${formData.title}" updated successfully!`, "success");
      } else {
        await createProduct(formData);
        showToast(`Product "${formData.title}" created successfully!`, "success");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      showToast(err?.message || "Failed to save product", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      showToast(`Product "${deleteTarget.title}" deleted successfully!`, "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(err?.message || "Failed to delete product", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.username || "Admin";

  const hasActiveFilters = Boolean(search || category || sort);

  return (
    <PageWrapper className="space-y-6 pb-12">
      {/* Header Overview Card */}
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
              Products Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage inventory, search across categories, and track stock levels.
            </p>
          </div>

          {user?.image && (
            <div className="flex items-center gap-3 bg-gray-50/80 p-2.5 rounded-xl border border-gray-200/60 self-start sm:self-center">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-indigo-50 border border-indigo-100 shrink-0">
                <Image
                  src={user.image}
                  alt={displayName}
                  fill
                  sizes="44px"
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
      </div>

      {/* Main Catalog Container */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <ProductToolbar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            category={category}
            categories={categories}
            categoriesLoading={categoriesLoading}
            sort={sort}
            limit={limit}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onLimitChange={handleLimitChange}
            onClearFilters={clearFilters}
            onAddProduct={handleOpenAddModal}
            total={total}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-24">
            <LoadingSpinner size="lg" label="Updating products catalog..." />
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorState message={error} onRetry={refetch} />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No products found"
              description={
                hasActiveFilters
                  ? "No products match your current search and filter criteria. Try adjusting or clearing your filters."
                  : "No products are currently available in the catalog."
              }
              actionLabel={hasActiveFilters ? "Reset Filters" : undefined}
              onAction={hasActiveFilters ? clearFilters : undefined}
            />
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <ProductTable
              products={products}
              onViewProduct={handleOpenDetailModal}
              onEditProduct={handleOpenEditModal}
              onDeleteProduct={handleOpenDeleteDialog}
            />

            {/* Mobile Cards View */}
            <ProductCardList
              products={products}
              onViewProduct={handleOpenDetailModal}
              onEditProduct={handleOpenEditModal}
              onDeleteProduct={handleOpenDeleteDialog}
            />

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              showingText={showingText}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        loading={actionLoading}
      />

      {/* Product Details Modal */}
      <ProductDetailModal
        isOpen={Boolean(detailProduct)}
        onClose={() => setDetailProduct(null)}
        product={detailProduct}
        onEdit={(prod) => {
          setDetailProduct(null);
          handleOpenEditModal(prod);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        loading={actionLoading}
      />

      {/* Toast Feedback Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </PageWrapper>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage label="Loading products..." />}>
      <ProductsContent />
    </Suspense>
  );
}
