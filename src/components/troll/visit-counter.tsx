"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "gleggmire-visit-count";
const BASE_COUNT = 69420;

function formatCount(n: number): string {
  return n.toLocaleString("de-DE");
}

function Digit({ value, rolling }: { value: string; rolling: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-sm"
      style={{
        width: "16px",
        height: "22px",
        backgroundColor: "#000000",
        color: "#33FF33",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "14px",
        fontWeight: "bold",
        animation: rolling ? "digit-roll 0.6s ease-out" : "none",
      }}
    >
      {value}
    </span>
  );
}

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const current = stored ? parseInt(stored, 10) : BASE_COUNT;
    const next = current + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    setCount(next);

    // Trigger rolling animation
    setRolling(true);
    const timer = setTimeout(() => setRolling(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (count === null) return null;

  const formatted = formatCount(count);
  const chars = formatted.split("");

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center gap-[1px] rounded-lg px-2 py-1"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        {chars.map((char, i) => {
          if (char === ".") {
            return (
              <span
                key={i}
                className="text-[14px] font-bold"
                style={{
                  color: "#33FF33",
                  fontFamily: "'Courier New', Courier, monospace",
                }}
              >
                .
              </span>
            );
          }
          return <Digit key={i} value={char} rolling={rolling} />;
        })}
      </div>
      <span
        className="text-[9px] uppercase tracking-widest"
        style={{ color: "var(--color-text-muted)" }}
      >
        Besucher seit 2026
      </span>
      <style>{`
        @keyframes digit-roll {
          0%   { transform: translateY(-100%); opacity: 0; }
          60%  { transform: translateY(10%); opacity: 1; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
