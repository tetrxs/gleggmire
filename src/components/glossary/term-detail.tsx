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

interface TermDetailProps {
  term: GlossaryTerm;
  definitions: TermDefinition[];
  aliases: TermAlias[];
  tags: TermTag[];
}

const TAG_COLORS: Record<string, string> = {
  meme: "#FFD700",
  insider: "#FF6B6B",
  gameplay: "#4ECDC4",
  community: "#45B7D1",
  catchphrase: "#96CEB4",
  meta: "#FFEAA7",
  rage: "#E17055",
  wholesome: "#81ECEC",
  default: "#DFE6E9",
};

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
    <div className="space-y-4">
      {/* Ratio'd Banner */}
      {isRatiod && (
        <div
          className="xp-raised-strong animate-bounce px-4 py-3 text-center font-bold text-white"
          style={{
            backgroundColor: "var(--xp-fehler-rot)",
            fontSize: "18px",
            letterSpacing: "4px",
          }}
        >
          RATIO&apos;D
        </div>
      )}

      {/* Dispute Banner */}
      <DisputeBanner status={term.status} />

      {/* Main Window */}
      <XpWindow title={`\u{1F4D6} Gleggmire-Enzyklopädie — ${term.term}.exe`}>
        <div className="space-y-5 xp-text-body">
          {/* ===== Header ===== */}
          <section>
            <div className="flex flex-wrap items-start gap-3">
              <h1 style={{ fontSize: "24px", fontWeight: 700 }}>
                {term.term}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {term.word_type && (
                  <span
                    className="xp-raised px-2 py-0.5"
                    style={{
                      fontSize: "10px",
                      backgroundColor: "var(--xp-silber-luna)",
                    }}
                  >
                    {term.word_type}
                  </span>
                )}

                {term.verified_by_gleggmire && (
                  <span
                    className="xp-raised px-2 py-0.5 font-bold"
                    style={{
                      fontSize: "10px",
                      backgroundColor: "#FFD700",
                      color: "#333",
                    }}
                  >
                    \u2714 Verifiziert von Gleggmire
                  </span>
                )}

                {term.status === "disputed" && (
                  <span
                    className="xp-raised px-2 py-0.5 font-bold text-white"
                    style={{
                      fontSize: "10px",
                      backgroundColor: "var(--xp-fehler-rot)",
                    }}
                  >
                    Bestritten
                  </span>
                )}

                {term.status === "locked" && (
                  <span
                    className="xp-raised px-2 py-0.5 font-bold"
                    style={{
                      fontSize: "10px",
                      backgroundColor: "#808080",
                      color: "#fff",
                    }}
                  >
                    Gesperrt
                  </span>
                )}
              </div>
            </div>

            {term.phonetic && (
              <p
                className="mt-1"
                style={{ fontSize: "14px", color: "#666", fontStyle: "italic" }}
              >
                [{term.phonetic}]
              </p>
            )}
          </section>

          {/* ===== Aliases ===== */}
          {aliases.length > 0 && (
            <section>
              <p style={{ fontSize: "12px", color: "#555" }}>
                <strong>Auch bekannt als:</strong>{" "}
                {aliases.map((a) => a.alias).join(", ")}
              </p>
            </section>
          )}

          {/* ===== Tags ===== */}
          {tags.length > 0 && (
            <section className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="xp-raised px-2 py-0.5"
                  style={{
                    fontSize: "10px",
                    backgroundColor:
                      TAG_COLORS[tag.tag.toLowerCase()] ?? TAG_COLORS.default,
                  }}
                >
                  #{tag.tag}
                </span>
              ))}
            </section>
          )}

          {/* ===== Definitions ===== */}
          <section className="space-y-4">
            <h2 className="xp-text-heading">Definitionen</h2>

            {definitions.map((def, index) => (
              <div
                key={def.id}
                className="xp-inset bg-white/50 p-3 space-y-3"
              >
                {/* Definition number + text */}
                <div>
                  <span
                    className="font-bold"
                    style={{ color: "var(--xp-blau-start)" }}
                  >
                    {index + 1}.
                  </span>{" "}
                  {def.definition}
                </div>

                {/* Example sentence */}
                {def.example_sentence && (
                  <p style={{ fontStyle: "italic", color: "#444" }}>
                    &ldquo;{def.example_sentence}&rdquo;
                  </p>
                )}

                {/* Origin context */}
                {def.origin_context && (
                  <p style={{ fontSize: "11px", color: "#666" }}>
                    <strong>Herkunft:</strong> {def.origin_context}
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
                  className="text-right"
                  style={{ fontSize: "10px", color: "#888" }}
                >
                  Eingereicht von{" "}
                  <strong style={{ color: "#555" }}>{def.submitted_by}</strong>
                </p>
              </div>
            ))}

            {definitions.length === 0 && (
              <div className="xp-inset bg-white/50 p-3">
                <p style={{ color: "#888", fontStyle: "italic" }}>
                  Noch keine Definitionen vorhanden. Sei der Erste!
                </p>
              </div>
            )}
          </section>

          {/* ===== Vote Section ===== */}
          <XpWindow title={"\u2705 Gleggmire-Approved-o-Meter 3000"}>
            <div className="space-y-3 p-2">
              <div className="flex items-center justify-between">
                <span className="xp-text-body font-bold">
                  Gesamt-Bewertung:
                </span>
                <div className="flex items-center gap-4">
                  <span style={{ color: "var(--xp-gruen)", fontWeight: 700 }}>
                    \u25B2 {totalUpvotes}
                  </span>
                  <span
                    style={{ color: "var(--xp-fehler-rot)", fontWeight: 700 }}
                  >
                    \u25BC {totalDownvotes}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="xp-inset h-5 overflow-hidden bg-white">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width:
                      totalUpvotes + totalDownvotes > 0
                        ? `${(totalUpvotes / (totalUpvotes + totalDownvotes)) * 100}%`
                        : "50%",
                    backgroundColor: isRatiod
                      ? "var(--xp-fehler-rot)"
                      : "var(--xp-gruen)",
                  }}
                />
              </div>

              <p
                className="text-center font-bold"
                style={{
                  fontSize: "12px",
                  color: isRatiod
                    ? "var(--xp-fehler-rot)"
                    : "var(--xp-gruen)",
                }}
              >
                {isRatiod
                  ? "Dieser Begriff wurde von der Community ratio'd. Cope harder."
                  : "Dieser Begriff ist Gleggmire-approved. W."}
              </p>
            </div>
          </XpWindow>

          {/* ===== Action Buttons ===== */}
          <section className="flex flex-wrap gap-2">
            <XpButton variant="danger" onClick={() => setDisputeDialog(true)}>
              \u26A0\uFE0F Bestreiten
            </XpButton>
            <XpButton onClick={() => setReportDialog(true)}>
              \u2691 Melden
            </XpButton>
            <XpButton onClick={() => setTranslateDialog(true)}>
              \uD83C\uDF10 Übersetze auf Englisch
            </XpButton>
          </section>

          {/* ===== Metadata Footer ===== */}
          <section
            className="xp-inset bg-white/30 p-2 space-y-1"
            style={{ fontSize: "10px", color: "#888" }}
          >
            <p>
              <strong>Erstellt von:</strong> {term.created_by}
            </p>
            <p>
              <strong>Erstellt am:</strong>{" "}
              {new Date(term.created_at).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>
              <strong>Zuletzt aktualisiert:</strong>{" "}
              {new Date(term.updated_at).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </section>
        </div>
      </XpWindow>

      {/* ===== Dialogs ===== */}
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
