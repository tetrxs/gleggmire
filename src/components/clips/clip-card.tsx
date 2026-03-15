"use client";

import Link from "next/link";
import type { MockClipData } from "@/lib/mock-clips";

interface ClipCardProps {
  data: MockClipData;
}

function formatTimecode(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function thumbnailColor(id: string): string {
  const colors = ["#2d3436", "#6c5ce7", "#00b894", "#e17055", "#0984e3", "#d63031", "#fdcb6e"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function ClipCard({ data }: ClipCardProps) {
  const { clip, linkedTerms, channelName, startSeconds, commentCount, badges, addedByUsername } = data;
  const isHallOfFame = badges.includes("hall-of-fame");
  const isClipDerWoche = badges.includes("clip-der-woche");

  return (
    <a href={clip.external_url} target="_blank" rel="noopener noreferrer" className="group block transition-transform hover:scale-[1.01] active:scale-[0.99]">
      <div className="card h-full overflow-hidden">
        <div className="relative flex aspect-video w-full items-center justify-center" style={{ backgroundColor: thumbnailColor(clip.id) }}>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform group-hover:scale-110">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <span className="text-xs font-medium text-white/70">{formatTimecode(clip.duration_seconds)}</span>
          </div>
          {startSeconds > 0 && (
            <span className="absolute bottom-2 right-2 rounded-md bg-[#E8593C] px-2 py-0.5 text-xs font-semibold text-white">
              ab {formatTimecode(startSeconds)}
            </span>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isHallOfFame && <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">Hall of Fame</span>}
            {isClipDerWoche && <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">Clip der Woche</span>}
          </div>
        </div>
        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-sm font-semibold leading-snug text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>{clip.title}</h3>
          <span className="text-xs text-[var(--color-muted)]">{channelName}</span>
          {linkedTerms.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {linkedTerms.map((lt) => (
                <Link key={lt.id} href={`/glossar/${lt.slug}`} onClick={(e) => e.stopPropagation()} className="inline-block rounded-full bg-[#E8593C] px-2.5 py-0.5 text-[10px] font-semibold text-white transition-opacity hover:opacity-80">{lt.term}</Link>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3 text-xs text-[var(--color-muted)]">
            <span className="flex items-center gap-1" title="Upvotes">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              {clip.upvotes}
            </span>
            <span className="flex items-center gap-1" title="Kommentare">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              {commentCount}
            </span>
          </div>
          <div className="border-t border-[var(--color-border)] pt-2 text-xs text-[var(--color-muted)] dark:border-zinc-700">
            Hinzugefuegt von <strong className="text-[var(--color-text)]">{addedByUsername}</strong> am {formatDate(clip.submitted_at)}
          </div>
        </div>
      </div>
    </a>
  );
}
