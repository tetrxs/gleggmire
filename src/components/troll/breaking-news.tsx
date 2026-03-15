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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (comebackRef.current) clearTimeout(comebackRef.current);
    };
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    // Troll: it comes back after 5 seconds
    comebackRef.current = setTimeout(() => {
      if (isActive) setVisible(true);
    }, 5000);
  }, [isActive]);

  if (!visible) return null;

  return (
    <div
      className="xp-raised-strong relative z-50 flex w-full items-center overflow-hidden"
      style={{
        backgroundColor: "var(--xp-fehler-rot)",
        animation: "breaking-pulse 1.5s ease-in-out infinite",
        minHeight: "32px",
      }}
    >
      {/* Label */}
      <div
        className="xp-raised relative z-10 shrink-0 px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
        style={{
          backgroundColor: "#FFFFFF",
          color: "var(--xp-fehler-rot)",
          fontFamily: "Tahoma, Verdana, sans-serif",
        }}
      >
        EILMELDUNG
      </div>

      {/* Marquee */}
      <div className="flex-1 overflow-hidden">
        <div
          className="flex whitespace-nowrap py-1 text-[12px] font-bold text-white"
          style={{
            fontFamily: "Tahoma, Verdana, sans-serif",
            animation: "breaking-scroll 15s linear infinite",
          }}
        >
          <span className="px-8">&#x26A0;&#xFE0F; {message}</span>
          <span className="px-8">&#x26A0;&#xFE0F; {message}</span>
          <span className="px-8">&#x26A0;&#xFE0F; {message}</span>
        </div>
      </div>

      {/* Close button (troll: comes back) */}
      <button
        onClick={handleClose}
        className="xp-titlebar-btn xp-titlebar-btn-close relative z-10 mr-1 shrink-0"
        aria-label="Schliessen"
        type="button"
        title="Schliessen (vielleicht)"
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

      <style>{`
        @keyframes breaking-pulse {
          0%, 100% { background-color: var(--xp-fehler-rot); }
          50% { background-color: #FF2222; }
        }

        @keyframes breaking-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
