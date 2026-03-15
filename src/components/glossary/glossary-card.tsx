"use client";

import Link from "next/link";
import type { GlossaryTerm, TermDefinition, TermTag } from "@/types/database";
import { CopeOMeter } from "@/components/glossary/cope-o-meter";

interface GlossaryCardProps {
  term: GlossaryTerm;
  definition?: TermDefinition;
  tags: TermTag[];
}

const TAG_COLORS: Record<string, string> = {
  Klassiker: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  Insider: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  Essen: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  Rauchen: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Lifestyle: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  Slang: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  Universell: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  Meme: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
};

function getTagClasses(tag: string) {
  return TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
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
      className="group block rounded-xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Term heading */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-base font-semibold tracking-tight group-hover:text-[var(--color-accent)] transition-colors duration-200"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {term.term}
          </h3>
          {term.verified_by_gleggmire && (
            <span className="mt-0.5 shrink-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="var(--color-accent)"
                aria-label="Gleggmire-verifiziert"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </span>
          )}
        </div>

        {/* Definition preview */}
        <p
          className="text-sm leading-relaxed line-clamp-3"
          style={{ color: "var(--color-muted)" }}
        >
          {preview}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getTagClasses(tag.tag)}`}
              >
                {tag.tag}
              </span>
            ))}
          </div>
        )}

        {/* Votes inline */}
        {definition && (
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-muted)" }}>
            <span className="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {definition.upvotes}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {definition.downvotes}
            </span>
          </div>
        )}

        {/* Cope-O-Meter */}
        {definition && (
          <CopeOMeter
            sum={definition.cope_meter_sum}
            count={definition.cope_meter_count}
          />
        )}
      </div>
    </Link>
  );
}
