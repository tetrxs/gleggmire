"use client";

import { useState } from "react";
import { XpButton } from "@/components/ui/xp-button";

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
    <div className="flex flex-wrap items-center gap-2">
      <XpButton
        onClick={handleUpvote}
        className={`transition-colors ${voted === "up" ? "!bg-green-200" : "hover:!bg-green-100"}`}
      >
        {"▲ Gleggmire-approved"} ({upvotes})
      </XpButton>
      <XpButton
        onClick={handleDownvote}
        className={`transition-colors ${voted === "down" ? "!bg-red-200" : "hover:!bg-red-100"}`}
      >
        {"▼ Cope & Seethe"} ({downvotes})
      </XpButton>
      {isRatiod && (
        <span
          className="ml-2 font-bold animate-pulse"
          style={{ color: "var(--xp-fehler-rot)", fontSize: "14px" }}
        >
          RATIO&apos;D
        </span>
      )}
    </div>
  );
}
