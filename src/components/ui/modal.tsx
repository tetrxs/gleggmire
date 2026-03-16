"use client";

import { useEffect } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
  hideClose?: boolean;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
  hideClose = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:items-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`flex w-full ${maxWidth} max-h-[90vh] animate-slide-up flex-col rounded-2xl shadow-2xl`}
        style={{
          backgroundColor: "var(--color-surface)",
          border: "2px solid var(--color-border)",
        }}
      >
        {/* Fixed header */}
        <div className="shrink-0 px-6 pt-6 pb-4 flex items-center justify-between">
          <h3
            className="text-lg font-bold uppercase tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            {title}
          </h3>
          {!hideClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
              style={{
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border)",
              }}
              aria-label="Schliessen"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}
