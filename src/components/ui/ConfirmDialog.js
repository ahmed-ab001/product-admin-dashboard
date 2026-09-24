"use client";

import { useEffect, useRef } from "react";
import Button from "./Button";

/**
 * ConfirmDialog — a modal confirmation dialog.
 *
 * @param {boolean}       isOpen         — Controls visibility.
 * @param {() => void}    onClose        — Called when the dialog is dismissed.
 * @param {() => void}    onConfirm      — Called when Confirm is clicked.
 * @param {string}        [title='Are you sure?']
 * @param {string}        [message]
 * @param {string}        [confirmLabel='Confirm']
 * @param {string}        [cancelLabel='Cancel']
 * @param {'danger'|'primary'} [confirmVariant='danger']
 * @param {boolean}       [loading=false] — Shows spinner on the confirm button.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  loading = false,
}) {
  const dialogRef = useRef(null);

  // Trap focus and close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    // Lock body scroll.
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h2
          id="confirm-dialog-title"
          className="text-center text-lg font-semibold text-gray-900 mb-2"
        >
          {title}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">{message}</p>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
            id="confirm-dialog-cancel"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            fullWidth
            onClick={onConfirm}
            loading={loading}
            id="confirm-dialog-confirm"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
