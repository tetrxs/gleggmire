"use client";

import { useAudioStore } from "@/stores/audio-store";
import type { ClipSource } from "@/types/database";

interface ClipPlayerProps {
  source: ClipSource;
  externalId: string;
  startSeconds: number;
  title: string;
}

function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ClipPlayer({ source, externalId, startSeconds, title }: ClipPlayerProps) {
  const isMuted = useAudioStore((s) => s.isMuted);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div className="relative flex aspect-video w-full items-center justify-center bg-zinc-900">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`flex h-14 w-14 items-center justify-center rounded-full ${source === "youtube" ? "bg-red-600" : "bg-purple-600"}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <span className="text-sm font-semibold text-zinc-300">
            {source === "youtube" ? "YouTube" : "Twitch"} Player — {title}
          </span>
          <span className="text-xs text-zinc-500">
            Start: {formatTimecode(startSeconds)} | react-player wird spaeter integriert
          </span>
        </div>
      </div>
      <div className="absolute top-3 right-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm ${isMuted ? "bg-red-500" : "bg-emerald-500"}`}>
          {isMuted ? "Stumm" : "Ton an"}
        </span>
      </div>
    </div>
  );
}
