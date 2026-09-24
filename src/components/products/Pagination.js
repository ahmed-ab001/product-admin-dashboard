"use client";

/**
 * Pagination component with Prev/Next buttons, smart page numbers window,
 * showing range text, and disabled boundaries.
 */
export default function Pagination({
  currentPage,
  totalPages,
  showingText,
  onPageChange,
  disabled = false,
}) {
  if (totalPages <= 1 && (!showingText || showingText.includes("of 0"))) {
    return null;
  }

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPageNumbers();
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
      {/* Showing count indicator */}
      <div className="text-xs sm:text-sm text-gray-500">
        <span>{showingText}</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5 self-center sm:self-auto">
        {/* Previous Button */}
        <button
          type="button"
          id="pagination-prev-btn"
          onClick={() => !isFirstPage && !disabled && onPageChange(currentPage - 1)}
          disabled={isFirstPage || disabled}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-gray-400 select-none"
                >
                  &hellip;
                </span>
              );
            }

            const isCurrent = p === currentPage;

            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => !disabled && onPageChange(p)}
                disabled={disabled}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                } disabled:cursor-not-allowed`}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          id="pagination-next-btn"
          onClick={() => !isLastPage && !disabled && onPageChange(currentPage + 1)}
          disabled={isLastPage || disabled}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <span className="hidden xs:inline">Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
