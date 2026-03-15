"use client";

import { useState } from "react";
import { BADGES, getBadgeByType } from "@/lib/constants/badges";

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
        className={`${s.container} xp-raised flex items-center justify-center ${
          earned ? "" : "grayscale opacity-40"
        }`}
        style={{ backgroundColor: earned ? "#F1EFE2" : "var(--xp-silber-luna)" }}
        title={badge.name}
      >
        <span>{badge.emoji}</span>
      </div>
      {size !== "sm" && (
        <span
          className={`${s.label} mt-[2px] text-center leading-tight ${
            earned ? "" : "opacity-40"
          }`}
          style={{ fontFamily: "Tahoma, Verdana, sans-serif" }}
        >
          {badge.name}
        </span>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="xp-raised absolute bottom-full left-1/2 z-50 mb-2 w-48 -translate-x-1/2 p-2"
          style={{
            backgroundColor: "#FFFFE1",
            fontFamily: "Tahoma, Verdana, sans-serif",
            fontSize: "11px",
          }}
        >
          <div className="font-bold">
            {badge.emoji} {badge.name}
          </div>
          <div className="mt-1" style={{ color: "var(--xp-border-darker)" }}>
            {badge.description}
          </div>
          <div
            className="mt-1 italic"
            style={{ color: "var(--xp-border-dark)", fontSize: "10px" }}
          >
            {badge.condition}
          </div>
          {!earned && (
            <div
              className="mt-1 font-bold"
              style={{ color: "var(--xp-fehler-rot)", fontSize: "10px" }}
            >
              Noch nicht freigeschaltet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
