"use client";

import { useState, useMemo } from "react";
import { VoteButtons } from "@/components/glossary/vote-buttons";
import { ReactionBar } from "@/components/comments/reaction-bar";
import { CommentEditor } from "@/components/comments/comment-editor";
import { getAnonymousName } from "@/lib/constants/anonymous-names";
import type { CommentWithMeta } from "@/lib/mock-comments";
import type { CommentEntityType } from "@/types/database";

interface CommentItemProps {
  comment: CommentWithMeta;
  entityType: CommentEntityType;
  entityId: string;
  isReply?: boolean;
}

function usernameColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

function getInitials(name: string): string {
  const parts = name.split(/[\s-]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatTimestamp(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return "gerade eben";
  if (diffMinutes < 60) return `vor ${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `vor ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `vor ${diffDays}d`;
  return `vor ${Math.floor(diffDays / 30)}mo`;
}

export function CommentItem({ comment, entityType, entityId, isReply = false }: CommentItemProps) {
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const displayName = useMemo(() => {
    if (comment.is_anonymous) return getAnonymousName(comment.id);
    return comment.username ?? "Unbekannt";
  }, [comment.is_anonymous, comment.id, comment.username]);

  const avatarColor = usernameColor(displayName);
  const initials = getInitials(displayName);

  return (
    <div className={isReply ? "ml-8 pl-4 border-l-2 border-[var(--color-border)] dark:border-zinc-700" : ""}>
      <div className="card p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: avatarColor }}>
            {initials}
          </div>
          <div className="flex items-center gap-2 min-w-0 text-sm">
            <span className="font-semibold text-[var(--color-text)] truncate max-w-[180px]">{displayName}</span>
            {comment.is_anonymous && (
              <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">ANON</span>
            )}
            <span className="text-[var(--color-muted)]">&middot;</span>
            <span className="text-[var(--color-muted)] shrink-0 text-xs">{formatTimestamp(comment.created_at)}</span>
          </div>
        </div>

        {/* Text */}
        {comment.text && <p className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">{comment.text}</p>}

        {/* Attachment */}
        {comment.attachment_type && comment.attachment_url && (
          <div className="overflow-hidden rounded-lg bg-zinc-900">
            {(comment.attachment_type === "image" || comment.attachment_type === "gif") && (
              <img src={comment.attachment_url} alt="Kommentar-Anhang" className="max-w-full max-h-64 mx-auto block" loading="lazy" />
            )}
            {comment.attachment_type === "youtube" && (
              <div className="flex flex-col items-center justify-center py-8 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-sm font-semibold">YouTube Video</p>
                <p className="text-xs text-zinc-400 mt-1 truncate max-w-full px-4">{comment.attachment_url}</p>
                {comment.attachment_start_seconds !== undefined && comment.attachment_start_seconds > 0 && (
                  <p className="text-xs text-zinc-500 mt-1">Start: {Math.floor(comment.attachment_start_seconds / 60)}:{String(comment.attachment_start_seconds % 60).padStart(2, "0")}</p>
                )}
              </div>
            )}
            {comment.attachment_type === "twitch" && (
              <div className="flex flex-col items-center justify-center py-8 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-sm font-semibold">Twitch Clip</p>
                <p className="text-xs text-zinc-400 mt-1 truncate max-w-full px-4">{comment.attachment_url}</p>
              </div>
            )}
          </div>
        )}

        <ReactionBar reactions={comment.reactions} />

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <VoteButtons upvotes={comment.upvotes} downvotes={comment.downvotes} entityType="comment" entityId={comment.id} />
          {!isReply && (
            <button
              type="button"
              onClick={() => setShowReplyEditor((v) => !v)}
              className="rounded-lg px-3 py-1 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)] dark:hover:bg-zinc-700"
            >
              {showReplyEditor ? "Abbrechen" : "Antworten"}
            </button>
          )}
        </div>
      </div>

      {showReplyEditor && !isReply && (
        <div className="ml-8 mt-2">
          <CommentEditor entityType={entityType} entityId={entityId} parentId={comment.id} compact onCancel={() => setShowReplyEditor(false)} onSubmit={() => setShowReplyEditor(false)} />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} entityType={entityType} entityId={entityId} isReply />
          ))}
        </div>
      )}
    </div>
  );
}
