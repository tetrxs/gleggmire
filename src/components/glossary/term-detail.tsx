"use client";

import { useState } from "react";
import type {
  GlossaryTerm,
  TermDefinition,
  TermAlias,
  TermTag,
} from "@/types/database";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { XpDialog } from "@/components/ui/xp-dialog";
import { VoteButtons } from "@/components/glossary/vote-buttons";
import { DisputeBanner } from "@/components/glossary/dispute-banner";
import { CopeOMeter } from "@/components/glossary/cope-o-meter";
import { SketchUnderline, SketchDivider } from "@/components/ui/sketch-elements";

interface TermDetailProps {
  term: GlossaryTerm;
  definitions: TermDefinition[];
  aliases: TermAlias[];
  tags: TermTag[];
}

const TAG_CLASSES: Record<string, string> = {
  meme: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
  insider: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  gameplay: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  community: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  catchphrase: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  meta: "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300",
  rage: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  wholesome: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
};

function getTagClasses(tag: string) {
  return TAG_CLASSES[tag.toLowerCase()] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
}

const FAKE_TRANSLATIONS: Record<string, string> = {
  default:
    "This term is untranslatable. It exists only in the Gleggmire-Verse and defies all linguistic conventions. Oxford has been notified.",
};

export function TermDetail({
  term,
  definitions,
  aliases,
  tags,
}: TermDetailProps) {
  const [disputeDialog, setDisputeDialog] = useState(false);
  const [reportDialog, setReportDialog] = useState(false);
  const [translateDialog, setTranslateDialog] = useState(false);

  const totalUpvotes = definitions.reduce((sum, d) => sum + d.upvotes, 0);
  const totalDownvotes = definitions.reduce((sum, d) => sum + d.downvotes, 0);
  const isRatiod = totalDownvotes > totalUpvotes;

  return (
    <div className="space-y-6">
      {/* Ratio'd Banner */}
      {isRatiod && (
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-center shadow-lg">
          <p className="text-lg font-bold tracking-[4px] text-white animate-pulse">
            RATIO&apos;D
          </p>
        </div>
      )}

      {/* Dispute Banner */}
      <DisputeBanner status={term.status} />

      {/* Header Section */}
      <section>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {term.term}
            </h1>
            <SketchUnderline className="mt-1 max-w-[200px] text-[var(--color-accent)]" />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {term.word_type && (
              <span
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                {term.word_type}
              </span>
            )}

            {term.verified_by_gleggmire && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-[var(--color-accent)] text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                Verifiziert
              </span>
            )}

            {term.status === "disputed" && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
                Bestritten
              </span>
            )}

            {term.status === "locked" && (
              <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                Gesperrt
              </span>
            )}
          </div>
        </div>

        {term.phonetic && (
          <p className="mt-2 font-mono text-sm" style={{ color: "var(--color-muted)" }}>
            [{term.phonetic}]
          </p>
        )}
      </section>

      {/* Aliases */}
      {aliases.length > 0 && (
        <section>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            <span className="font-medium" style={{ color: "var(--color-text)" }}>
              Auch bekannt als:
            </span>{" "}
            {aliases.map((a) => a.alias).join(", ")}
          </p>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`rounded-full px-3 py-1 text-xs font-medium ${getTagClasses(tag.tag)}`}
            >
              #{tag.tag}
            </span>
          ))}
        </section>
      )}

      <SketchDivider className="text-[var(--color-border)]" />

      {/* Definitions */}
      <section className="space-y-4">
        <h2
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Definitionen
        </h2>

        {definitions.map((def, index) => (
          <div
            key={def.id}
            className="rounded-xl border p-5 space-y-4"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            {/* Definition number + text */}
            <div className="text-sm leading-relaxed">
              <span
                className="mr-1.5 font-bold text-[var(--color-accent)]"
              >
                {index + 1}.
              </span>
              {def.definition}
            </div>

            {/* Example sentence */}
            {def.example_sentence && (
              <p className="text-sm italic pl-4 border-l-2" style={{ color: "var(--color-muted)", borderColor: "var(--color-border)" }}>
                &ldquo;{def.example_sentence}&rdquo;
              </p>
            )}

            {/* Origin context */}
            {def.origin_context && (
              <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                <span className="font-medium">Herkunft:</span> {def.origin_context}
              </p>
            )}

            {/* Vote buttons */}
            <VoteButtons
              upvotes={def.upvotes}
              downvotes={def.downvotes}
              entityType="definition"
              entityId={def.id}
            />

            {/* Cope Meter */}
            {def.cope_meter_count > 0 && (
              <CopeOMeter
                sum={def.cope_meter_sum}
                count={def.cope_meter_count}
              />
            )}

            {/* Submitted by */}
            <p
              className="text-right text-[11px]"
              style={{ color: "var(--color-muted)" }}
            >
              Eingereicht von{" "}
              <span className="font-medium" style={{ color: "var(--color-text)" }}>
                {def.submitted_by}
              </span>
            </p>
          </div>
        ))}

        {definitions.length === 0 && (
          <div
            className="rounded-xl border border-dashed p-6 text-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>
              Noch keine Definitionen vorhanden. Sei der Erste!
            </p>
          </div>
        )}
      </section>

      <SketchDivider className="text-[var(--color-border)]" />

      {/* Approved-o-Meter */}
      <XpWindow title="Gleggmire-Approved-o-Meter">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Gesamt-Bewertung:</span>
            <div className="flex items-center gap-4 tabular-nums">
              <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {totalUpvotes}
              </span>
              <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400 font-semibold">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {totalDownvotes}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-2.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--color-border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width:
                  totalUpvotes + totalDownvotes > 0
                    ? `${(totalUpvotes / (totalUpvotes + totalDownvotes)) * 100}%`
                    : "50%",
                backgroundColor: isRatiod ? "#EF4444" : "#22C55E",
              }}
            />
          </div>

          <p
            className="text-center text-xs font-medium"
            style={{
              color: isRatiod ? "#EF4444" : "#22C55E",
            }}
          >
            {isRatiod
              ? "Dieser Begriff wurde von der Community ratio'd. Cope harder."
              : "Dieser Begriff ist Gleggmire-approved. W."}
          </p>
        </div>
      </XpWindow>

      <SketchDivider className="text-[var(--color-border)]" />

      {/* Action Buttons */}
      <section className="flex flex-wrap gap-3">
        <XpButton variant="danger" onClick={() => setDisputeDialog(true)}>
          Bestreiten
        </XpButton>
        <XpButton onClick={() => setReportDialog(true)}>
          Melden
        </XpButton>
        <XpButton onClick={() => setTranslateDialog(true)}>
          Auf Englisch übersetzen
        </XpButton>
      </section>

      {/* Metadata Footer */}
      <section
        className="rounded-xl border p-4 space-y-1.5 text-xs"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-muted)",
        }}
      >
        <p>
          <span className="font-medium">Erstellt von:</span> {term.created_by}
        </p>
        <p>
          <span className="font-medium">Erstellt am:</span>{" "}
          {new Date(term.created_at).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p>
          <span className="font-medium">Zuletzt aktualisiert:</span>{" "}
          {new Date(term.updated_at).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </section>

      {/* Dialogs */}
      <XpDialog
        type="warning"
        title="Begriff bestreiten"
        message="Möchtest du diesen Begriff wirklich bestreiten? Gleggmire wird persönlich über das Schicksal dieses Eintrags entscheiden. Dein Cope-Level wird notiert."
        open={disputeDialog}
        onClose={() => setDisputeDialog(false)}
      />

      <XpDialog
        type="info"
        title="Meldung eingegangen"
        message="Ihre Meldung wurde von Gleggmire persönlich geprüft und mit freundlichem Kopfschütteln abgelehnt."
        open={reportDialog}
        onClose={() => setReportDialog(false)}
      />

      <XpDialog
        type="info"
        title="Übersetzung"
        message={
          FAKE_TRANSLATIONS[term.slug] ?? FAKE_TRANSLATIONS.default
        }
        open={translateDialog}
        onClose={() => setTranslateDialog(false)}
      />
    </div>
  );
}
