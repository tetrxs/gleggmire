"use client";

import { useState } from "react";
import { getBadgeByType } from "@/lib/constants/badges";

interface BadgeDisplayProps {
  badgeType: string;
  size?: "sm" | "md" | "lg";
  earned?: boolean;
}

const sizeClasses = {
  sm: { container: "w-6 h-6 text-[12px]", label: "text-[9px]" },
  md: { container: "w-8 h-8 text-[16px]", label: "text-[10px]" },
  lg: { container: "w-10 h-10 text-[20px]", label: "text-[11px]" },
};

export function BadgeDisplay({
  badgeType,
  size = "md",
  earned = true,
}: BadgeDisplayProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const badge = getBadgeByType(badgeType);

  if (!badge) return null;

  const s = sizeClasses[size];

  return (
    <div
      className="relative inline-flex flex-col items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`${s.container} flex items-center justify-center rounded-lg border border-[var(--color-border)] ${
          earned ? "" : "grayscale opacity-40"
        }`}
        style={{ backgroundColor: earned ? "var(--color-surface)" : "var(--color-bg)" }}
        title={badge.name}
      >
        <span>{badge.emoji}</span>
      </div>
      {size !== "sm" && (
        <span
          className={`${s.label} mt-[2px] text-center leading-tight text-[var(--color-text)] ${
            earned ? "" : "opacity-40"
          }`}
        >
          {badge.name}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-xs shadow-lg">
          <div className="font-bold text-[var(--color-text)]">
            {badge.emoji} {badge.name}
          </div>
          <div className="mt-1 text-[var(--color-text-muted)]">
            {badge.description}
          </div>
          <div className="mt-1 italic text-[var(--color-text-muted)] text-[10px]">
            {badge.condition}
          </div>
          {!earned && (
            <div className="mt-1 font-bold text-red-500 text-[10px]">
              Noch nicht freigeschaltet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
