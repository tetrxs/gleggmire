"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface BreakingNewsProps {
  message: string;
  isActive: boolean;
}

export function BreakingNews({ message, isActive }: BreakingNewsProps) {
  const [visible, setVisible] = useState(isActive);
  const comebackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisible(isActive);
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (comebackRef.current) clearTimeout(comebackRef.current);
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    comebackRef.current = setTimeout(() => {
      if (isActive) setVisible(true);
    }, 5000);
  }, [isActive]);

  if (!visible) return null;

  return (
    <div
      className="relative z-50 flex w-full items-center overflow-hidden rounded-lg shadow-sm"
      style={{
        backgroundColor: "#ef4444",
        animation: "breaking-pulse 1.5s ease-in-out infinite",
        minHeight: "36px",
      }}
    >
      {/* Label */}
      <div className="relative z-10 shrink-0 rounded-md bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600 ml-1">
        EILMELDUNG
      </div>

      {/* Marquee */}
      <div className="flex-1 overflow-hidden">
        <div
          className="flex whitespace-nowrap py-1 text-sm font-bold text-white"
          style={{ animation: "breaking-scroll 15s linear infinite" }}
        >
          <span className="px-8">{message}</span>
          <span className="px-8">{message}</span>
          <span className="px-8">{message}</span>
        </div>
      </div>

      {/* Close button (troll: comes back) */}
      <button
        onClick={handleClose}
        className="relative z-10 mr-2 shrink-0 rounded-md p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        aria-label="Schliessen"
        type="button"
        title="Schliessen (vielleicht)"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4L12 12M12 4L4 12" />
        </svg>
      </button>

      <style>{`
        @keyframes breaking-pulse {
          0%, 100% { background-color: #ef4444; }
          50% { background-color: #dc2626; }
        }

        @keyframes breaking-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
