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

  const result: string[] = [];
  let wordCount = 0;
  const nextInsert = 5 + Math.floor(Math.random() * 4);

  for (const token of translated) {
    result.push(token);
    if (token.trim() && !/^[.,!?;:]+$/.test(token)) {
      wordCount++;
      if (wordCount % nextInsert === 0) {
        const interjection = INTERJECTIONS[Math.floor(Math.random() * INTERJECTIONS.length)];
        result.push(`, ${interjection},`);
      }
    }
  }

  if (wordCount > 3) {
    const ending = INTERJECTIONS[Math.floor(Math.random() * INTERJECTIONS.length)];
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
      <p className="text-sm text-[var(--color-text)]">
        Uebersetze normales Deutsch in authentisches Gleggmire-Deutsch.
      </p>

      {/* Input */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--color-text)]">
          Deutsch (Eingabe):
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Gib deutschen Text ein..."
          rows={5}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[#E8593C]"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <XpButton variant="primary" onClick={handleTranslate}>Uebersetzen</XpButton>
        <XpButton onClick={handleClear}>Leeren</XpButton>
      </div>

      {/* Output */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-[var(--color-text)]">
          Gleggmire-Deutsch (Ausgabe):
        </label>
        <textarea
          value={output}
          readOnly
          placeholder="Hier erscheint die Uebersetzung..."
          rows={5}
          className="w-full rounded-lg border border-[var(--color-border)] bg-amber-50 p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] resize-none"
        />
      </div>

      <p className="text-center text-[9px] italic text-[var(--color-text-muted)]">
        Hinweis: Dieser Uebersetzer wurde von der Gleggmire-Akademie fuer Sprachwissenschaften zertifiziert.
      </p>
    </div>
  );
}
