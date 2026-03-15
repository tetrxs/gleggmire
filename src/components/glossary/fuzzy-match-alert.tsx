"use client";

import { useState } from "react";
import { XpButton } from "@/components/ui/xp-button";
import type { TermMatch } from "@/lib/utils/normalize";

interface FuzzyMatchAlertProps {
  matches: TermMatch[];
  onNavigate: (slug: string) => void;
  onSubmitAnyway: () => void;
}

function MatchCard({
  match,
  onNavigate,
}: {
  match: TermMatch;
  onNavigate: (slug: string) => void;
}) {
  return (
    <div
      className="xp-raised flex items-center justify-between gap-2 px-3 py-2"
      style={{ backgroundColor: "var(--xp-silber-luna)" }}
    >
      <span className="text-[12px] font-bold">{match.term}</span>
      <XpButton onClick={() => onNavigate(match.slug)}>
        Zum Eintrag wechseln
      </XpButton>
    </div>
  );
}

export function FuzzyMatchAlert({
  matches,
  onNavigate,
  onSubmitAnyway,
}: FuzzyMatchAlertProps) {
  const [showAll, setShowAll] = useState(false);
  const [showDuplicateReason, setShowDuplicateReason] = useState(false);
  const [duplicateReason, setDuplicateReason] = useState("");
  const [reasonError, setReasonError] = useState(false);

  if (matches.length === 0) return null;

  const hasExactMatch = matches.some((m) => m.matchType === "exact");
  const exactMatch = matches.find((m) => m.matchType === "exact");

  // Exact match (Tier 1) - red error banner
  if (hasExactMatch && exactMatch) {
    return (
      <div
        className="xp-inset border-2 p-3"
        style={{
          backgroundColor: "#FFF0F0",
          borderColor: "var(--xp-fehler-rot)",
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[14px]" aria-hidden="true">
            ✖
          </span>
          <span
            className="text-[12px] font-bold"
            style={{ color: "var(--xp-fehler-rot)" }}
          >
            Dieser Begriff existiert bereits: &quot;{exactMatch.term}&quot;
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <XpButton
            variant="primary"
            onClick={() => onNavigate(exactMatch.slug)}
          >
            Zum Eintrag wechseln
          </XpButton>
          <XpButton onClick={() => onNavigate(exactMatch.slug)}>
            Definition vorschlagen
          </XpButton>
          <XpButton
            variant="danger"
            onClick={() => {
              /* reset form or scroll up */
            }}
          >
            Abbrechen
          </XpButton>
        </div>
      </div>
    );
  }

  const fuzzyMatches = matches.filter(
    (m) => m.matchType === "fuzzy" || m.matchType === "substring"
  );

  // Handle "submit anyway" with duplicate reason
  const handleSubmitAnyway = () => {
    if (!showDuplicateReason) {
      setShowDuplicateReason(true);
      return;
    }
    if (duplicateReason.trim().length < 10) {
      setReasonError(true);
      return;
    }
    setReasonError(false);
    onSubmitAnyway();
  };

  // Many matches (>4) - collapsed view
  if (fuzzyMatches.length > 4 && !showAll) {
    return (
      <div
        className="xp-inset border-2 p-3"
        style={{
          backgroundColor: "#FFFBE6",
          borderColor: "#B8860B",
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[14px]" aria-hidden="true">
            ⚠️
          </span>
          <span className="text-[12px] font-bold" style={{ color: "#8B6914" }}>
            Es gibt bereits {fuzzyMatches.length} ähnliche Begriffe
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <XpButton onClick={() => setShowAll(true)}>Alle anzeigen</XpButton>
          <XpButton onClick={handleSubmitAnyway}>
            Trotzdem neu einreichen
          </XpButton>
        </div>
        {showDuplicateReason && (
          <DuplicateReasonInput
            value={duplicateReason}
            onChange={setDuplicateReason}
            hasError={reasonError}
            onSubmit={handleSubmitAnyway}
          />
        )}
      </div>
    );
  }

  // Single fuzzy match
  if (fuzzyMatches.length === 1) {
    const match = fuzzyMatches[0];
    return (
      <div
        className="xp-inset border-2 p-3"
        style={{
          backgroundColor: "#FFFBE6",
          borderColor: "#B8860B",
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[14px]" aria-hidden="true">
            ⚠️
          </span>
          <span className="text-[12px] font-bold" style={{ color: "#8B6914" }}>
            Ähnlicher Begriff gefunden: &quot;{match.term}&quot;
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <XpButton variant="primary" onClick={() => onNavigate(match.slug)}>
            Zum Eintrag wechseln
          </XpButton>
          <XpButton onClick={handleSubmitAnyway}>
            Trotzdem neu einreichen
          </XpButton>
        </div>
        {showDuplicateReason && (
          <DuplicateReasonInput
            value={duplicateReason}
            onChange={setDuplicateReason}
            hasError={reasonError}
            onSubmit={handleSubmitAnyway}
          />
        )}
      </div>
    );
  }

  // Multiple matches (2-4, or >4 expanded)
  return (
    <div
      className="xp-inset border-2 p-3"
      style={{
        backgroundColor: "#FFFBE6",
        borderColor: "#B8860B",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[14px]" aria-hidden="true">
          ⚠️
        </span>
        <span className="text-[12px] font-bold" style={{ color: "#8B6914" }}>
          Ähnliche Begriffe gefunden:
        </span>
      </div>
      <div className="mb-3 flex flex-col gap-2">
        {fuzzyMatches.map((match) => (
          <MatchCard key={match.termId} match={match} onNavigate={onNavigate} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <XpButton onClick={handleSubmitAnyway}>
          Trotzdem neu einreichen
        </XpButton>
      </div>
      {showDuplicateReason && (
        <DuplicateReasonInput
          value={duplicateReason}
          onChange={setDuplicateReason}
          hasError={reasonError}
          onSubmit={handleSubmitAnyway}
        />
      )}
    </div>
  );
}

function DuplicateReasonInput({
  value,
  onChange,
  hasError,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  hasError: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="mt-3">
      <label className="mb-1 block text-[11px] font-bold">
        Warum ist das kein Duplikat?{" "}
        <span style={{ color: "var(--xp-fehler-rot)" }}>*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="xp-inset w-full resize-none p-2 text-[12px]"
        style={{
          backgroundColor: "#FFFFFF",
          fontFamily: "Tahoma, Verdana, sans-serif",
          minHeight: "60px",
        }}
        placeholder="Mindestens 10 Zeichen – erkläre kurz den Unterschied..."
      />
      {hasError && (
        <p
          className="mt-1 text-[11px]"
          style={{ color: "var(--xp-fehler-rot)" }}
        >
          Bitte mindestens 10 Zeichen eingeben.
        </p>
      )}
      <div className="mt-2">
        <XpButton variant="primary" onClick={onSubmit}>
          Begründung bestätigen & einreichen
        </XpButton>
      </div>
    </div>
  );
}
