"use client";

import { useState, useEffect } from "react";
import { useAuth, redirectToLogin } from "@/lib/hooks/use-auth";

interface VoteButtonsProps {
  upvotes: number;
  downvotes: number;
  entityType: string;
  entityId: string;
  isOwnContent?: boolean;
}

export function VoteButtons({
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  entityType,
  entityId,
  isOwnContent = false,
}: VoteButtonsProps) {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(initialUpvotes ?? 0);
  const [downvotes, setDownvotes] = useState(initialDownvotes ?? 0);
  const [voted, setVoted] = useState<"up" | "down" | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch existing vote on mount
  useEffect(() => {
    if (isOwnContent) {
      setReady(true);
      return;
    }
    const endpoint =
      entityType === "comment"
        ? `/api/v1/comments/${entityId}/vote`
        : `/api/v1/definitions/${entityId}/vote`;
    fetch(endpoint)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.vote_type === "up" || data?.vote_type === "down") {
          setVoted(data.vote_type);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, [entityType, entityId, isOwnContent]);

  async function sendVote(voteType: "up" | "down") {
    try {
      const endpoint =
        entityType === "comment"
          ? `/api/v1/comments/${entityId}/vote`
          : `/api/v1/definitions/${entityId}/vote`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote_type: voteType }),
      });
      if (!res.ok) return false;
      return true;
    } catch {
      return false;
    }
  }

  function handleUpvote() {
    if (!user) { redirectToLogin(); return; }
    if (isOwnContent || loading || !ready) return;
    setLoading(true);

    const prevUp = upvotes;
    const prevDown = downvotes;
    const prevVoted = voted;

    if (voted === "up") {
      // Toggle off
      setUpvotes(Math.max(0, upvotes - 1));
      setVoted(null);
    } else if (voted === "down") {
      // Switch from down to up
      setDownvotes(Math.max(0, downvotes - 1));
      setUpvotes(upvotes + 1);
      setVoted("up");
    } else {
      // New vote
      setUpvotes(upvotes + 1);
      setVoted("up");
    }

    sendVote("up").then((ok) => {
      if (!ok) {
        setUpvotes(prevUp);
        setDownvotes(prevDown);
        setVoted(prevVoted);
      }
      setLoading(false);
    });
  }

  function handleDownvote() {
    if (!user) { redirectToLogin(); return; }
    if (isOwnContent || loading || !ready) return;
    setLoading(true);

    const prevUp = upvotes;
    const prevDown = downvotes;
    const prevVoted = voted;

    if (voted === "down") {
      // Toggle off
      setDownvotes(Math.max(0, downvotes - 1));
      setVoted(null);
    } else if (voted === "up") {
      // Switch from up to down
      setUpvotes(Math.max(0, upvotes - 1));
      setDownvotes(downvotes + 1);
      setVoted("down");
    } else {
      // New vote
      setDownvotes(downvotes + 1);
      setVoted("down");
    }

    sendVote("down").then((ok) => {
      if (!ok) {
        setUpvotes(prevUp);
        setDownvotes(prevDown);
        setVoted(prevVoted);
      }
      setLoading(false);
    });
  }

  const disabled = isOwnContent || !ready;

  return (
    <div className="inline-flex items-center gap-1.5">
      {/* GOEY (Like) */}
      <button
        type="button"
        onClick={handleUpvote}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : voted === "up"
              ? "bg-green-100 text-green-700"
              : "text-[var(--color-text-muted)] hover:bg-green-50 hover:text-green-600"
        }`}
        style={{
          border:
            voted === "up"
              ? "1px solid #86efac"
              : "1px solid var(--color-border)",
        }}
        title={
          isOwnContent
            ? "Eigene Inhalte koennen nicht bewertet werden"
            : undefined
        }
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 10v12" />
          <path d="M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2a3.13 3.13 0 013 3.88z" />
        </svg>
        <span className="tabular-nums">{upvotes}</span>
        <span className="hidden sm:inline">GOEY</span>
      </button>

      {/* Cope (Dislike) */}
      <button
        type="button"
        onClick={handleDownvote}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : voted === "down"
              ? "bg-red-100 text-red-600"
              : "text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500"
        }`}
        style={{
          border:
            voted === "down"
              ? "1px solid #fca5a5"
              : "1px solid var(--color-border)",
        }}
        title={
          isOwnContent
            ? "Eigene Inhalte koennen nicht bewertet werden"
            : undefined
        }
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 14V2" />
          <path d="M9 18.12L10 14H4.17a2 2 0 01-1.92-2.56l2.33-8A2 2 0 016.5 2H20a2 2 0 012 2v8a2 2 0 01-2 2h-2.76a2 2 0 00-1.79 1.11L12 22a3.13 3.13 0 01-3-3.88z" />
        </svg>
        <span className="tabular-nums">{downvotes}</span>
        <span className="hidden sm:inline">Cope</span>
      </button>
    </div>
  );
}
