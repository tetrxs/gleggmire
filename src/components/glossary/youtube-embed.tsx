"use client";

import { useEffect, useRef, useState, useId } from "react";
import { loadYouTubeApi, formatTime, CLIP_DURATION } from "@/lib/youtube-api";
import { useYouTubeMute } from "@/lib/youtube-mute-context";
import { useCookieConsent } from "@/components/ui/cookie-consent";
import type { YTPlayer } from "@/lib/youtube-api";

interface YouTubeEmbedProps {
  videoId: string;
  startSeconds?: number;
  title?: string;
}

function EmbedBlockedPlaceholder({ videoId, startSeconds, title }: YouTubeEmbedProps) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}${(startSeconds ?? 0) > 0 ? `&t=${startSeconds}` : ""}`;

  return (
    <div className="space-y-1.5">
      {title && (
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="truncate font-medium" style={{ color: "var(--color-text)" }}>{title}</span>
          <span>&middot;</span>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 underline transition-colors hover:text-[var(--color-accent)]"
          >
            Ganzes Video
          </a>
        </div>
      )}
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-lg border"
        style={{
          maxWidth: "400px",
          aspectRatio: "16 / 9",
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div className="text-center">
          <p className="text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>
            YouTube-Inhalte wurden blockiert
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Erfordert Einwilligung fuer Drittanbieter-Embeds
          </p>
        </div>
        <button
          onClick={() => window.dispatchEvent(new Event("open-cookie-settings"))}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
          style={{
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          Einstellungen oeffnen
        </button>
      </div>
      {!title && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Ganzes Video
        </a>
      )}
    </div>
  );
}

export function YouTubeEmbed({ videoId, startSeconds = 0, title }: YouTubeEmbedProps) {
  const { prefs } = useCookieConsent();
  const reactId = useId();
  const containerId = `yt-embed-${videoId}-${reactId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [ready, setReady] = useState(false);
  const isVisibleRef = useRef(false);
  const { globalMuted } = useYouTubeMute();

  const embedsAllowed = prefs?.embeds === true;
  const clipStart = startSeconds;
  const clipEnd = startSeconds + CLIP_DURATION;

  // Create player
  useEffect(() => {
    if (!embedsAllowed) return;
    let destroyed = false;

    loadYouTubeApi().then(() => {
      if (destroyed || !document.getElementById(containerId)) return;
      playerRef.current = new window.YT!.Player(containerId, {
        host: "https://www.youtube-nocookie.com",
        videoId,
        width: "100%",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          controls: 0,
          disablekb: 1,
          showinfo: 0,
          iv_load_policy: 3,
          mute: 1,
          playsinline: 1,
        },
        events: {
          onReady: (event: { target: YTPlayer }) => {
            if (destroyed) return;
            event.target.seekTo(clipStart, true);
            setReady(true);
          },
        },
      });
    });

    return () => {
      destroyed = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      playerRef.current?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, containerId, embedsAllowed]);

  // IntersectionObserver: auto-play when visible, pause when not
  useEffect(() => {
    if (!embedsAllowed || !ready || !containerRef.current) return;
    const el = containerRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          playerRef.current?.seekTo(clipStart, true);
          playerRef.current?.playVideo();
          // Apply current mute state when becoming visible
          if (globalMuted) {
            playerRef.current?.mute();
          } else {
            playerRef.current?.unMute();
          }
        } else {
          playerRef.current?.pauseVideo();
          playerRef.current?.mute();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [embedsAllowed, ready, clipStart, globalMuted]);

  // Sync mute state: unmute only if visible AND global mute is off
  useEffect(() => {
    if (!embedsAllowed || !ready || !playerRef.current) return;
    if (globalMuted || !isVisibleRef.current) {
      playerRef.current.mute();
    } else {
      playerRef.current.unMute();
    }
  }, [embedsAllowed, ready, globalMuted]);

  // Loop logic
  useEffect(() => {
    if (!embedsAllowed || !ready) return;
    intervalRef.current = setInterval(() => {
      if (!playerRef.current || !isVisibleRef.current) return;
      const t = playerRef.current.getCurrentTime();
      if (t >= clipEnd || t < clipStart - 1) {
        playerRef.current.seekTo(clipStart, true);
      }
    }, 200);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [embedsAllowed, ready, clipStart, clipEnd]);

  if (!embedsAllowed) {
    return <EmbedBlockedPlaceholder videoId={videoId} startSeconds={startSeconds} title={title} />;
  }

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}${startSeconds > 0 ? `&t=${startSeconds}` : ""}`;

  return (
    <div ref={containerRef} className="space-y-1.5">
      {/* Title + link to full video */}
      {title && (
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="truncate font-medium" style={{ color: "var(--color-text)" }}>{title}</span>
          <span>&middot;</span>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 underline transition-colors hover:text-[var(--color-accent)]"
          >
            Ganzes Video
          </a>
        </div>
      )}

      {/* Video container — compact, 16:9, max 400px wide */}
      <div
        className="group/video relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-black"
        style={{ maxWidth: "400px", aspectRatio: "16 / 9" }}
      >
        <div id={containerId} className="absolute inset-0 h-full w-full" />
        {/* Timecode badge — always visible */}
        {ready && (
          <div className="absolute bottom-1.5 left-1.5 pointer-events-none">
            <span className="rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-mono text-white">
              {formatTime(clipStart)} – {formatTime(clipEnd)}
            </span>
          </div>
        )}
      </div>

      {/* Fallback link when no title */}
      {!title && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline transition-colors hover:text-[var(--color-accent)]"
          style={{ color: "var(--color-text-muted)" }}
        >
          Ganzes Video
        </a>
      )}
    </div>
  );
}
