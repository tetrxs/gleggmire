"use client";

import { useState, useMemo } from "react";
import { XpWindow } from "@/components/ui/xp-window";
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

function sortComments(comments: CommentWithMeta[], mode: SortMode): CommentWithMeta[] {
  const sorted = [...comments];
  switch (mode) {
    case "newest":
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case "top":
      sorted.sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes));
      break;
    case "controversial":
      sorted.sort((a, b) => {
        const aTotal = a.upvotes + a.downvotes;
        const bTotal = b.upvotes + b.downvotes;
        const aRatio = aTotal > 0 ? 1 - Math.abs(a.upvotes - a.downvotes) / aTotal : 0;
        const bRatio = bTotal > 0 ? 1 - Math.abs(b.upvotes - b.downvotes) / bTotal : 0;
        return bRatio * bTotal - aRatio * aTotal;
      });
      break;
  }
  return sorted;
}

export function CommentSection({ entityType, entityId, comments }: CommentSectionProps) {
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const { isMuted, toggleMute } = useAudioStore();

  const sortedComments = useMemo(() => sortComments(comments, sortMode), [comments, sortMode]);

  const sortButtons: { mode: SortMode; label: string }[] = [
    { mode: "newest", label: "Neueste" },
    { mode: "top", label: "Top" },
    { mode: "controversial", label: "Kontrovers" },
  ];

  return (
    <XpWindow title="Community-Stimmung">
      {/* Global mute toggle */}
      <div className="sticky top-0 z-10 mb-4 flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 dark:border-zinc-700">
        <button
          type="button"
          onClick={toggleMute}
          className="flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer select-none"
          title={isMuted ? "Clips stumm — klicken zum Aktivieren" : "Clips laut — klicken zum Stummschalten"}
        >
          <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white text-xs ${isMuted ? "bg-red-500" : "bg-emerald-500"}`}>
            {isMuted ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" /></svg>
            )}
          </span>
          <span className={`font-medium ${isMuted ? "text-red-500 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {isMuted ? "Clips stumm — klicken zum Aktivieren" : "Clips laut — klicken zum Stummschalten"}
          </span>
        </button>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-[var(--color-muted)]">Sortieren:</span>
        <div className="inline-flex rounded-lg border border-[var(--color-border)] p-1 dark:border-zinc-700">
          {sortButtons.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSortMode(mode)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                sortMode === mode ? "bg-[#E8593C] text-white" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-sm text-[var(--color-muted)]">
          {comments.length} Kommentar{comments.length !== 1 ? "e" : ""}
        </span>
      </div>

      {/* Comment list */}
      <div className="space-y-3 mb-6">
        {sortedComments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] p-8 text-center dark:border-zinc-700">
            <p className="text-sm text-[var(--color-muted)]">Noch keine Kommentare. Sei der Erste, der hier coped!</p>
          </div>
        ) : (
          sortedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} entityType={entityType} entityId={entityId} />
          ))
        )}
      </div>

      {/* Comment editor */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 dark:border-zinc-700">
        <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Neuen Kommentar schreiben</p>
        <CommentEditor entityType={entityType} entityId={entityId} />
      </div>
    </XpWindow>
  );
}
