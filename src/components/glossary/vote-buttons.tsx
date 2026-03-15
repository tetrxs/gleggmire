"use client";

import { useState } from "react";

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  entityType: string;
  entityId: string;
}

export function VoteButtons({
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  entityType,
  entityId,
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);

  const isRatiod = downvotes > upvotes;

  function handleUpvote() {
    if (voted === "up") {
      setUpvotes((v) => v - 1);
      setVoted(null);
    } else {
      if (voted === "down") setDownvotes((v) => v - 1);
      setUpvotes((v) => v + 1);
      setVoted("up");
    }
  }

  function handleDownvote() {
    if (voted === "down") {
      setDownvotes((v) => v - 1);
      setVoted(null);
    } else {
      if (voted === "up") setUpvotes((v) => v - 1);
      setDownvotes((v) => v + 1);
      setVoted("down");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Upvote */}
      <button
        type="button"
        onClick={handleUpvote}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
          voted === "up"
            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
            : "hover:bg-green-50 dark:hover:bg-green-950/50"
        }`}
        style={{
          border: "1px solid var(--color-border)",
          ...(voted !== "up" ? { color: "var(--color-muted)" } : {}),
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="tabular-nums">{upvotes}</span>
        <span className="hidden sm:inline text-[10px]" style={{ color: "var(--color-muted)" }}>
          Gleggmire-approved
        </span>
      </button>

      {/* Downvote */}
      <button
        type="button"
        onClick={handleDownvote}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
          voted === "down"
            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
            : "hover:bg-red-50 dark:hover:bg-red-950/50"
        }`}
        style={{
          border: "1px solid var(--color-border)",
          ...(voted !== "down" ? { color: "var(--color-muted)" } : {}),
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="tabular-nums">{downvotes}</span>
        <span className="hidden sm:inline text-[10px]" style={{ color: "var(--color-muted)" }}>
          Cope & Seethe
        </span>
      </button>

      {/* Ratio'd indicator */}
      {isRatiod && (
        <span className="ml-1 text-xs font-bold text-red-500 animate-pulse">
          RATIO&apos;D
        </span>
      )}
    </div>
  );
}
