"use client";

import { useAudioStore } from "@/stores/audio-store";
import type { ClipSource } from "@/types/database";

interface ClipPlayerProps {
  source: ClipSource;
  externalId: string;
  startSeconds: number;
  title: string;
}

export function ClipPlayer({
  source,
  externalId,
  startSeconds,
  title,
}: ClipPlayerProps) {
  const isMuted = useAudioStore((s) => s.isMuted);

  return (
    <div className="relative w-full">
      {/* Embed area placeholder */}
      <div
        className="xp-sunken relative flex aspect-video w-full items-center justify-center"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        {source === "youtube" ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--xp-fehler-rot)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span
              className="text-[11px] font-bold"
              style={{ color: "var(--xp-silber-luna)" }}
            >
              YouTube Player — {title}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "#888" }}
            >
              Start: {formatTimecode(startSeconds)} | react-player wird spaeter integriert
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{ backgroundColor: "#9146FF" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span
              className="text-[11px] font-bold"
              style={{ color: "var(--xp-silber-luna)" }}
            >
              Twitch Player — {title}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "#888" }}
            >
              Start: {formatTimecode(startSeconds)} | react-player wird spaeter integriert
            </span>
          </div>
        )}
      </div>

      {/* Mute badge overlay */}
      <div className="absolute top-2 right-2">
        <span
          className="xp-raised inline-flex items-center gap-1 px-2 py-[2px] text-[10px] font-bold"
          style={{
            backgroundColor: isMuted ? "var(--xp-fehler-rot)" : "var(--xp-gruen)",
            color: "#FFFFFF",
          }}
        >
          {isMuted ? "\uD83D\uDD07 Stumm" : "\uD83D\uDD0A Ton an"}
        </span>
      </div>
    </div>
  );
}

function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
