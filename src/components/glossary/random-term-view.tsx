"use client";

import { useState, useCallback } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { MOCK_TERMS, MOCK_DEFINITIONS } from "@/lib/mock-data";
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
    <div className="space-y-6">
      <XpWindow title="🎰 Glegg-Roulette — zufall.exe">
        <div className="text-center space-y-6 py-4">
          <p className="xp-text-body">
            Drück den Button und entdecke einen zufälligen Begriff aus dem
            Gleggmire-Universum!
          </p>

          {/* Slot machine display */}
          <div
            className="xp-inset mx-auto max-w-md p-6"
            style={{ minHeight: "80px" }}
          >
            <p
              className={`text-2xl font-bold text-center ${
                isSpinning ? "animate-pulse" : ""
              }`}
              style={{
                color: isSpinning ? "var(--xp-glegg-orange)" : "#000",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
            >
              {displayTerm || "???"}
            </p>
          </div>

          <XpButton variant="primary" onClick={spin} disabled={isSpinning}>
            {isSpinning ? "🎰 Dreht sich..." : "🎲 Glegg-Roulette!"}
          </XpButton>
        </div>
      </XpWindow>

      {/* Show result after spin */}
      {selectedTerm && !isSpinning && (
        <XpWindow
          title={`📖 Gleggmire-Enzyklopädie — ${selectedTerm.term}.exe`}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{selectedTerm.term}</h2>

            {selectedTerm.phonetic && (
              <p
                className="xp-text-label"
                style={{ fontFamily: "Courier New, monospace" }}
              >
                {selectedTerm.phonetic}
              </p>
            )}

            {selectedDef && (
              <div className="xp-inset p-3 space-y-2">
                <p className="xp-text-body">{selectedDef.definition}</p>
                <p className="xp-text-body italic text-gray-600">
                  &ldquo;{selectedDef.example_sentence}&rdquo;
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Link href={`/glossar/${selectedTerm.slug}`}>
                <XpButton variant="primary">Zum vollständigen Eintrag</XpButton>
              </Link>
              <XpButton onClick={spin}>🎲 Nochmal!</XpButton>
            </div>
          </div>
        </XpWindow>
      )}
    </div>
  );
}
