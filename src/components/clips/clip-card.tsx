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
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** Deterministic placeholder color from clip ID */
function thumbnailColor(id: string): string {
  const colors = [
    "#2d3436",
    "#6c5ce7",
    "#00b894",
    "#e17055",
    "#0984e3",
    "#d63031",
    "#fdcb6e",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function ClipCard({ data }: ClipCardProps) {
  const {
    clip,
    linkedTerms,
    channelName,
    startSeconds,
    commentCount,
    badges,
    addedByUsername,
  } = data;

  const isHallOfFame = badges.includes("hall-of-fame");
  const isClipDerWoche = badges.includes("clip-der-woche");

  return (
    <a
      href={clip.external_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="xp-window-outer h-full">
        {/* Title Bar */}
        <div className="xp-titlebar">
          <span className="truncate text-[11px]">
            {clip.source === "youtube" ? "yt" : "tw"}://{clip.external_id}
          </span>
          <div className="flex items-center gap-[2px]">
            <span className="xp-titlebar-btn xp-titlebar-btn-minmax pointer-events-none">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <rect x="1" y="7" width="7" height="2" fill="currentColor" />
              </svg>
            </span>
            <span className="xp-titlebar-btn xp-titlebar-btn-close pointer-events-none">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                <path
                  d="M1 1L8 8M8 1L1 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="xp-window p-0">
          {/* Thumbnail placeholder */}
          <div
            className="xp-sunken relative flex aspect-video w-full items-center justify-center"
            style={{ backgroundColor: thumbnailColor(clip.id) }}
          >
            <div className="flex flex-col items-center gap-1">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,0.7)"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-[10px] font-bold text-white/60">
                {formatTimecode(Math.floor(clip.duration_seconds / 60) * 60 === clip.duration_seconds
                  ? clip.duration_seconds
                  : clip.duration_seconds)}
              </span>
            </div>

            {/* Startpoint timecode badge */}
            {startSeconds > 0 && (
              <span
                className="absolute bottom-1 right-1 px-[5px] py-[1px] text-[10px] font-bold text-white"
                style={{ backgroundColor: "var(--glegg-orange)" }}
              >
                ab {formatTimecode(startSeconds)}
              </span>
            )}

            {/* Badges overlay */}
            <div className="absolute top-1 left-1 flex flex-col gap-1">
              {isHallOfFame && (
                <span
                  className="xp-raised px-[5px] py-[1px] text-[9px] font-bold"
                  style={{ backgroundColor: "#D4A017", color: "#000" }}
                >
                  Hall of Fame
                </span>
              )}
              {isClipDerWoche && (
                <span
                  className="xp-raised px-[5px] py-[1px] text-[9px] font-bold"
                  style={{ backgroundColor: "#1F4ECC", color: "#FFF" }}
                >
                  Clip der Woche
                </span>
              )}
            </div>
          </div>

          {/* Info section */}
          <div className="flex flex-col gap-[6px] p-3">
            {/* Title */}
            <h3
              className="text-[12px] font-bold leading-tight"
              style={{ fontFamily: "Tahoma, Verdana, sans-serif" }}
            >
              {clip.title}
            </h3>

            {/* Channel */}
            <span className="xp-text-label text-[10px]">{channelName}</span>

            {/* Linked glossary terms */}
            {linkedTerms.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {linkedTerms.map((lt) => (
                  <Link
                    key={lt.id}
                    href={`/glossar/${lt.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="xp-raised inline-block px-[5px] py-[1px] text-[10px] font-bold transition-colors hover:brightness-110"
                    style={{
                      backgroundColor: "var(--glegg-orange)",
                      color: "#FFF",
                    }}
                  >
                    {lt.term}
                  </Link>
                ))}
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-3">
              <span className="xp-text-label text-[10px]" title="Upvotes">
                <span style={{ color: "var(--xp-gruen)" }}>&#9650;</span>{" "}
                {clip.upvotes}
              </span>
              <span className="xp-text-label text-[10px]" title="Kommentare">
                &#128172; {commentCount}
              </span>
            </div>

            {/* Added by + date */}
            <div
              className="border-t pt-[4px] text-[10px]"
              style={{
                borderColor: "var(--xp-border-dark)",
                color: "#666",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
            >
              Hinzugefuegt von <strong>{addedByUsername}</strong> am{" "}
              {formatDate(clip.submitted_at)}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
