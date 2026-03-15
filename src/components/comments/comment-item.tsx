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

/** Generate a deterministic color from a username string */
function usernameColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

function getInitials(name: string): string {
  const parts = name.split(/[\s-]+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function formatTimestamp(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "gerade eben";
  if (diffMinutes < 60) return `vor ${diffMinutes}m`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `vor ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `vor ${diffDays}d`;
  const diffMonths = Math.floor(diffDays / 30);
  return `vor ${diffMonths}mo`;
}

export function CommentItem({
  comment,
  entityType,
  entityId,
  isReply = false,
}: CommentItemProps) {
  const [showReplyEditor, setShowReplyEditor] = useState(false);

  const displayName = useMemo(() => {
    if (comment.is_anonymous) {
      return getAnonymousName(comment.id);
    }
    return comment.username ?? "Unbekannt";
  }, [comment.is_anonymous, comment.id, comment.username]);

  const avatarColor = usernameColor(displayName);
  const initials = getInitials(displayName);
  const isRatiod = comment.downvotes > comment.upvotes;

  return (
    <div
      className={`${isReply ? "ml-8 pl-3 border-l-2" : ""}`}
      style={{
        borderColor: isReply ? "var(--xp-border-dark)" : undefined,
        fontFamily: "Tahoma, Verdana, sans-serif",
        fontSize: "11px",
      }}
    >
      <div className="xp-raised p-2.5 space-y-2" style={{ backgroundColor: "var(--xp-fenster-weiss)" }}>
        {/* Header: avatar + name + timestamp */}
        <div className="flex items-center gap-2">
          {/* Avatar circle */}
          <div
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ backgroundColor: avatarColor }}
          >
            {initials}
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-bold truncate" style={{ maxWidth: "180px" }}>
              {displayName}
            </span>
            {comment.is_anonymous && (
              <span
                className="text-[9px] px-1 xp-raised"
                style={{ backgroundColor: "var(--xp-silber-luna)" }}
              >
                ANON
              </span>
            )}
            <span className="opacity-50">&middot;</span>
            <span className="opacity-50 shrink-0">
              {formatTimestamp(comment.created_at)}
            </span>
          </div>
        </div>

        {/* Comment text */}
        {comment.text && (
          <p className="leading-relaxed whitespace-pre-wrap">{comment.text}</p>
        )}

        {/* Attachment */}
        {comment.attachment_type && comment.attachment_url && (
          <div className="xp-inset p-1" style={{ backgroundColor: "#000" }}>
            {(comment.attachment_type === "image" ||
              comment.attachment_type === "gif") && (
              <img
                src={comment.attachment_url}
                alt="Kommentar-Anhang"
                className="max-w-full max-h-64 mx-auto block"
                loading="lazy"
              />
            )}
            {comment.attachment_type === "youtube" && (
              <div
                className="flex flex-col items-center justify-center py-8 text-white"
                style={{ backgroundColor: "#1a1a2e" }}
              >
                <span className="text-3xl mb-2">{"\u25B6"}</span>
                <p className="text-[11px] font-bold">YouTube Video</p>
                <p className="text-[10px] opacity-60 mt-1 truncate max-w-full px-4">
                  {comment.attachment_url}
                </p>
                {comment.attachment_start_seconds !== undefined &&
                  comment.attachment_start_seconds > 0 && (
                    <p className="text-[10px] opacity-50 mt-1">
                      Start: {Math.floor(comment.attachment_start_seconds / 60)}:
                      {String(comment.attachment_start_seconds % 60).padStart(
                        2,
                        "0"
                      )}
                    </p>
                  )}
              </div>
            )}
            {comment.attachment_type === "twitch" && (
              <div
                className="flex flex-col items-center justify-center py-8 text-white"
                style={{ backgroundColor: "#1a1a2e" }}
              >
                <span className="text-3xl mb-2">{"\uD83D\uDFE3"}</span>
                <p className="text-[11px] font-bold">Twitch Clip</p>
                <p className="text-[10px] opacity-60 mt-1 truncate max-w-full px-4">
                  {comment.attachment_url}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Reaction bar */}
        <ReactionBar reactions={comment.reactions} />

        {/* Actions row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <VoteButtons
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
            entityType="comment"
            entityId={comment.id}
          />

          {!isReply && (
            <button
              type="button"
              onClick={() => setShowReplyEditor((v) => !v)}
              className="xp-raised px-2 py-0.5 text-[10px] hover:bg-[var(--xp-silber-luna)] cursor-pointer"
              style={{ fontFamily: "Tahoma, Verdana, sans-serif" }}
            >
              {showReplyEditor ? "Abbrechen" : "Antworten"}
            </button>
          )}
        </div>
      </div>

      {/* Reply editor */}
      {showReplyEditor && !isReply && (
        <div className="ml-8 mt-2">
          <CommentEditor
            entityType={entityType}
            entityId={entityId}
            parentId={comment.id}
            compact
            onCancel={() => setShowReplyEditor(false)}
            onSubmit={() => setShowReplyEditor(false)}
          />
        </div>
      )}

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              entityType={entityType}
              entityId={entityId}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}
