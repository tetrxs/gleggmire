"use client";

import { useState, useMemo } from "react";
import { CommentEditor } from "@/components/comments/comment-editor";
import { EditCommentModal } from "@/components/comments/edit-comment-modal";
import { getAnonymousName } from "@/lib/constants/anonymous-names";
import type { CommentWithMeta } from "@/lib/data/comments";
import type { CommentEntityType } from "@/types/database";
import { YouTubeEmbed } from "@/components/glossary/youtube-embed";
import { UserLink } from "@/components/ui/user-link";

interface CommentItemProps {
  comment: CommentWithMeta;
  entityType: CommentEntityType;
  entityId: string;
  isReply?: boolean;
  onReplySubmit?: (reply: Record<string, unknown>) => void;
  currentUserId?: string;
  onDeleted?: (commentId: string) => void;
  onEdited?: (commentId: string, updated: Record<string, unknown>) => void;
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

export function CommentItem({ comment, entityType, entityId, isReply = false, onReplySubmit, currentUserId, onDeleted, onEdited }: CommentItemProps) {
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentUserId && !comment.is_anonymous && comment.user_id === currentUserId;

  async function handleDelete() {
    if (!confirm("Kommentar wirklich loeschen?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/comments/${comment.id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted?.(comment.id);
      }
    } catch {
      // silently fail
    }
    setDeleting(false);
  }

  const displayName = useMemo(() => {
    if (comment.is_anonymous) return getAnonymousName(comment.id);
    return comment.username ?? "Unbekannt";
  }, [comment.is_anonymous, comment.id, comment.username]);

  const avatarColor = usernameColor(displayName);
  const initials = getInitials(displayName);

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div id={`comment-${comment.id}`} className={isReply ? "relative pl-10" : ""}>
      {/* Thread connector for replies */}
      {isReply && (
        <div
          className="absolute left-4 top-0 bottom-0 w-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />
      )}

      {/* Comment — flat layout like YouTube/Instagram */}
      <div className={`flex gap-3 ${isReply ? "pt-3" : "py-3"}`}>
        {/* Avatar (only for anonymous — non-anonymous avatar is inside UserLink) */}
        {comment.is_anonymous ? (
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
        ) : comment.avatar_url ? (
          <img
            src={comment.avatar_url}
            alt={displayName}
            className="shrink-0 w-8 h-8 rounded-full object-cover mt-0.5"
          />
        ) : (
          <div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Name + time */}
          <div className="flex items-center gap-2 text-[13px]">
            {!comment.is_anonymous && comment.user_id ? (
              <UserLink
                userId={comment.user_id}
                username={displayName}
                hideAvatar
                size="sm"
              />
            ) : (
              <span className="font-semibold text-[var(--color-text)]">
                {displayName}
              </span>
            )}
            {comment.is_anonymous && (
              <span className="rounded-full bg-zinc-200 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-500">
                ANON
              </span>
            )}
            <span className="text-[var(--color-text-muted)] text-xs">
              {formatTimestamp(comment.created_at)}
            </span>
          </div>

          {/* Text */}
          {comment.text && (
            <p className="mt-0.5 text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-text)]">
              {comment.text}
            </p>
          )}

          {/* Attachment */}
          {comment.attachment_type && comment.attachment_url && (
            <div className="mt-2">
              {(comment.attachment_type === "image" || comment.attachment_type === "gif") && (
                <img src={comment.attachment_url} alt="Anhang" className="max-w-full max-h-64 rounded-lg block" loading="lazy" />
              )}
              {comment.attachment_type === "youtube" && (() => {
                const idMatch = comment.attachment_url!.match(/youtube\.com\/watch\?v=([\w-]+)/) || comment.attachment_url!.match(/youtu\.be\/([\w-]+)/);
                const videoId = idMatch?.[1];
                if (!videoId) return null;
                return <YouTubeEmbed videoId={videoId} startSeconds={comment.attachment_start_seconds ?? 0} />;
              })()}
              {comment.attachment_type === "twitch" && (
                <a
                  href={comment.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 hover:bg-purple-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  Twitch Clip
                </a>
              )}
            </div>
          )}

          {/* Actions row */}
          <div className="mt-1 flex items-center gap-2">
            {!isReply && (
              <button
                type="button"
                onClick={() => setShowReplyEditor((v) => !v)}
                className="text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                {showReplyEditor ? "Abbrechen" : "Antworten"}
              </button>
            )}
            {isOwner && (
              <>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-blue-50 hover:text-blue-500"
                  title="Kommentar bearbeiten"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded p-1 text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Kommentar loeschen"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reply editor */}
      {showReplyEditor && !isReply && (
        <div className="pl-11 pb-2">
          <CommentEditor
            entityType={entityType}
            entityId={entityId}
            parentId={comment.id}
            compact
            onCancel={() => setShowReplyEditor(false)}
            onSubmit={(reply) => { setShowReplyEditor(false); onReplySubmit?.(reply); }}
          />
        </div>
      )}

      {/* Replies */}
      {hasReplies && (
        <div className="relative">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              entityType={entityType}
              entityId={entityId}
              isReply
              currentUserId={currentUserId}
              onDeleted={onDeleted}
              onEdited={onEdited}
            />
          ))}
        </div>
      )}

      {/* Edit Comment Modal */}
      {editModalOpen && (
        <EditCommentModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          comment={comment}
          onSaved={(updated) => {
            setEditModalOpen(false);
            onEdited?.(comment.id, updated);
          }}
        />
      )}
    </div>
  );
}
