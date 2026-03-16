"use client";

import { useState, useEffect } from "react";
import type {
  GlossaryTerm,
  TermDefinition,
  TermAlias,
  TermTag,
} from "@/types/database";
import { VoteButtons } from "@/components/glossary/vote-buttons";
import { DisputeBanner } from "@/components/glossary/dispute-banner";
import { SubmitDefinitionForm } from "@/components/glossary/submit-definition-form";
import { ReportModal } from "@/components/glossary/report-modal";
import { getTagClasses } from "@/lib/constants/tags";
import { YouTubeEmbed } from "@/components/glossary/youtube-embed";
import { UserLink } from "@/components/ui/user-link";
import type { UserInfo } from "@/lib/data/users";
import type { CommentWithMeta } from "@/lib/data/comments";

interface TermDetailProps {
  term: GlossaryTerm;
  definitions: TermDefinition[];
  aliases: TermAlias[];
  tags: TermTag[];
  comments?: CommentWithMeta[];
  userInfoMap?: Record<string, UserInfo>;
  currentUserId?: string;
}


function parseYouTubeOrigin(url: string): { videoId: string; startSeconds: number } | null {
  const idMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/) || url.match(/youtu\.be\/([\w-]+)/);
  if (!idMatch) return null;
  const videoId = idMatch[1];
  const tMatch = url.match(/[?&]t=(\d+)/);
  const startSeconds = tMatch ? Number(tMatch[1]) : 0;
  return { videoId, startSeconds };
}

function DefinitionOrigin({ originContext, videoTitle }: { originContext: string; videoTitle?: string }) {
  const isUrl = /^https?:\/\//i.test(originContext);
  const isYouTube = originContext.includes("youtube") || originContext.includes("youtu.be");
  const isTwitch = originContext.includes("twitch");

  if (isUrl && isYouTube) {
    const parsed = parseYouTubeOrigin(originContext);
    if (parsed) {
      return (
        <div className="mt-3">
          <YouTubeEmbed videoId={parsed.videoId} startSeconds={parsed.startSeconds} title={videoTitle} />
        </div>
      );
    }
  }

  if (!isUrl) {
    return (
      <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
        Herkunft:{" "}
        <span className="font-medium" style={{ color: "var(--color-text)" }}>{originContext}</span>
      </p>
    );
  }

  return (
    <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
      Herkunft:{" "}
      <a href={originContext} target="_blank" rel="noopener noreferrer"
        className="font-medium underline transition-colors hover:text-[var(--color-accent)]"
        style={{ color: "var(--color-text)" }}>
        {isTwitch ? "Twitch-Clip" : "Link"} &#x2197;
      </a>
    </p>
  );
}

export function TermDetail({
  term,
  definitions,
  aliases,
  tags,
  comments = [],
  userInfoMap = {},
  currentUserId,
}: TermDetailProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Auto-open definition form when navigated with #add-definition hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#add-definition") {
      setShowAddForm(true);
    }
  }, []);

  return (
    <div>
      {/* Dispute Banner */}
      <DisputeBanner status={term.status} />

      {/* ============================
          TERM HEADER
          ============================ */}
      <div className="mb-1">
        <div className="flex items-start justify-between gap-3">
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: "var(--color-text)" }}
        >
          {term.term}
          {aliases.length > 0 && (
            <span className="ml-2 text-lg font-normal" style={{ color: "var(--color-text-muted)" }}>
              ({aliases.map((a) => a.alias).join(", ")})
            </span>
          )}
        </h1>
        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="shrink-0 mt-2 rounded-lg p-2 text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-red-500"
          title="Inhalt melden"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
        </button>
        </div>

      </div>

      {/* Meta line */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <span className="inline-flex items-center gap-1">
          von{" "}
          <UserLink
            userId={term.created_by}
            username={userInfoMap[term.created_by]?.username ?? term.created_by}
            avatarUrl={userInfoMap[term.created_by]?.avatar_url}
            size="sm"
          />
        </span>
        <span>&middot;</span>
        <span>
          {new Date(term.created_at).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
        {term.status === "disputed" && (
          <>
            <span>&middot;</span>
            <span className="font-semibold text-red-600">Umstritten</span>
          </>
        )}
        {term.status === "locked" && (
          <>
            <span>&middot;</span>
            <span className="font-semibold text-gray-500">Gesperrt</span>
          </>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${getTagClasses(tag.tag)}`}
            >
              #{tag.tag}
            </span>
          ))}
        </div>
      )}

      {/* ============================
          DEFINITIONEN
          ============================ */}
      <div className="mt-8 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
          Definitionen ({definitions.length})
        </h2>

        {definitions.length === 0 && !showAddForm && (
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Noch keine Definitionen vorhanden.
          </p>
        )}

        {definitions.map((def, idx) => (
          <div key={def.id} id={`definition-${def.id}`}>
            {/* Divider between definitions */}
            {idx > 0 && (
              <div className="my-6 h-px" style={{ backgroundColor: "var(--color-border)" }} />
            )}

            {/* Author + date — same style as term header meta line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
              <span className="inline-flex items-center gap-1">
                von{" "}
                <UserLink
                  userId={def.submitted_by}
                  username={userInfoMap[def.submitted_by]?.username ?? def.submitted_by}
                  avatarUrl={userInfoMap[def.submitted_by]?.avatar_url}
                  size="sm"
                />
              </span>
              <span>&middot;</span>
              <span>
                {new Date(def.created_at).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Definition text */}
            <p className="text-[15px] leading-relaxed" style={{ color: "var(--color-text)" }}>
              {def.definition}
            </p>

            {/* Example sentence */}
            {def.example_sentence && (
              <div className="mt-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                  Beispielsatz:
                </p>
                <p
                  className="pl-3 text-sm italic leading-relaxed"
                  style={{
                    color: "var(--color-text-muted)",
                    borderLeft: "2px solid var(--color-accent)",
                  }}
                >
                  &ldquo;{def.example_sentence}&rdquo;
                </p>
              </div>
            )}

            {/* Origin — YouTube inline embed or link */}
            {def.origin_context && (
              <div className="mt-5">
                <DefinitionOrigin originContext={def.origin_context} />
              </div>
            )}

            {/* Votes */}
            <div className="mt-4">
              <VoteButtons
                upvotes={def.upvotes}
                downvotes={def.downvotes}
                entityType="definition"
                entityId={def.id}
                isOwnContent={currentUserId === def.submitted_by}
              />
            </div>
          </div>
        ))}

        {/* Divider before add button */}
        {definitions.length > 0 && (
          <div className="my-6 h-px" style={{ backgroundColor: "var(--color-border)" }} />
        )}

        {/* Add definition */}
        {showAddForm ? (
          <div>
            <p className="mb-4 text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              Neue Definition hinzufuegen
            </p>
            <SubmitDefinitionForm
              termSlug={term.slug}
              onSuccess={() => setShowAddForm(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
            style={{ color: "var(--color-text-muted)" }}
          >
            + Definition hinzufuegen
          </button>
        )}
      </div>

      {/* Report Modal */}
      <ReportModal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        termId={term.id}
        termName={term.term}
        definitions={definitions}
        comments={comments}
      />

    </div>
  );
}
