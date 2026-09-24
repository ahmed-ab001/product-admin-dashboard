"use client";

import Button from "./Button";

/**
 * ErrorState component — displays an error message with an optional retry action.
 *
 * @param {string}       [message]           — Error message to display.
 * @param {() => void}   [onRetry]           — Callback for the Retry button.
 * @param {string}       [retryLabel='Retry']
 * @param {React.ReactNode} [icon]           — Override the default icon.
 */
export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  retryLabel = "Retry",
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
        {icon ?? (
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">
        Something went wrong
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="primary" size="md" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
