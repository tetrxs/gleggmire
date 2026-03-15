"use client";

import { useState, useRef } from "react";
import { XpButton } from "@/components/ui/xp-button";
import type { AttachmentType } from "@/types/database";

export interface AttachmentData {
  type: AttachmentType;
  url: string;
  file?: File;
  startSeconds?: number;
  title?: string;
}

interface AttachmentPickerProps {
  mode: "image" | "gif" | "youtube" | "twitch";
  onAttach: (data: AttachmentData) => void;
  onCancel: () => void;
}

function isValidYouTubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/.test(url) || /^https?:\/\/youtu\.be\/[\w-]+/.test(url);
}
function isValidTwitchUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?twitch\.tv\//.test(url) || /^https?:\/\/clips\.twitch\.tv\//.test(url);
}
function extractYouTubeId(url: string): string | null {
  const match = url.match(/youtube\.com\/watch\?v=([\w-]+)/) || url.match(/youtu\.be\/([\w-]+)/);
  return match ? match[1] : null;
}

export function AttachmentPicker({ mode, onAttach, onCancel }: AttachmentPickerProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [startSeconds, setStartSeconds] = useState(0);
  const [validated, setValidated] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (mode === "image" || mode === "gif") {
    const accept = mode === "image" ? ".jpg,.jpeg,.png,.webp" : ".gif";
    const maxSize = mode === "image" ? 10 : 20;
    const label = mode === "image" ? "Bild" : "GIF";

    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3 dark:border-zinc-700">
        <p className="text-sm font-semibold text-[var(--color-text)]">{label} hochladen</p>
        <p className="text-xs text-[var(--color-muted)]">Max. {maxSize}MB{mode === "image" ? " (JPG, PNG, WEBP)" : " (.gif)"}</p>
        <input
          ref={fileRef} type="file" accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > maxSize * 1024 * 1024) { setError(`Datei zu gross! Max. ${maxSize}MB.`); return; }
            onAttach({ type: mode, url: URL.createObjectURL(file), file });
          }}
          className="block w-full text-sm text-[var(--color-text)]"
        />
        {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
        <div className="flex justify-end"><XpButton onClick={onCancel}>Abbrechen</XpButton></div>
      </div>
    );
  }

  const isYoutube = mode === "youtube";
  const placeholder = isYoutube ? "https://youtube.com/watch?v=... oder https://youtu.be/..." : "https://twitch.tv/... oder https://clips.twitch.tv/...";
  const label = isYoutube ? "YouTube-Video" : "Twitch Clip";

  function handleValidate() {
    setError("");
    if (!(isYoutube ? isValidYouTubeUrl(url) : isValidTwitchUrl(url))) { setError(`Ungueltige ${label}-URL.`); return; }
    setValidated(true);
  }

  function handleConfirm() {
    onAttach({ type: isYoutube ? "youtube" : "twitch", url, startSeconds: isYoutube ? startSeconds : undefined, title: isYoutube ? `YouTube Video (${extractYouTubeId(url) ?? "???"})` : `Twitch Clip` });
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3 dark:border-zinc-700">
      <p className="text-sm font-semibold text-[var(--color-text)]">{label} verlinken</p>
      {!validated ? (
        <>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[#E8593C] dark:border-zinc-700" />
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <XpButton onClick={onCancel}>Abbrechen</XpButton>
            <XpButton variant="primary" onClick={handleValidate} disabled={!url.trim()}>Pruefen</XpButton>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 space-y-2 dark:border-zinc-700">
            <p className="text-sm font-semibold truncate">{isYoutube ? `YouTube Video (${extractYouTubeId(url) ?? url})` : `Twitch Clip`}</p>
            <p className="text-xs text-[var(--color-muted)] truncate">{url}</p>
            {isYoutube && (
              <label className="flex items-center gap-2 text-sm">
                <span>Startpunkt:</span>
                <input type="range" min={0} max={600} value={startSeconds} onChange={(e) => setStartSeconds(Number(e.target.value))} className="flex-1 accent-[#E8593C]" />
                <span className="font-mono w-12 text-right">{Math.floor(startSeconds / 60)}:{String(startSeconds % 60).padStart(2, "0")}</span>
              </label>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <XpButton onClick={() => setValidated(false)}>Zurueck</XpButton>
            <XpButton variant="primary" onClick={handleConfirm}>Anhaengen</XpButton>
          </div>
        </>
      )}
    </div>
  );
}
