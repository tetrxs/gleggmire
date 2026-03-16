"use client";

import { useState, useRef } from "react";
import { useAuth, redirectToLogin } from "@/lib/hooks/use-auth";
import { AttachmentPicker, type AttachmentData } from "@/components/comments/attachment-picker";
import type { CommentEntityType } from "@/types/database";

interface CommentEditorProps {
  entityType: CommentEntityType;
  entityId: string;
  parentId?: string;
  onSubmit?: (comment: Record<string, unknown>) => void;
  onCancel?: () => void;
  compact?: boolean;
}

type PickerMode = "image" | "gif" | "youtube" | "twitch" | null;

export function CommentEditor({ entityType, entityId, parentId, onSubmit, onCancel, compact = false }: CommentEditorProps) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const canSubmit = (text.trim().length > 0 || attachment !== null) && !submitting;

  async function handleSubmit() {
    if (!user) { redirectToLogin(); return; }
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          parent_id: parentId ?? null,
          text: text.trim() || null,
          is_anonymous: false,
          attachment_type: attachment?.type ?? null,
          attachment_url: attachment?.url ?? null,
          attachment_start_seconds: attachment?.startSeconds ?? null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unbekannter Fehler" }));
        if (res.status === 401) {
          setError("Bitte einloggen um zu kommentieren.");
        } else {
          setError(data.error ?? "Fehler beim Abschicken");
        }
        setSubmitting(false);
        return;
      }

      const newComment = await res.json();
      setText("");
      setAttachment(null);
      setPickerMode(null);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      onSubmit?.(newComment);
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen.");
    }
    setSubmitting(false);
  }

  function handleAttach(data: AttachmentData) { setAttachment(data); setPickerMode(null); }
  function removeAttachment() { setAttachment(null); }
  function openPicker(mode: PickerMode) { setPickerMode(mode); setDropdownOpen(false); }

  return (
    <div className="space-y-2 text-sm">
      {/* Attachment preview — above the input like a file chip */}
      {attachment && (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          {(attachment.type === "image" || attachment.type === "gif") && (
            <img src={attachment.url} alt="Anhang" className="h-8 w-8 rounded object-cover" />
          )}
          {attachment.type === "youtube" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444" className="shrink-0"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z"/></svg>
          )}
          {attachment.type === "twitch" && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#9146FF" className="shrink-0"><path d="M2.149 0L.537 4.119V20.839h5.569V24h3.581l3.194-3.163h4.88L24 14.597V0H2.149zm19.74 13.532l-3.58 3.532h-5.57l-3.19 3.16v-3.16H4.269V2.118H21.89v11.414z"/></svg>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-[var(--color-text)]">
              {attachment.title ?? attachment.url}
            </p>
            {attachment.type === "youtube" && attachment.startSeconds !== undefined && attachment.startSeconds > 0 && (
              <p className="text-[10px] text-[var(--color-text-muted)]">ab {Math.floor(attachment.startSeconds / 60)}:{String(attachment.startSeconds % 60).padStart(2, "0")}</p>
            )}
          </div>
          <button type="button" onClick={removeAttachment} className="shrink-0 text-[var(--color-text-muted)] hover:text-red-500 transition-colors" title="Entfernen">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Attachment picker */}
      {pickerMode && <AttachmentPicker mode={pickerMode} onAttach={handleAttach} onCancel={() => setPickerMode(null)} />}

      {/* Input row: text + attach button + send button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => { if (!user) redirectToLogin(); }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && canSubmit) { e.preventDefault(); handleSubmit(); } }}
            placeholder={compact ? "Antworten..." : (user ? "Kommentar hinzufuegen..." : "Einloggen um zu kommentieren...")}
            rows={1}
            className="w-full resize-none rounded-lg border px-3 py-2 pr-10 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[#E8593C] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              minHeight: compact ? "36px" : "40px",
              maxHeight: "120px",
              fieldSizing: "content",
            } as React.CSSProperties}
          />
        </div>

        {/* Attach button — icon only */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            disabled={pickerMode !== null}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)] disabled:opacity-40"
            title="Anhaengen"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute bottom-full right-0 mb-1 w-52 z-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg overflow-hidden">
              {[
                { mode: "image" as const, label: "Bild hochladen" },
                { mode: "gif" as const, label: "GIF hochladen" },
                { mode: "youtube" as const, label: "YouTube-Video" },
                { mode: "twitch" as const, label: "Twitch Clip" },
              ].map((item) => (
                <button key={item.mode} type="button" onClick={() => openPicker(item.mode)} className="w-full text-left px-3 py-2 text-xs hover:bg-[#E8593C] hover:text-white transition-colors">{item.label}</button>
              ))}
            </div>
          )}
        </div>

        {/* Send button — icon only */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-30"
          style={{
            backgroundColor: canSubmit ? "#E8593C" : "transparent",
            color: canSubmit ? "white" : "var(--color-text-muted)",
          }}
          title="Abschicken"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>

        {/* Cancel for replies */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)]"
            title="Abbrechen"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
      {submitted && <p className="text-xs font-medium text-emerald-600">Kommentar abgeschickt!</p>}
    </div>
  );
}
