"use client";

/**
 * EmptyState component — displayed when a list or search returns no results.
 *
 * @param {string} [title='Nothing here yet']
 * @param {string} [description]
 * @param {string} [actionLabel]   — Label for the optional CTA button.
 * @param {() => void} [onAction]  — Callback for the CTA button.
 * @param {React.ReactNode} [icon] — Override the default illustration icon.
 */
export default function EmptyState({
  title = "Nothing here yet",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-5 flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50">
        {icon ?? (
          <svg
            className="w-10 h-10 text-indigo-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
            />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
