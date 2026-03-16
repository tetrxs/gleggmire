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
      className="flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <span className="text-sm font-medium">{match.term}</span>
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

  // Exact match (Tier 1) - red alert
  if (hasExactMatch && exactMatch) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span className="text-sm font-semibold text-red-700">
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
          <XpButton onClick={() => onNavigate(exactMatch.slug + "#add-definition")}>
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
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-sm font-semibold text-amber-800">
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
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-sm font-semibold text-amber-800">
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
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#D97706"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="text-sm font-semibold text-amber-800">
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
    <div className="mt-4 space-y-2">
      <label className="block text-sm font-medium">
        Warum ist das kein Duplikat?{" "}
        <span className="text-red-500">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
        style={{
          borderColor: hasError ? "#EF4444" : "var(--color-border)",
          backgroundColor: "var(--color-bg)",
          minHeight: "80px",
        }}
        placeholder="Mindestens 10 Zeichen — erkläre kurz den Unterschied..."
      />
      {hasError && (
        <p className="text-xs text-red-500">
          Bitte mindestens 10 Zeichen eingeben.
        </p>
      )}
      <XpButton variant="primary" onClick={onSubmit}>
        Begründung bestätigen & einreichen
      </XpButton>
    </div>
  );
}
