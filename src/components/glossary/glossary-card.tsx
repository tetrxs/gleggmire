"use client";

import Link from "next/link";
import type { GlossaryTerm, TermDefinition, TermTag } from "@/types/database";
import { CopeOMeter } from "@/components/glossary/cope-o-meter";

interface GlossaryCardProps {
  term: GlossaryTerm;
  definition?: TermDefinition;
  tags: TermTag[];
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Klassiker: { bg: "#1F4ECC", text: "#FFFFFF" },
  Insider: { bg: "#8B5CF6", text: "#FFFFFF" },
  Essen: { bg: "#E8593C", text: "#FFFFFF" },
  Rauchen: { bg: "#6B7280", text: "#FFFFFF" },
  Lifestyle: { bg: "#3A9E3A", text: "#FFFFFF" },
  Slang: { bg: "#D4A017", text: "#000000" },
  Universell: { bg: "#3A6EA5", text: "#FFFFFF" },
  Meme: { bg: "#EC4899", text: "#FFFFFF" },
};

function getTagStyle(tag: string) {
  return TAG_COLORS[tag] ?? { bg: "var(--xp-silber-luna)", text: "#000000" };
}

export function GlossaryCard({ term, definition, tags }: GlossaryCardProps) {
  const preview = definition
    ? definition.definition.length > 100
      ? definition.definition.slice(0, 100) + "..."
      : definition.definition
    : "Keine Definition vorhanden.";

  return (
    <Link
      href={`/glossar/${term.slug}`}
      className="block transition-transform hover:scale-[1.01] active:scale-[0.99]"
    >
      <div className="xp-window-outer">
        {/* Title Bar */}
        <div className="xp-titlebar">
          <span className="truncate text-[12px]">[{term.term}].exe</span>
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
        <div className="xp-window p-3">
          <div className="flex flex-col gap-2">
            {/* Definition preview */}
            <p className="text-[12px] leading-relaxed">{preview}</p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => {
                  const style = getTagStyle(tag.tag);
                  return (
                    <span
                      key={tag.id}
                      className="xp-raised inline-block px-[6px] py-[1px] text-[10px] font-bold"
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                      }}
                    >
                      {tag.tag}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Votes & Badge row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                {definition && (
                  <>
                    <span className="xp-text-label" title="Upvotes">
                      <span style={{ color: "var(--xp-gruen)" }}>&#9650;</span>{" "}
                      {definition.upvotes}
                    </span>
                    <span className="xp-text-label" title="Downvotes">
                      <span style={{ color: "var(--xp-fehler-rot)" }}>&#9660;</span>{" "}
                      {definition.downvotes}
                    </span>
                  </>
                )}
              </div>

              {term.verified_by_gleggmire && (
                <span
                  className="xp-raised inline-flex items-center gap-1 px-[6px] py-[1px] text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--xp-gruen)",
                    color: "#FFFFFF",
                  }}
                >
                  &#10003; Gleggmire-verifiziert
                </span>
              )}
            </div>

            {/* Cope-O-Meter */}
            {definition && (
              <CopeOMeter
                sum={definition.cope_meter_sum}
                count={definition.cope_meter_count}
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
