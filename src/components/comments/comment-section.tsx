"use client";

import { useState, useMemo } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { CommentItem } from "@/components/comments/comment-item";
import { CommentEditor } from "@/components/comments/comment-editor";
import { useAudioStore } from "@/stores/audio-store";
import type { CommentWithMeta } from "@/lib/mock-comments";
import type { CommentEntityType } from "@/types/database";

type SortMode = "newest" | "top" | "controversial";

interface CommentSectionProps {
  entityType: CommentEntityType;
  entityId: string;
  comments: CommentWithMeta[];
}

function sortComments(
  comments: CommentWithMeta[],
  mode: SortMode
): CommentWithMeta[] {
  const sorted = [...comments];
  switch (mode) {
    case "newest":
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
    case "top":
      sorted.sort(
        (a, b) =>
          b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
      );
      break;
    case "controversial":
      // Controversial = most total votes with close ratio
      sorted.sort((a, b) => {
        const aTotal = a.upvotes + a.downvotes;
        const bTotal = b.upvotes + b.downvotes;
        const aRatio =
          aTotal > 0
            ? 1 - Math.abs(a.upvotes - a.downvotes) / aTotal
            : 0;
        const bRatio =
          bTotal > 0
            ? 1 - Math.abs(b.upvotes - b.downvotes) / bTotal
            : 0;
        return bRatio * bTotal - aRatio * aTotal;
      });
      break;
  }
  return sorted;
}

export function CommentSection({
  entityType,
  entityId,
  comments,
}: CommentSectionProps) {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const { isMuted, toggleMute } = useAudioStore();

  const sortedComments = useMemo(
    () => sortComments(comments, sortMode),
    [comments, sortMode]
  );

  const sortButtons: { mode: SortMode; label: string }[] = [
    { mode: "newest", label: "Neueste" },
    { mode: "top", label: "Top" },
    { mode: "controversial", label: "Kontrovers" },
  ];

  return (
    <XpWindow title={"\uD83D\uDCAC Community-Stimmung \u2014 Nicht abst\u00FCrzen"}>
      {/* Global mute toggle - sticky systray style */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 px-2 py-1.5 mb-3 xp-raised"
        style={{
          backgroundColor: "var(--xp-silber-luna)",
          fontFamily: "Tahoma, Verdana, sans-serif",
          fontSize: "11px",
        }}
      >
        <button
          type="button"
          onClick={toggleMute}
          className="flex items-center gap-2 cursor-pointer select-none"
          title={
            isMuted
              ? "Clips stumm \u2014 klicken zum Aktivieren"
              : "Clips laut \u2014 klicken zum Stummschalten"
          }
        >
          {/* Speaker icon */}
          <span className="relative inline-flex items-center justify-center w-5 h-5">
            {isMuted ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5h3l4-3v12l-4-3H2V5z"
                  fill="#CC0000"
                  stroke="#800000"
                  strokeWidth="0.5"
                />
                <path
                  d="M12 4l-4 4m0-4l4 4"
                  stroke="#CC0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5h3l4-3v12l-4-3H2V5z"
                  fill="#008000"
                  stroke="#005000"
                  strokeWidth="0.5"
                />
                <path
                  d="M11 5.5c.8.8.8 2.2 0 3"
                  stroke="#008000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M13 3.5c1.5 1.5 1.5 4.5 0 6"
                  stroke="#008000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            )}
          </span>
          <span
            className="font-bold"
            style={{
              color: isMuted ? "#CC0000" : "#008000",
            }}
          >
            {isMuted
              ? "Clips stumm \u2014 klicken zum Aktivieren"
              : "Clips laut \u2014 klicken zum Stummschalten"}
          </span>
        </button>
      </div>

      {/* Sort controls */}
      <div
        className="flex items-center gap-1 mb-3"
        style={{
          fontFamily: "Tahoma, Verdana, sans-serif",
          fontSize: "11px",
        }}
      >
        <span className="opacity-60 mr-1">Sortieren:</span>
        {sortButtons.map(({ mode, label }) => (
          <XpButton
            key={mode}
            onClick={() => setSortMode(mode)}
            className={sortMode === mode ? "!bg-[var(--xp-blau-highlight)] !text-white" : ""}
          >
            {label}
          </XpButton>
        ))}
        <span className="ml-auto opacity-50">
          {comments.length} Kommentar{comments.length !== 1 ? "e" : ""}
        </span>
      </div>

      {/* Comment list */}
      <div className="space-y-3 mb-4">
        {sortedComments.length === 0 ? (
          <div
            className="xp-inset p-6 text-center opacity-60"
            style={{
              backgroundColor: "var(--xp-fenster-weiss)",
              fontFamily: "Tahoma, Verdana, sans-serif",
              fontSize: "11px",
            }}
          >
            <p>Noch keine Kommentare. Sei der Erste, der hier coped!</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              entityType={entityType}
              entityId={entityId}
            />
          ))
        )}
      </div>

      {/* Comment editor */}
      <div
        className="xp-inset p-3"
        style={{ backgroundColor: "var(--xp-silber-luna)" }}
      >
        <p
          className="font-bold mb-2"
          style={{
            fontFamily: "Tahoma, Verdana, sans-serif",
            fontSize: "11px",
          }}
        >
          Neuen Kommentar schreiben
        </p>
        <CommentEditor entityType={entityType} entityId={entityId} />
      </div>
    </XpWindow>
  );
}
