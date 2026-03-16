"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { XpButton } from "@/components/ui/xp-button";
import { loadYouTubeApi, extractYouTubeId, formatTime, CLIP_DURATION } from "@/lib/youtube-api";
import type { YTPlayer } from "@/lib/youtube-api";
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

interface VideoMeta {
  title: string;
  thumbnail_url?: string;
  provider: string;
}

function isValidYouTubeUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/.test(url) || /^https?:\/\/youtu\.be\/[\w-]+/.test(url);
}
function isValidTwitchUrl(url: string): boolean {
  return /^https?:\/\/(www\.)?twitch\.tv\//.test(url) || /^https?:\/\/clips\.twitch\.tv\//.test(url);
}

const NUDGE_STEP = 1; // seconds per arrow click
const BLOCK_VIS_PCT = 20; // clip block always takes 20% of the track width

function YouTubePickerView({
  videoId,
  url,
  meta,
  onAttach,
  onBack,
}: {
  videoId: string;
  url: string;
  meta: VideoMeta | null;
  onAttach: (data: AttachmentData) => void;
  onBack: () => void;
}) {
  const [playerReady, setPlayerReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [clipStart, setClipStart] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<YTPlayer | null>(null);
  const reactId = useId();
  const containerIdRef = useRef(`yt-picker-${videoId}-${reactId.replace(/:/g, "")}`);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const clipStartRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartValueRef = useRef(0);
  const draggingRef = useRef(false);

  clipStartRef.current = clipStart;

  const maxStart = Math.max(0, (duration || 1) - CLIP_DURATION);
  const clipEnd = Math.min(clipStart + CLIP_DURATION, duration || CLIP_DURATION);

  useEffect(() => {
    let destroyed = false;

    loadYouTubeApi().then(() => {
      if (destroyed) return;
      playerRef.current = new window.YT!.Player(containerIdRef.current, {
        videoId,
        height: "220",
        width: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          controls: 0,
          disablekb: 1,
          showinfo: 0,
          mute: 1,
          playsinline: 1,
          host: "https://www.youtube-nocookie.com",
        },
        events: {
          onReady: (event) => {
            if (destroyed) return;
            setDuration(event.target.getDuration());
            setPlayerReady(true);
            event.target.seekTo(0, true);
            event.target.playVideo();
          },
        },
      });
    });

    return () => {
      destroyed = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  }, [videoId]);

  // Loop logic
  useEffect(() => {
    if (!playerReady) return;
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return;
      const t = playerRef.current.getCurrentTime();
      setCurrentTime(t);
      const start = clipStartRef.current;
      const end = start + CLIP_DURATION;
      if (t >= end || t < start - 1) {
        playerRef.current.seekTo(start, true);
      }
    }, 200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playerReady]);

  const seekToClip = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(value, maxStart));
    setClipStart(clamped);
    playerRef.current?.seekTo(clamped, true);
    playerRef.current?.playVideo();
  }, [maxStart]);

  // Drag: grab the timeline and pull left/right
  // Dragging LEFT = forward in time, RIGHT = backward
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartValueRef.current = clipStartRef.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current || !trackRef.current || duration <= 0) return;
    const dx = e.clientX - dragStartXRef.current;
    const trackWidth = trackRef.current.getBoundingClientRect().width;
    // The block is BLOCK_VIS_PCT wide and represents CLIP_DURATION seconds.
    // So 1 pixel = (CLIP_DURATION / (trackWidth * BLOCK_VIS_PCT / 100)) seconds
    const blockWidthPx = trackWidth * BLOCK_VIS_PCT / 100;
    const secondsPerPixel = CLIP_DURATION / blockWidthPx;
    const newStart = dragStartValueRef.current - dx * secondsPerPixel;
    seekToClip(Math.round(newStart));
  }, [duration, seekToClip]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 3 : -3;
    seekToClip(clipStartRef.current + delta);
  }, [seekToClip]);

  function handleConfirm() {
    onAttach({
      type: "youtube",
      url,
      startSeconds: Math.floor(clipStart),
      title: meta?.title ?? `YouTube Video (${videoId})`,
    });
  }

  // Layout math:
  // The clip block is always BLOCK_VIS_PCT% of the container, centered.
  // The strip is wider: it represents the full duration proportionally.
  // stripWidth (as % of container) = (duration / CLIP_DURATION) * BLOCK_VIS_PCT
  // e.g. 600s video, 10s clip, 20% block → strip = 60 * 20% = 1200% of container
  const stripWidthPct = duration > 0 ? (duration / CLIP_DURATION) * BLOCK_VIS_PCT : 100;

  // The block's left edge in the container = 50% - BLOCK_VIS_PCT/2 (centered)
  const blockLeftInContainer = 50 - BLOCK_VIS_PCT / 2;

  // clipStart on the strip is at (clipStart / duration) * stripWidthPct (% of container)
  // We need that point to align with blockLeftInContainer
  // So: stripLeft = blockLeftInContainer - (clipStart / duration) * stripWidthPct
  const clipFraction = duration > 0 ? clipStart / duration : 0;
  const stripLeft = blockLeftInContainer - clipFraction * stripWidthPct;

  // Playhead position within the strip (% of strip width, which is % of container)
  const playheadInStrip = duration > 0 ? (currentTime / duration) * stripWidthPct : 0;
  // Absolute position in container = stripLeft + playheadInStrip
  const playheadPos = stripLeft + playheadInStrip;

  // Generate ticks — only render those currently visible in the container (0-100%)
  const ticks: { pos: number; label: string }[] = [];
  if (playerReady && duration > 0) {
    const tickInterval = duration <= 60 ? 5 : duration <= 300 ? 15 : duration <= 1800 ? 30 : 60;
    for (let t = 0; t <= duration; t += tickInterval) {
      const pos = stripLeft + (t / duration) * stripWidthPct;
      // Only include ticks visible in the viewport (with some margin)
      if (pos >= -5 && pos <= 105) {
        ticks.push({ pos, label: formatTime(t) });
      }
    }
  }

  return (
    <div className="space-y-3">
      {meta && (
        <p className="text-sm font-semibold truncate text-[var(--color-text)]">{meta.title}</p>
      )}

      {/* Embedded YouTube Player */}
      <div className="rounded-lg overflow-hidden border border-[var(--color-border)] bg-black">
        <div id={containerIdRef.current} />
      </div>

      {!playerReady && (
        <p className="text-xs text-[var(--color-text-muted)]">Player wird geladen...</p>
      )}

      {/* Fixed-block timeline: block centered, strip scrolls behind */}
      {playerReady && duration > 0 && (
        <div className="space-y-1.5">
          {/* Clip time badge */}
          <div className="flex items-center justify-center">
            <span
              className="rounded px-2 py-0.5 text-white text-[11px] font-mono"
              style={{ backgroundColor: "#E8593C" }}
            >
              {formatTime(clipStart)} – {formatTime(clipEnd)}
            </span>
          </div>

          {/* Timeline row: [-1s] [====timeline====] [+1s] */}
          <div className="flex items-center gap-1.5">
            {/* Nudge left */}
            <button
              type="button"
              onClick={() => seekToClip(clipStart - NUDGE_STEP)}
              className="shrink-0 flex items-center justify-center rounded h-10 w-8 text-sm transition-colors hover:bg-[var(--color-border)]"
              style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
              title={`-${NUDGE_STEP}s`}
            >
              &#9664;
            </button>

            {/* Timeline viewport */}
            <div
              ref={trackRef}
              className="relative flex-1 h-10 select-none cursor-grab active:cursor-grabbing rounded-lg overflow-hidden"
              style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)" }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onWheel={handleWheel}
            >
              {/* Tick marks — positioned absolutely in container space */}
              {ticks.map((tick) => (
                <div key={tick.label} className="absolute top-0 h-full" style={{ left: `${tick.pos}%` }}>
                  <div className="h-2.5 w-px" style={{ backgroundColor: "var(--color-text-muted)", opacity: 0.3 }} />
                  <span
                    className="absolute top-3 -translate-x-1/2 text-[9px] font-mono whitespace-nowrap"
                    style={{ color: "var(--color-text-muted)", opacity: 0.6 }}
                  >
                    {tick.label}
                  </span>
                </div>
              ))}

              {/* Playhead */}
              {playheadPos >= 0 && playheadPos <= 100 && (
                <div
                  className="absolute top-0 h-full w-0.5"
                  style={{ left: `${playheadPos}%`, backgroundColor: "var(--color-text-muted)", opacity: 0.5 }}
                />
              )}

              {/* Fixed clip block — always centered */}
              <div
                className="absolute top-0 h-full pointer-events-none"
                style={{
                  left: `${blockLeftInContainer}%`,
                  width: `${BLOCK_VIS_PCT}%`,
                  backgroundColor: "rgba(232, 89, 60, 0.15)",
                  borderLeft: "2px solid #E8593C",
                  borderRight: "2px solid #E8593C",
                }}
              />
            </div>

            {/* Nudge right */}
            <button
              type="button"
              onClick={() => seekToClip(clipStart + NUDGE_STEP)}
              className="shrink-0 flex items-center justify-center rounded h-10 w-8 text-sm transition-colors hover:bg-[var(--color-border)]"
              style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}
              title={`+${NUDGE_STEP}s`}
            >
              &#9654;
            </button>
          </div>

          {/* Min/max labels */}
          <div className="flex items-center justify-between px-10 text-[10px] font-mono" style={{ color: "var(--color-text-muted)" }}>
            <span>{formatTime(0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <XpButton onClick={onBack}>Zurueck</XpButton>
        <XpButton variant="primary" onClick={handleConfirm} disabled={!playerReady}>
          Anhaengen
        </XpButton>
      </div>
    </div>
  );
}

export function AttachmentPicker({ mode, onAttach, onCancel }: AttachmentPickerProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [meta, setMeta] = useState<VideoMeta | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (mode === "image" || mode === "gif") {
    const accept = mode === "image" ? ".jpg,.jpeg,.png,.webp" : ".gif";
    const maxSize = mode === "image" ? 10 : 20;
    const label = mode === "image" ? "Bild" : "GIF";

    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
        <p className="text-sm font-semibold text-[var(--color-text)]">{label} hochladen</p>
        <p className="text-xs text-[var(--color-text-muted)]">Max. {maxSize}MB{mode === "image" ? " (JPG, PNG, WEBP)" : " (.gif)"}</p>
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

  async function handleValidate() {
    setError("");
    if (!(isYoutube ? isValidYouTubeUrl(url) : isValidTwitchUrl(url))) {
      setError(`Ungueltige ${label}-URL.`);
      return;
    }

    setLoadingMeta(true);
    try {
      const res = await fetch(`/api/oembed?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        setMeta(data);
      }
    } catch {
      // Non-critical
    } finally {
      setLoadingMeta(false);
    }
    setValidated(true);
  }

  if (validated && isYoutube) {
    const videoId = extractYouTubeId(url);
    if (!videoId) {
      setValidated(false);
      setError("Video-ID konnte nicht erkannt werden.");
      return null;
    }

    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
        <p className="text-sm font-semibold text-[var(--color-text)]">{label} verlinken</p>
        <YouTubePickerView
          videoId={videoId}
          url={url}
          meta={meta}
          onAttach={onAttach}
          onBack={() => setValidated(false)}
        />
      </div>
    );
  }

  function handleConfirmTwitch() {
    onAttach({
      type: "twitch",
      url,
      title: meta?.title ?? "Twitch Clip",
    });
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 space-y-3">
      <p className="text-sm font-semibold text-[var(--color-text)]">{label} verlinken</p>
      {!validated ? (
        <>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={placeholder} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[#E8593C]" />
          {error && <p className="text-sm font-semibold text-red-500">{error}</p>}
          {loadingMeta && <p className="text-xs text-[var(--color-text-muted)]">Lade Video-Infos...</p>}
          <div className="flex justify-end gap-2">
            <XpButton onClick={onCancel}>Abbrechen</XpButton>
            <XpButton variant="primary" onClick={handleValidate} disabled={!url.trim() || loadingMeta}>Pruefen</XpButton>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 space-y-2">
            <p className="text-sm font-semibold truncate">{meta?.title ?? "Twitch Clip"}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{url}</p>
          </div>
          <div className="flex justify-end gap-2">
            <XpButton onClick={() => setValidated(false)}>Zurueck</XpButton>
            <XpButton variant="primary" onClick={handleConfirmTwitch}>Anhaengen</XpButton>
          </div>
        </>
      )}
    </div>
  );
}
