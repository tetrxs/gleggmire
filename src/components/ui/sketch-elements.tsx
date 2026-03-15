"use client";

import { type ReactNode } from "react";

/* ============================================
   SketchArrow
   A curved, dashed SVG arrow
   ============================================ */

interface SketchArrowProps {
  direction?: "left" | "right" | "up" | "down";
  color?: string;
  size?: number;
  className?: string;
}

export function SketchArrow({
  direction = "right",
  color = "var(--color-accent)",
  size = 48,
  className = "",
}: SketchArrowProps) {
  const rotations: Record<string, number> = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };

  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 60 36"
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
      aria-hidden="true"
    >
      <path
        d="M3 22 Q 12 6, 25 16 Q 35 24, 42 14 Q 47 8, 54 12"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
      <path
        d="M49 7 L55 12 L48 16"
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================
   SketchUnderline
   A wavy, hand-drawn underline SVG
   ============================================ */

interface SketchUnderlineProps {
  color?: string;
  width?: number | string;
  className?: string;
}

export function SketchUnderline({
  color = "var(--color-accent)",
  width = "100%",
  className = "",
}: SketchUnderlineProps) {
  return (
    <svg
      width={width}
      height="8"
      viewBox="0 0 200 8"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 5.5 Q 8 1.5, 18 5 T 38 4.5 T 58 5.5 T 78 4 T 98 5.5 T 118 4.5 T 138 5.5 T 158 4 T 178 5.5 T 199 4.5"
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================
   SketchCircle
   A rough hand-drawn circle highlight
   ============================================ */

interface SketchCircleProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function SketchCircle({
  children,
  color = "var(--color-accent)",
  className = "",
}: SketchCircleProps) {
  return (
    <span className={`relative inline-block ${className}`}>
      <svg
        className="absolute pointer-events-none"
        style={{
          inset: "-10px -14px",
          width: "calc(100% + 28px)",
          height: "calc(100% + 20px)",
        }}
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <ellipse
          cx="100"
          cy="40"
          rx="94"
          ry="34"
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeDasharray="5 4"
          transform="rotate(-1.5 100 40)"
        />
        {/* Second pass for hand-drawn feel */}
        <ellipse
          cx="101"
          cy="39"
          rx="92"
          ry="32"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.3"
          transform="rotate(0.5 101 39)"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </span>
  );
}

/* ============================================
   SketchDivider
   A hand-drawn horizontal divider line
   ============================================ */

interface SketchDividerProps {
  color?: string;
  className?: string;
}

export function SketchDivider({
  color = "var(--color-border)",
  className = "",
}: SketchDividerProps) {
  return (
    <div className={`w-full py-2 ${className}`} aria-hidden="true">
      <svg
        width="100%"
        height="6"
        viewBox="0 0 400 6"
        preserveAspectRatio="none"
      >
        <path
          d="M0 3 Q 20 1, 40 3.5 T 80 2.5 T 120 3.5 T 160 2 T 200 3.5 T 240 2.5 T 280 3.5 T 320 2 T 360 3.5 T 400 3"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
