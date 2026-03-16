"use client";

import { useState, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { XpButton } from "@/components/ui/xp-button";
import { AttachmentPicker, type AttachmentData } from "@/components/comments/attachment-picker";
import type { TermDefinition } from "@/types/database";

interface EditDefinitionModalProps {
  open: boolean;
  onClose: () => void;
  definition: TermDefinition;
  termSlug: string;
  onSaved: () => void;
}

type SourceType = "youtube" | "twitch" | "other" | "";

function parseOriginContext(origin?: string): {
  sourceType: SourceType;
  sourceText: string;
  attachment: AttachmentData | null;
} {
  if (!origin) return { sourceType: "", sourceText: "", attachment: null };

  const isYouTube = origin.includes("youtube") || origin.includes("youtu.be");
  const isTwitch = origin.includes("twitch");
  const isUrl = /^https?:\/\//i.test(origin);

  if (isUrl && isYouTube) {
    // Extract start seconds from ?t= or &t=
    const tMatch = origin.match(/[?&]t=(\d+)/);
    const startSeconds = tMatch ? Number(tMatch[1]) : undefined;
    // Strip t= from URL so it is stored cleanly (startSeconds is separate)
    const cleanUrl = origin.replace(/[?&]t=\d+/g, "").replace(/\?$/, "");
    return {
      sourceType: "youtube",
      sourceText: origin,
      attachment: { type: "youtube", url: cleanUrl, startSeconds, title: "YouTube-Video" },
    };
  }

  if (isUrl && isTwitch) {
    return {
      sourceType: "twitch",
      sourceText: origin,
      attachment: { type: "twitch", url: origin, title: "Twitch-Clip" },
    };
  }

  if (origin.trim()) {
    return { sourceType: "other", sourceText: origin, attachment: null };
  }

  return { sourceType: "", sourceText: "", attachment: null };
}

export function EditDefinitionModal({
  open,
  onClose,
  definition,
  termSlug,
  onSaved,
}: EditDefinitionModalProps) {
  const parsed = parseOriginContext(definition.origin_context);

  const [defText, setDefText] = useState(definition.definition);
  const [example, setExample] = useState(definition.example_sentence);
  const [sourceType, setSourceType] = useState<SourceType>(parsed.sourceType);
  const [sourceText, setSourceText] = useState(parsed.sourceText);
  const [attachment, setAttachment] = useState<AttachmentData | null>(parsed.attachment);
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSourceTypeChange(value: string) {
    const st = value as SourceType;
    setSourceType(st);
    setAttachment(null);
    setShowPicker(false);
    setSourceText("");
    if (st === "youtube" || st === "twitch") {
      setShowPicker(true);
    }
  }

  function handleAttach(data: AttachmentData) {
    setAttachment(data);
    setShowPicker(false);
    if (data.type === "youtube" || data.type === "twitch") {
      setSourceText(data.url);
    }
  }

  function handleRemoveAttachment() {
    setAttachment(null);
    setSourceType("");
    setSourceText("");
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: string[] = [];
    if (!defText.trim()) errors.push("Definition");
    if (!example.trim()) errors.push("Beispielsatz");

    if (errors.length > 0) {
      setError(`Bitte fuelle aus: ${errors.join(", ")}`);
      return;
    }

    setSubmitting(true);
    setError(null);

    // Build origin_context
    let originContext: string | null = null;
    if (sourceType === "other" && sourceText.trim()) {
      originContext = sourceText.trim();
    } else if (attachment) {
      // Ensure URL is clean before appending timestamp
      let url = attachment.url.replace(/[?&]t=\d+/g, "").replace(/\?$/, "");
      if (attachment.type === "youtube" && attachment.startSeconds && attachment.startSeconds > 0) {
        const sep = url.includes("?") ? "&" : "?";
        url = `${url}${sep}t=${attachment.startSeconds}`;
      }
      originContext = url;
    }

    try {
      const res = await fetch(`/api/v1/terms/${termSlug}/definitions/${definition.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          definition: defText.trim(),
          example_sentence: example.trim(),
          origin_context: originContext,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unbekannter Fehler" }));
        if (res.status === 401) {
          setError("Bitte einloggen um Definitionen zu bearbeiten.");
        } else if (res.status === 403) {
          setError("Du hast keine Berechtigung diese Definition zu bearbeiten.");
        } else {
          setError(data.error ?? "Fehler beim Speichern.");
        }
        setSubmitting(false);
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen.");
    }
    setSubmitting(false);
  }, [defText, example, sourceType, sourceText, attachment, termSlug, definition.id, onSaved, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Definition bearbeiten">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Definition */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Definition <span className="text-red-500">*</span>
          </label>
          <textarea
            value={defText}
            onChange={(e) => { setDefText(e.target.value); setError(null); }}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              minHeight: "100px",
            }}
            placeholder="Was bedeutet dieser Begriff?"
          />
        </div>

        {/* Beispielsatz */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Beispielsatz <span className="text-red-500">*</span>
          </label>
          <textarea
            value={example}
            onChange={(e) => { setExample(e.target.value); setError(null); }}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              minHeight: "80px",
            }}
            placeholder="z.B. 'Der wurde richtig geglaggmirt gestern'"
          />
        </div>

        {/* Herkunft / Quelle */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Herkunft / Quelle (optional)
          </label>

          {/* Show source type selector only if no attachment is set, or if type is "other" */}
          {!attachment && !showPicker && (
            <select
              value={sourceType}
              onChange={(e) => handleSourceTypeChange(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
            >
              <option value="">— Keine Quelle —</option>
              <option value="youtube">YouTube-Video</option>
              <option value="twitch">Twitch-Clip</option>
              <option value="other">Andere</option>
            </select>
          )}

          {/* Attachment picker */}
          {showPicker && (sourceType === "youtube" || sourceType === "twitch") && (
            <AttachmentPicker
              mode={sourceType}
              onAttach={handleAttach}
              onCancel={() => { setShowPicker(false); if (!attachment) setSourceType(""); }}
              initialUrl={attachment?.url ? (
                attachment.startSeconds && attachment.startSeconds > 0
                  ? `${attachment.url}${attachment.url.includes("?") ? "&" : "?"}t=${attachment.startSeconds}`
                  : attachment.url
              ) : undefined}
            />
          )}

          {/* Attachment preview */}
          {attachment && !showPicker && (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium" style={{ color: "var(--color-text)" }}>
                  {attachment.title ?? attachment.url}
                </p>
                <p className="truncate text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  {attachment.type === "youtube" ? "YouTube" : "Twitch"}
                  {attachment.startSeconds && attachment.startSeconds > 0 && (
                    <> — ab {Math.floor(attachment.startSeconds / 60)}:{String(attachment.startSeconds % 60).padStart(2, "0")}</>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setShowPicker(true); }}
                className="shrink-0 text-xs font-medium hover:underline"
                style={{ color: "var(--color-text-muted)" }}
              >
                Aendern
              </button>
              <button
                type="button"
                onClick={handleRemoveAttachment}
                className="shrink-0 text-xs font-medium text-red-500 hover:underline"
              >
                Entfernen
              </button>
            </div>
          )}

          {/* Free text for "Andere" */}
          {sourceType === "other" && (
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-bg)",
                minHeight: "60px",
              }}
              placeholder="Woher stammt diese Bedeutung? (Stream, Video, Discord, etc.)"
            />
          )}
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
          <XpButton variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Wird gespeichert..." : "Speichern"}
          </XpButton>
        </div>
      </form>
    </Modal>
  );
}
