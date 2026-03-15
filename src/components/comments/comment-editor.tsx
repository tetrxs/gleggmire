"use client";

import { useState, useRef } from "react";
import { XpButton } from "@/components/ui/xp-button";
import { AttachmentPicker, type AttachmentData } from "@/components/comments/attachment-picker";
import type { CommentEntityType } from "@/types/database";

interface CommentEditorProps {
  entityType: CommentEntityType;
  entityId: string;
  parentId?: string;
  onSubmit?: (data: { text: string; isAnonymous: boolean; attachment?: AttachmentData }) => void;
  onCancel?: () => void;
  compact?: boolean;
}

type PickerMode = "image" | "gif" | "youtube" | "twitch" | null;

export function CommentEditor({ entityType, entityId, parentId, onSubmit, onCancel, compact = false }: CommentEditorProps) {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const canSubmit = text.trim().length > 0 || attachment !== null;

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit?.({ text: text.trim(), isAnonymous, attachment: attachment ?? undefined });
    setText("");
    setAttachment(null);
    setPickerMode(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function handleAttach(data: AttachmentData) { setAttachment(data); setPickerMode(null); }
  function removeAttachment() { setAttachment(null); }
  function openPicker(mode: PickerMode) { setPickerMode(mode); setDropdownOpen(false); }

  return (
    <div className="space-y-3 text-sm">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Was denkst du? Schreib hier... (optional)"
        rows={compact ? 2 : 3}
        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[#E8593C] dark:border-zinc-700"
      />

      {attachment && (
        <div className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 dark:border-zinc-700">
          <button type="button" onClick={removeAttachment} className="absolute top-2 right-2 rounded-full bg-zinc-200 p-1 text-xs font-bold hover:bg-red-200 dark:bg-zinc-700 dark:hover:bg-red-900" title="Anhang entfernen">&times;</button>
          {(attachment.type === "image" || attachment.type === "gif") && <img src={attachment.url} alt="Anhang Vorschau" className="max-h-32 rounded" />}
          {attachment.type === "youtube" && (
            <div className="space-y-1">
              <p className="text-xs font-semibold">{attachment.title ?? "YouTube Video"}</p>
              <p className="text-xs text-[var(--color-muted)] truncate">{attachment.url}</p>
              {attachment.startSeconds !== undefined && attachment.startSeconds > 0 && <p className="text-xs">Startet bei {Math.floor(attachment.startSeconds / 60)}:{String(attachment.startSeconds % 60).padStart(2, "0")}</p>}
            </div>
          )}
          {attachment.type === "twitch" && (
            <div className="space-y-1">
              <p className="text-xs font-semibold">Twitch Clip</p>
              <p className="text-xs text-[var(--color-muted)] truncate">{attachment.url}</p>
            </div>
          )}
        </div>
      )}

      {pickerMode && <AttachmentPicker mode={pickerMode} onAttach={handleAttach} onCancel={() => setPickerMode(null)} />}

      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded accent-[#E8593C]" />
        <span className="text-sm text-[var(--color-text)]">Als Anonymer Schleimbeutel posten</span>
      </label>

      <div className="flex items-center justify-between gap-2">
        <div className="relative" ref={dropdownRef}>
          <XpButton onClick={() => setDropdownOpen((o) => !o)} disabled={pickerMode !== null}>+ Anhaengen</XpButton>
          {dropdownOpen && (
            <div className="absolute bottom-full left-0 mb-1 w-56 z-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg overflow-hidden dark:border-zinc-700">
              {[
                { mode: "image" as const, label: "Bild hochladen" },
                { mode: "gif" as const, label: "GIF hochladen" },
                { mode: "youtube" as const, label: "YouTube-Video verlinken" },
                { mode: "twitch" as const, label: "Twitch Clip verlinken" },
              ].map((item) => (
                <button key={item.mode} type="button" onClick={() => openPicker(item.mode)} className="w-full text-left px-4 py-2 text-sm hover:bg-[#E8593C] hover:text-white transition-colors">{item.label}</button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onCancel && <XpButton onClick={onCancel}>Abbrechen</XpButton>}
          <XpButton variant="primary" disabled={!canSubmit} onClick={handleSubmit}>Abschicken</XpButton>
        </div>
      </div>

      {submitted && <p className="text-center text-sm font-semibold text-emerald-600 dark:text-emerald-400">Kommentar abgeschickt!</p>}
    </div>
  );
}
