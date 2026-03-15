"use client";

import { useState, useCallback, useRef } from "react";
import { XpButton } from "@/components/ui/xp-button";
import { SketchDivider } from "@/components/ui/sketch-elements";
import Link from "next/link";

interface RandomTermData {
  id: string;
  slug: string;
  term: string;
  phonetic: string | null;
  word_type: string | null;
  status: string;
  definitions: { definition: string; example_sentence: string | null }[];
  tags: { tag: string }[];
  aliases: { alias: string }[];
}

const SPIN_WORDS = [
  "Gleggmire",
  "Snench",
  "Blödsinn",
  "Schleim",
  "Kackwurst",
  "Troll",
  "Unfug",
  "Quatsch",
  "Mumpitz",
  "Schabernack",
  "Firlefanz",
  "Kokolores",
  "Papperlapapp",
  "Humbug",
  "Hokuspokus",
];

export function RandomTermView() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayTerm, setDisplayTerm] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<RandomTermData | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const spin = useCallback(async () => {
    setIsSpinning(true);
    setSelectedTerm(null);

    // Start the fetch in parallel with the spin animation
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchPromise = fetch("/api/v1/terms/random", {
      signal: controller.signal,
    }).then((res) => (res.ok ? res.json() : null));

    // Run the visual spin animation
    let counter = 0;
    const totalSpins = 15;
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * SPIN_WORDS.length);
        setDisplayTerm(SPIN_WORDS[randomIdx]);
        counter++;

        if (counter >= totalSpins) {
          clearInterval(interval);
          resolve();
        }
      }, 150);
    });

    // Wait for the fetch to finish
    try {
      const data: RandomTermData | null = await fetchPromise;
      if (data) {
        setSelectedTerm(data);
        setDisplayTerm(data.term);
      } else {
        setDisplayTerm("Fehler :(");
      }
    } catch {
      setDisplayTerm("Fehler :(");
    }

    setIsSpinning(false);
  }, []);

  const firstDef = selectedTerm?.definitions?.[0] ?? null;

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

          {firstDef && (
            <div
              className="rounded-lg border-l-2 pl-4 py-2 space-y-2"
              style={{ borderColor: "var(--color-accent)" }}
            >
              <p className="text-sm leading-relaxed">{firstDef.definition}</p>
              {firstDef.example_sentence && (
                <p className="text-sm italic" style={{ color: "var(--color-muted)" }}>
                  &ldquo;{firstDef.example_sentence}&rdquo;
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
