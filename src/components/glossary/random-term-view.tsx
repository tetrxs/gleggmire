"use client";

import { useState, useCallback } from "react";
import { XpButton } from "@/components/ui/xp-button";
import { MOCK_TERMS, MOCK_DEFINITIONS } from "@/lib/mock-data";
import { SketchDivider } from "@/components/ui/sketch-elements";
import Link from "next/link";

export function RandomTermView() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [displayTerm, setDisplayTerm] = useState<string | null>(null);

  const spin = useCallback(() => {
    setIsSpinning(true);
    let counter = 0;
    const totalSpins = 15;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * MOCK_TERMS.length);
      setDisplayTerm(MOCK_TERMS[randomIdx].term);
      counter++;

      if (counter >= totalSpins) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * MOCK_TERMS.length);
        setCurrentIndex(finalIdx);
        setDisplayTerm(MOCK_TERMS[finalIdx].term);
        setIsSpinning(false);
      }
    }, 150);
  }, []);

  const selectedTerm =
    currentIndex !== null ? MOCK_TERMS[currentIndex] : null;
  const selectedDef = selectedTerm
    ? MOCK_DEFINITIONS.find((d) => d.term_id === selectedTerm.id)
    : null;

  return (
    <div className="space-y-8">
      {/* Roulette Card */}
      <div
        className="rounded-xl border p-8 text-center"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <h2
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Glegg-Roulette
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--color-muted)" }}>
          Drück den Button und entdecke einen zufälligen Begriff aus dem
          Gleggmire-Universum!
        </p>

        {/* Slot machine display */}
        <div
          className="mx-auto max-w-md rounded-xl border-2 border-dashed p-8 mb-8"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className={`text-3xl font-bold tracking-tight transition-all duration-200 ${
              isSpinning ? "animate-pulse text-[var(--color-accent)]" : ""
            }`}
            style={{
              fontFamily: "var(--font-heading)",
              color: isSpinning ? "var(--color-accent)" : "var(--color-text)",
            }}
          >
            {displayTerm || "???"}
          </p>
        </div>

        <XpButton variant="primary" onClick={spin} disabled={isSpinning}>
          {isSpinning ? "Dreht sich..." : "Glegg-Roulette!"}
        </XpButton>
      </div>

      {/* Show result after spin */}
      {selectedTerm && !isSpinning && (
        <div
          className="rounded-xl border p-6 space-y-4 animate-fade-in"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <h2
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {selectedTerm.term}
          </h2>

          {selectedTerm.phonetic && (
            <p className="font-mono text-sm" style={{ color: "var(--color-muted)" }}>
              {selectedTerm.phonetic}
            </p>
          )}

          {selectedDef && (
            <div
              className="rounded-lg border-l-2 pl-4 py-2 space-y-2"
              style={{ borderColor: "var(--color-accent)" }}
            >
              <p className="text-sm leading-relaxed">{selectedDef.definition}</p>
              {selectedDef.example_sentence && (
                <p className="text-sm italic" style={{ color: "var(--color-muted)" }}>
                  &ldquo;{selectedDef.example_sentence}&rdquo;
                </p>
              )}
            </div>
          )}

          <SketchDivider className="text-[var(--color-border)]" />

          <div className="flex gap-3 pt-2">
            <Link href={`/glossar/${selectedTerm.slug}`}>
              <XpButton variant="primary">Zum vollständigen Eintrag</XpButton>
            </Link>
            <XpButton onClick={spin}>Nochmal!</XpButton>
          </div>
        </div>
      )}
    </div>
  );
}
