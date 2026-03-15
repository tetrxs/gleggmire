"use client";

import { useState, useCallback } from "react";
import { XpButton } from "@/components/ui/xp-button";

const WORD_MAP: Record<string, string> = {
  person: "Snench",
  mensch: "Snench",
  menschen: "Snenches",
  personen: "Snenches",
  leute: "Snenches",
  essen: "Kanackentasche holen",
  isst: "holt sich ne Kanackentasche",
  esse: "hol mir ne Kanackentasche",
  rauchen: "Lungen-Torpedo zuenden",
  raucht: "zuendet den Lungen-Torpedo",
  rauche: "zuend mir nen Lungen-Torpedo",
  zigarette: "Lungen-Torpedo",
  zigaretten: "Lungen-Torpedos",
  gut: "komplett",
  schlecht: "goi",
  trinken: "Sex Cola kippen",
  trinkt: "kippt Sex Cola",
  trinke: "kipp Sex Cola",
  auto: "Drecksgaul",
  autos: "Drecksgaeule",
  freund: "Sar",
  freunde: "Sars",
  kumpel: "Sar",
  ja: "Pue",
  nein: "Nee Bruder",
  hallo: "Sar was geht",
  tschuess: "Ciao Sar",
  cool: "komplett nice",
  geld: "Schotter",
  arbeit: "Maloche",
  arbeiten: "malochen",
  schlafen: "pennen",
  laufen: "sich bewegen",
  schnell: "zack zack",
  langsam: "auf Schneckentempo",
  haus: "Bude",
  wohnung: "Bude",
  party: "Saufgelage",
  feiern: "einen reinorgeln",
  musik: "Mukke",
  handy: "Quasselkasten",
  computer: "Kiste",
  internet: "das World Wide Glegg",
  schule: "Anstalt",
  polizei: "die Buletten",
  liebe: "Liebe auf Glegg",
  geil: "komplett geil Bruder",
};

const INTERJECTIONS = [
  "Bruder",
  "komplett",
  "auf Glegg",
  "wallah",
  "safe",
  "ich schwoeoe",
  "ey",
  "Sar",
  "kein Ding",
];

function translateText(input: string): string {
  if (!input.trim()) return "";

  // Split into words while preserving whitespace and punctuation
  const tokens = input.split(/(\s+|[.,!?;:]+)/);
  let insertionCounter = 0;

  const translated = tokens.map((token) => {
    const lower = token.toLowerCase();
    const replacement = WORD_MAP[lower];
    if (replacement) {
      insertionCounter++;
      return replacement;
    }
    return token;
  });

  // Add random interjections after every ~5-8 words
  const result: string[] = [];
  let wordCount = 0;
  const nextInsert = 5 + Math.floor(Math.random() * 4);

  for (const token of translated) {
    result.push(token);
    if (token.trim() && !/^[.,!?;:]+$/.test(token)) {
      wordCount++;
      if (wordCount % nextInsert === 0) {
        const interjection =
          INTERJECTIONS[Math.floor(Math.random() * INTERJECTIONS.length)];
        result.push(`, ${interjection},`);
      }
    }
  }

  // Always end with a random interjection if text is long enough
  if (wordCount > 3) {
    const ending =
      INTERJECTIONS[Math.floor(Math.random() * INTERJECTIONS.length)];
    result.push(` (${ending})`);
  }

  return result.join("");
}

export function FakeTranslator() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleTranslate = useCallback(() => {
    setOutput(translateText(input));
  }, [input]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="3"
            fill="var(--xp-blau-start)"
          />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="10"
            fontWeight="bold"
            fontFamily="Tahoma, sans-serif"
          >
            GL
          </text>
        </svg>
        <p className="xp-text-body">
          Uebersetze normales Deutsch in authentisches Gleggmire-Deutsch.
        </p>
      </div>

      {/* Input */}
      <div>
        <label className="xp-text-label mb-1 block font-bold">
          Deutsch (Eingabe):
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Gib deutschen Text ein..."
          rows={5}
          className="xp-inset w-full resize-none p-2 text-[12px]"
          style={{
            backgroundColor: "#FFFFFF",
            fontFamily: "Tahoma, Verdana, sans-serif",
          }}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <XpButton variant="primary" onClick={handleTranslate}>
          Uebersetzen
        </XpButton>
        <XpButton onClick={handleClear}>Leeren</XpButton>
      </div>

      {/* Output */}
      <div>
        <label className="xp-text-label mb-1 block font-bold">
          Gleggmire-Deutsch (Ausgabe):
        </label>
        <textarea
          value={output}
          readOnly
          placeholder="Hier erscheint die Uebersetzung..."
          rows={5}
          className="xp-inset w-full resize-none p-2 text-[12px]"
          style={{
            backgroundColor: "#F5F5DC",
            fontFamily: "Tahoma, Verdana, sans-serif",
          }}
        />
      </div>

      <p
        className="text-center text-[9px] italic"
        style={{ color: "var(--xp-border-dark)" }}
      >
        Hinweis: Dieser Uebersetzer wurde von der Gleggmire-Akademie fuer
        Sprachwissenschaften zertifiziert.
      </p>
    </div>
  );
}
