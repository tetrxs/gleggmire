"use client";

import { useState, useMemo } from "react";
import { CommentItem } from "@/components/comments/comment-item";
import { CommentEditor } from "@/components/comments/comment-editor";
import type { CommentWithMeta } from "@/lib/data/comments";
import type { CommentEntityType } from "@/types/database";

const COMMENTS_PER_PAGE = 5;

interface CommentSectionProps {
  entityType: CommentEntityType;
  entityId: string;
  comments: CommentWithMeta[];
  currentUserId?: string;
}

export function CommentSection({ entityType, entityId, comments: initialComments, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentWithMeta[]>(initialComments);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);

  const sortedComments = useMemo(() => {
    const sorted = [...comments];
    sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return sorted;
  }, [comments]);
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
