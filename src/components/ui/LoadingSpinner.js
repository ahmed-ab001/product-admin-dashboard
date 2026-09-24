"use client";

/**
 * LoadingSpinner component.
 *
 * @param {'sm'|'md'|'lg'|'xl'} [size='md']
 * @param {boolean} [fullPage=false]  — Centers the spinner in the viewport.
 * @param {string}  [label='Loading…']
 */
export default function LoadingSpinner({
  size = "md",
  fullPage = false,
  label = "Loading…",
}) {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-[3px]",
    xl: "h-16 w-16 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`rounded-full border-indigo-200 border-t-indigo-600 animate-spin ${
          sizeClasses[size] ?? sizeClasses.md
        }`}
        role="status"
        aria-label={label}
      />
      {label && (
        <p className="text-sm text-gray-500 animate-pulse">{label}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  );
}
