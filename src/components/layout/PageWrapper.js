"use client";

/**
 * PageWrapper — consistent responsive padding wrapper for page content.
 *
 * @param {React.ReactNode} children
 * @param {string} [className]  — Additional classes to merge.
 */
export default function PageWrapper({ children, className = "" }) {
  return (
    <main className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </main>
  );
}
