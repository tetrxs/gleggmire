"use client";

import { useState, useCallback, type ReactNode } from "react";

interface XpWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function XpWindow({ title, children, className = "" }: XpWindowProps) {
  const [minimized, setMinimized] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const handleClose = useCallback(() => {
    alert("Fenster kann nicht geschlossen werden.");
  }, []);

  const handleMaximize = useCallback(() => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);
  }, []);

  const handleMinimize = useCallback(() => {
    setMinimized(true);
  }, []);

  const handleRestore = useCallback(() => {
    setMinimized(false);
  }, []);

  if (minimized) {
    return (
      <button
        onClick={handleRestore}
        className="xp-raised fixed bottom-2 left-2 z-40 flex items-center gap-1 px-3 py-1"
        style={{
          backgroundColor: "var(--xp-silber-luna)",
          fontFamily: "Tahoma, Verdana, sans-serif",
          fontSize: "11px",
        }}
      >
        <span className="xp-text-label font-bold">{title}</span>
      </button>
    );
  }

  return (
    <div
      className={`xp-window-outer ${bouncing ? "xp-anim-scale-bounce" : ""} ${className}`}
    >
      {/* Title Bar */}
      <div className="xp-titlebar">
        <span className="truncate">{title}</span>

        <div className="flex items-center gap-[2px]">
          {/* Minimize */}
          <button
            onClick={handleMinimize}
            className="xp-titlebar-btn xp-titlebar-btn-minmax"
            aria-label="Minimieren"
            type="button"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <rect x="1" y="7" width="7" height="2" fill="currentColor" />
            </svg>
          </button>

          {/* Maximize */}
          <button
            onClick={handleMaximize}
            className="xp-titlebar-btn xp-titlebar-btn-minmax"
            aria-label="Maximieren"
            type="button"
          >
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <rect
                x="1"
                y="1"
                width="7"
                height="7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="xp-titlebar-btn xp-titlebar-btn-close ml-[2px]"
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
      </div>

      {/* Window Body */}
      <div className="xp-window p-3">{children}</div>
    </div>
  );
}
