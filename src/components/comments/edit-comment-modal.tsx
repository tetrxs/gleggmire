"use client";

import { useState, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { XpButton } from "@/components/ui/xp-button";
import { AttachmentPicker, type AttachmentData } from "@/components/comments/attachment-picker";

interface EditableComment {
  id: string;
  text?: string;
  attachment_type?: string;
  attachment_url?: string;
  attachment_start_seconds?: number;
}

interface EditCommentModalProps {
  open: boolean;
  onClose: () => void;
  comment: EditableComment;
  onSaved: (updated: Record<string, unknown>) => void;
}

type PickerMode = "youtube" | "twitch" | null;

function buildAttachmentFromComment(comment: EditableComment): AttachmentData | null {
  if (!comment.attachment_type || !comment.attachment_url) return null;
  return {
    type: comment.attachment_type as AttachmentData["type"],
    url: comment.attachment_url,
    startSeconds: comment.attachment_start_seconds,
    title: comment.attachment_type === "youtube"
      ? "YouTube-Video"
      : comment.attachment_type === "twitch"
        ? "Twitch-Clip"
        : undefined,
  };
}

export function EditCommentModal({ open, onClose, comment, onSaved }: EditCommentModalProps) {
  const [text, setText] = useState(comment.text ?? "");
  const [attachment, setAttachment] = useState<AttachmentData | null>(
    buildAttachmentFromComment(comment)
  );
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = (text.trim().length > 0 || attachment !== null) && !submitting;

  function handleAttach(data: AttachmentData) {
    setAttachment(data);
    setPickerMode(null);
  }

  function handleRemoveAttachment() {
    setAttachment(null);
    setPickerMode(null);
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim() && !attachment) {
      setError("Bitte gib einen Text ein oder fuege einen Anhang hinzu.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim() || null,
          attachment_type: attachment?.type ?? null,
          attachment_url: attachment?.url ?? null,
          attachment_start_seconds: attachment?.startSeconds ?? null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unbekannter Fehler" }));
        if (res.status === 401) {
          setError("Bitte einloggen um Kommentare zu bearbeiten.");
        } else if (res.status === 403) {
          setError("Du hast keine Berechtigung diesen Kommentar zu bearbeiten.");
        } else {
          setError(data.error ?? "Fehler beim Speichern.");
        }
        setSubmitting(false);
        return;
      }

      const updated = await res.json();
      onSaved(updated);
      onClose();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen.");
    }
    setSubmitting(false);
  }, [text, attachment, comment.id, onSaved, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Kommentar bearbeiten">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Attachment preview */}
        {attachment && !pickerMode && (
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            {(attachment.type === "image" || attachment.type === "gif") && (
              <img src={attachment.url} alt="Anhang" className="h-8 w-8 rounded object-cover" />
            )}
            {attachment.type === "youtube" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" className="shrink-0">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
              </svg>
            )}
            {attachment.type === "twitch" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#9146FF" className="shrink-0">
                <path d="M2.149 0L.537 4.119V20.839h5.569V24h3.581l3.194-3.163h4.88L24 14.597V0H2.149zm19.74 13.532l-3.58 3.532h-5.57l-3.19 3.16v-3.16H4.269V2.118H21.89v11.414z" />
              </svg>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium" style={{ color: "var(--color-text)" }}>
                {attachment.title ?? attachment.url}
              </p>
              {attachment.type === "youtube" && attachment.startSeconds !== undefined && attachment.startSeconds > 0 && (
                <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                  ab {Math.floor(attachment.startSeconds / 60)}:{String(attachment.startSeconds % 60).padStart(2, "0")}
                </p>
              )}
            </div>
            {attachment.type === "youtube" && (
              <button
                type="button"
                onClick={() => setPickerMode("youtube")}
                className="shrink-0 text-xs font-medium hover:underline"
                style={{ color: "var(--color-text-muted)" }}
              >
                Aendern
              </button>
            )}
            <button
              type="button"
              onClick={handleRemoveAttachment}
              className="shrink-0 text-xs font-medium text-red-500 hover:underline"
            >
              Entfernen
            </button>
          </div>
        )}

        {/* Attachment picker */}
        {pickerMode && (
          <AttachmentPicker
            mode={pickerMode}
            onAttach={handleAttach}
            onCancel={() => setPickerMode(null)}
            initialUrl={attachment?.url ? (
              attachment.startSeconds && attachment.startSeconds > 0
                ? `${attachment.url}${attachment.url.includes("?") ? "&" : "?"}t=${attachment.startSeconds}`
                : attachment.url
            ) : undefined}
          />
        )}

        {/* Text input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Kommentar
          </label>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(null); }}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[#E8593C] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text)",
              minHeight: "80px",
            }}
            placeholder="Kommentar bearbeiten..."
          />
        </div>

        {/* Error */}
        {error && (
          <p
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              color: "var(--color-accent)",
              border: "1px solid var(--color-accent)",
              backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
            }}
          >
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <XpButton onClick={onClose} disabled={submitting}>
            Abbrechen
          </XpButton>
          <XpButton variant="primary" type="submit" disabled={!canSubmit}>
            {submitting ? "Wird gespeichert..." : "Speichern"}
          </XpButton>
        </div>
      </form>
    </Modal>
  );
}
