"use client";

import Link from "next/link";
import type { GlossaryTerm, TermDefinition, TermTag } from "@/types/database";
import { getTagClasses } from "@/lib/constants/tags";

interface GlossaryCardProps {
  term: GlossaryTerm;
  definitions: TermDefinition[];
  tags: TermTag[];
  commentCount?: number;
  creatorUsername?: string;
  creatorAvatarUrl?: string | null;
}

function getInitials(name: string): string {
  const parts = name.split(/[\s-]+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function usernameColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

export function GlossaryCard({ term, definitions, tags, commentCount, creatorUsername, creatorAvatarUrl }: GlossaryCardProps) {
  const topDef = definitions[0];
  const preview = topDef
    ? topDef.definition.length > 120
      ? topDef.definition.slice(0, 120) + "..."
      : topDef.definition
    : "Noch keine Definition vorhanden.";

  const totalUpvotes = definitions.reduce((sum, d) => sum + d.upvotes, 0);

  return (
    <Link
      href={`/glossar/${term.slug}`}
      className="card-hover group block p-5 no-underline"
    >
      <div className="flex flex-col gap-3">
        {/* Term heading + first tag */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold tracking-tight group-hover:text-[var(--color-accent)] transition-colors duration-200">
            {term.term}
          </h3>
          {tags.length > 0 && (
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${getTagClasses(tags[0].tag)}`}
            >
              {tags[0].tag}
            </span>
          )}
        </div>

        {/* Definition preview */}
        <p
          className="text-sm leading-relaxed line-clamp-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          {preview}
        </p>

        {/* Tags row (remaining tags) */}
        {tags.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(1, 4).map((tag) => (
              <span
                key={tag.id}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getTagClasses(tag.tag)}`}
              >
                {tag.tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-[10px] font-medium" style={{ color: "var(--color-text-muted)" }}>
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 text-[11px] font-medium" style={{ color: "var(--color-text-muted)" }}>
          {/* Definitions count */}
          <span className="inline-flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
            {definitions.length} {definitions.length === 1 ? "Definition" : "Definitionen"}
          </span>

          {/* Comment count */}
          {commentCount !== undefined && commentCount > 0 && (
            <span className="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              {commentCount}
            </span>
          )}

          {/* Total upvotes */}
          {totalUpvotes > 0 && (
            <span className="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v12" />
                <path d="M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2a3.13 3.13 0 013 3.88z" />
              </svg>
              {totalUpvotes}
            </span>
          )}
        </div>

        {/* Creator row */}
        {creatorUsername && (
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
            <span>von</span>
            {creatorAvatarUrl ? (
              <img
                src={creatorAvatarUrl}
                alt={creatorUsername}
                className="h-4 w-4 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span
                className="h-4 w-4 shrink-0 rounded-full flex items-center justify-center text-[6px] font-bold text-white"
                style={{ backgroundColor: usernameColor(creatorUsername) }}
              >
                {getInitials(creatorUsername)}
              </span>
            )}
            <span className="font-medium" style={{ color: "var(--color-text)" }}>
              {creatorUsername}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
