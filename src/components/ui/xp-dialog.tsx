"use client";

import { useEffect, useCallback } from "react";
import { XpButton } from "./xp-button";

type DialogType = "error" | "warning" | "info";

interface XpDialogProps {
  type: DialogType;
  title: string;
  message: string;
  onClose: () => void;
  open: boolean;
}

function DialogIcon({ type }: { type: DialogType }) {
  const size = 24;

  switch (type) {
    case "error":
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-error)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
      );
    case "warning":
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-warning)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      );
    case "info":
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </div>
      );
  }
}

const titleMap: Record<DialogType, string> = {
  error: "Fehler",
  warning: "Warnung",
  info: "Information",
};

export function XpDialog({
  type,
  title,
  message,
  onClose,
  open,
}: XpDialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="card w-[400px] max-w-[90vw] p-6 shadow-lg animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label={title || titleMap[type]}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <DialogIcon type={type} />
          <div className="flex-1 min-w-0">
            <h4
              className="text-base font-semibold mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title || titleMap[type]}
            </h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors"
            aria-label="Schliessen"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 4L12 12M12 4L4 12" />
            </svg>
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <XpButton variant="primary" onClick={onClose}>
            OK
          </XpButton>
        </div>
      </div>
    </div>
  );
}
