"use client";

import { useState, useMemo } from "react";
import { CommentItem } from "@/components/comments/comment-item";
import { CommentEditor } from "@/components/comments/comment-editor";
import type { CommentWithMeta } from "@/lib/data/comments";
import type { CommentEntityType } from "@/types/database";

type SortMode = "newest" | "top" | "controversial";

const COMMENTS_PER_PAGE = 5;

interface CommentSectionProps {
  entityType: CommentEntityType;
  entityId: string;
  comments: CommentWithMeta[];
  currentUserId?: string;
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

export function CommentSection({ entityType, entityId, comments: initialComments, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithMeta[]>(initialComments);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

  const sortedComments = useMemo(() => sortComments(comments, sortMode), [comments, sortMode]);
  const visibleComments = sortedComments.slice(0, visibleCount);
  const hasMore = visibleCount < sortedComments.length;

  function handleNewComment(comment: Record<string, unknown>) {
    const newComment = comment as unknown as CommentWithMeta;
    setComments((prev) => [newComment, ...prev]);
  }

  function handleNewReply(parentId: string, reply: Record<string, unknown>) {
    const newReply = reply as unknown as CommentWithMeta;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies ?? []), newReply] };
        }
        return c;
      })
    );
  }

  function handleCommentDeleted(commentId: string) {
    setComments((prev) => {
      // Try removing as top-level comment
      const filtered = prev.filter((c) => c.id !== commentId);
      if (filtered.length !== prev.length) return filtered;
      // Try removing as a reply
      return prev.map((c) => ({
        ...c,
        replies: c.replies?.filter((r) => r.id !== commentId),
      }));
    });
  }

  function handleCommentEdited(commentId: string, updated: Record<string, unknown>) {
    const patch = updated as unknown as Partial<CommentWithMeta>;
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) return { ...c, ...patch };
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, ...patch } : r
            ),
          };
        }
        return c;
      })
    );
  }

  const sortButtons: { mode: SortMode; label: string }[] = [
    { mode: "newest", label: "Neueste" },
    { mode: "top", label: "Top" },
    { mode: "controversial", label: "Kontrovers" },
  ];

  return (
    <div>
      {/* Section heading */}
      <h2
        className="text-sm font-bold uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)" }}
      >
        Kommentare ({comments.length})
      </h2>

      {/* Comment editor — clean, no card */}
      <div className="mt-4 mb-6">
        <CommentEditor entityType={entityType} entityId={entityId} onSubmit={handleNewComment} />
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-1 mb-4">
        <span className="mr-1 text-xs" style={{ color: "var(--color-text-muted)" }}>Sortieren:</span>
        <div className="inline-flex rounded-lg p-0.5" style={{ border: "1px solid var(--color-border)" }}>
          {sortButtons.map(({ mode, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => { setSortMode(mode); setVisibleCount(COMMENTS_PER_PAGE); }}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                sortMode === mode
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Comment list */}
      {visibleComments.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          Noch keine Kommentare. Sei der Erste, der hier coped!
        </p>
      ) : (
        <div className="space-y-0">
          {visibleComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              entityType={entityType}
              entityId={entityId}
              onReplySubmit={(reply) => handleNewReply(comment.id, reply)}
              currentUserId={currentUserId}
              onDeleted={handleCommentDeleted}
              onEdited={handleCommentEdited}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((v) => v + COMMENTS_PER_PAGE)}
          className="mt-4 w-full rounded-lg py-2.5 text-center text-xs font-semibold transition-colors hover:bg-[var(--color-surface)]"
          style={{
            color: "var(--color-text-muted)",
            border: "1px solid var(--color-border)",
          }}
        >
          Weitere Kommentare laden ({sortedComments.length - visibleCount} verbleibend)
        </button>
      )}
    </div>
  );
}
