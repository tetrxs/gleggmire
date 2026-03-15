"use client";

import { useState, useRef } from "react";
import { XpButton } from "@/components/ui/xp-button";
import {
  AttachmentPicker,
  type AttachmentData,
} from "@/components/comments/attachment-picker";
import type { CommentEntityType } from "@/types/database";

interface CommentEditorProps {
  entityType: CommentEntityType;
  entityId: string;
  parentId?: string;
  onSubmit?: (data: {
    text: string;
    isAnonymous: boolean;
    attachment?: AttachmentData;
  }) => void;
  onCancel?: () => void;
  compact?: boolean;
}

type PickerMode = "image" | "gif" | "youtube" | "twitch" | null;

export function CommentEditor({
  entityType,
  entityId,
  parentId,
  onSubmit,
  onCancel,
  compact = false,
}: CommentEditorProps) {
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
    onSubmit?.({
      text: text.trim(),
      isAnonymous,
      attachment: attachment ?? undefined,
    });
    setText("");
    setAttachment(null);
    setPickerMode(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  function handleAttach(data: AttachmentData) {
    setAttachment(data);
    setPickerMode(null);
  }

  function removeAttachment() {
    setAttachment(null);
  }

  function openPicker(mode: PickerMode) {
    setPickerMode(mode);
    setDropdownOpen(false);
  }

  return (
    <div
      className="space-y-2"
      style={{ fontFamily: "Tahoma, Verdana, sans-serif", fontSize: "11px" }}
    >
      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Was denkst du? Schreib hier... (optional)"
        rows={compact ? 2 : 3}
        className="xp-inset-strong w-full px-2 py-1.5 text-[11px] resize-none"
        style={{
          backgroundColor: "var(--xp-fenster-weiss)",
          fontFamily: "Tahoma, Verdana, sans-serif",
        }}
      />

      {/* Attachment preview */}
      {attachment && (
        <div
          className="xp-raised p-2 relative"
          style={{ backgroundColor: "var(--xp-silber-luna)" }}
        >
          <button
            type="button"
            onClick={removeAttachment}
            className="absolute top-1 right-1 xp-raised w-5 h-5 flex items-center justify-center text-[10px] font-bold hover:bg-red-200"
            title="Anhang entfernen"
          >
            &times;
          </button>
          {(attachment.type === "image" || attachment.type === "gif") && (
            <img
              src={attachment.url}
              alt="Anhang Vorschau"
              className="max-h-32 rounded"
            />
          )}
          {attachment.type === "youtube" && (
            <div className="space-y-1">
              <p className="font-bold text-[10px]">
                {"\uD83C\uDFAC"} {attachment.title ?? "YouTube Video"}
              </p>
              <p className="text-[10px] opacity-70 truncate">{attachment.url}</p>
              {attachment.startSeconds !== undefined && attachment.startSeconds > 0 && (
                <p className="text-[10px]">
                  Startet bei{" "}
                  {Math.floor(attachment.startSeconds / 60)}:
                  {String(attachment.startSeconds % 60).padStart(2, "0")}
                </p>
              )}
            </div>
          )}
          {attachment.type === "twitch" && (
            <div className="space-y-1">
              <p className="font-bold text-[10px]">
                {"\uD83D\uDFE3"} Twitch Clip
              </p>
              <p className="text-[10px] opacity-70 truncate">{attachment.url}</p>
            </div>
          )}
        </div>
      )}

      {/* Attachment Picker (inline) */}
      {pickerMode && (
        <AttachmentPicker
          mode={pickerMode}
          onAttach={handleAttach}
          onCancel={() => setPickerMode(null)}
        />
      )}

      {/* Anonymous toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="accent-[var(--xp-blau-highlight)]"
        />
        <span className="text-[11px]">
          Als Anonymer Schleimbeutel posten
        </span>
      </label>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Attachment dropdown */}
        <div className="relative" ref={dropdownRef}>
          <XpButton
            onClick={() => setDropdownOpen((o) => !o)}
            disabled={pickerMode !== null}
          >
            + Anhaengen
          </XpButton>

          {dropdownOpen && (
            <div
              className="xp-raised absolute bottom-full left-0 mb-1 w-56 z-10"
              style={{
                backgroundColor: "var(--xp-fenster-weiss)",
                fontFamily: "Tahoma, Verdana, sans-serif",
                fontSize: "11px",
              }}
            >
              <button
                type="button"
                onClick={() => openPicker("image")}
                className="w-full text-left px-3 py-1.5 hover:bg-[var(--xp-blau-highlight)] hover:text-white"
              >
                {"\uD83D\uDDBC"} Bild hochladen
              </button>
              <button
                type="button"
                onClick={() => openPicker("gif")}
                className="w-full text-left px-3 py-1.5 hover:bg-[var(--xp-blau-highlight)] hover:text-white"
              >
                GIF GIF suchen oder hochladen
              </button>
              <button
                type="button"
                onClick={() => openPicker("youtube")}
                className="w-full text-left px-3 py-1.5 hover:bg-[var(--xp-blau-highlight)] hover:text-white"
              >
                {"\u25B6"} YouTube-Video verlinken
              </button>
              <button
                type="button"
                onClick={() => openPicker("twitch")}
                className="w-full text-left px-3 py-1.5 hover:bg-[var(--xp-blau-highlight)] hover:text-white"
              >
                {"\uD83D\uDFE3"} Twitch Clip verlinken
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onCancel && (
            <XpButton onClick={onCancel}>Abbrechen</XpButton>
          )}
          <XpButton
            variant="primary"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Abschicken
          </XpButton>
        </div>
      </div>

      {/* Success message */}
      {submitted && (
        <p
          className="font-bold text-center"
          style={{ color: "var(--xp-erfolg-gruen, #008000)" }}
        >
          Kommentar abgeschickt!
        </p>
      )}
    </div>
  );
}
