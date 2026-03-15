"use client";

import { useEffect, useCallback, type ReactNode } from "react";
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
  const size = 32;

  switch (type) {
    case "error":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="14" fill="#CC0000" />
          <circle cx="16" cy="16" r="12" fill="#FF3333" />
          <path
            d="M10 10L22 22M22 10L10 22"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "warning":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 2L30 28H2L16 2Z"
            fill="#FFD700"
            stroke="#B8860B"
            strokeWidth="1"
          />
          <text
            x="16"
            y="24"
            textAnchor="middle"
            fill="#000000"
            fontSize="18"
            fontWeight="bold"
            fontFamily="Tahoma, sans-serif"
          >
            !
          </text>
        </svg>
      );
    case "info":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="14" fill="#1F4ECC" />
          <circle cx="16" cy="16" r="12" fill="#3A92D8" />
          <text
            x="16"
            y="22"
            textAnchor="middle"
            fill="white"
            fontSize="18"
            fontWeight="bold"
            fontFamily="serif"
          >
            i
          </text>
        </svg>
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
      if (e.key === "Escape" || e.key === "Enter") {
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
    <div className="xp-overlay" onClick={onClose}>
      <div
        className="xp-window-outer w-[360px]"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-label={title || titleMap[type]}
      >
        {/* Title Bar */}
        <div className="xp-titlebar">
          <span>{title || titleMap[type]}</span>
          <button
            onClick={onClose}
            className="xp-titlebar-btn xp-titlebar-btn-close"
            aria-label="Schliessen"
            type="button"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path
                d="M1 1L8 8M8 1L1 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="xp-window p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <DialogIcon type={type} />
            </div>
            <p className="xp-text-body pt-1">{message}</p>
          </div>

          <div className="mt-5 flex justify-center">
            <XpButton onClick={onClose} className="min-w-[75px]">
              OK
            </XpButton>
          </div>
        </div>
      </div>
    </div>
  );
}
