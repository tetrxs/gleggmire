"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { XpButton } from "@/components/ui/xp-button";

interface DeletionPetitionProps {
  termName: string;
  termId: string;
}

const THRESHOLD = 10;

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
}

function ConfettiAnimation() {
  const pieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#FF0000", "#FFD700", "#00FF00", "#1F4ECC", "#FF00FF", "#E8593C"][
      i % 6
    ],
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 h-3 w-2"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
            borderRadius: "1px",
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export function DeletionPetition({ termName, termId }: DeletionPetitionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [count, setCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load count from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`petition-${termId}`);
    if (stored) {
      const parsed = parseInt(stored, 10);
      setCount(parsed);
      if (parsed >= THRESHOLD) setShowFailed(true);
    }
  }, [termId]);

  const handleSubmit = useCallback(() => {
    if (!reason.trim()) return;

    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem(`petition-${termId}`, String(newCount));
    setReason("");
    setDialogOpen(false);

    if (newCount >= THRESHOLD && !showFailed) {
      setShowConfetti(true);
      setShowFailed(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
  }, [count, reason, termId, showFailed]);

  return (
    <>
      {showConfetti && <ConfettiAnimation />}

      <div className="mt-4 flex items-center gap-3">
        <XpButton variant="danger" onClick={() => setDialogOpen(true)}>
          Petition zum L&ouml;schen
        </XpButton>

        {showFailed && (
          <span
            className="xp-inset inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold"
            style={{
              backgroundColor: "var(--xp-silber-luna)",
              color: "var(--xp-fehler-rot)",
            }}
          >
            Petition gescheitert ({count}x)
          </span>
        )}

        {count > 0 && !showFailed && (
          <span
            className="text-[10px]"
            style={{ color: "var(--xp-border-dark)" }}
          >
            {count}/{THRESHOLD} Stimmen
          </span>
        )}
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="xp-overlay" onClick={() => setDialogOpen(false)}>
          <div
            className="xp-window-outer w-[400px]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Petition zum Loeschen"
          >
            {/* Title Bar */}
            <div className="xp-titlebar">
              <span>Petition zum L&ouml;schen</span>
              <button
                onClick={() => setDialogOpen(false)}
                className="xp-titlebar-btn xp-titlebar-btn-close"
                aria-label="Schliessen"
                type="button"
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path
                    d="M1 1L8 8M8 1L1 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="xp-window p-4">
              <div className="flex items-start gap-3">
                {/* Warning icon */}
                <div className="shrink-0">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M16 2L30 28H2L16 2Z"
                      fill="#FFD700"
                      stroke="#B8860B"
                      strokeWidth="1"
                    />
                    <text
                      x="16"
                      y="24"
                      textAnchor="middle"
                      fill="#000000"
                      fontSize="18"
                      fontWeight="bold"
                      fontFamily="Tahoma, sans-serif"
                    >
                      !
                    </text>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="xp-text-body mb-3">
                    Du willst wirklich &bdquo;{termName}&rdquo; l&ouml;schen
                    lassen? Begr&uuml;nde deine Petition:
                  </p>
                  <textarea
                    ref={textareaRef}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Warum soll dieser Begriff geloescht werden?"
                    rows={4}
                    className="xp-inset w-full resize-none p-2 text-[12px]"
                    style={{
                      backgroundColor: "#FFFFFF",
                      fontFamily: "Tahoma, Verdana, sans-serif",
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <XpButton onClick={() => setDialogOpen(false)}>
                  Abbrechen
                </XpButton>
                <XpButton
                  variant="danger"
                  onClick={handleSubmit}
                  disabled={!reason.trim()}
                >
                  Einreichen
                </XpButton>
              </div>

              <p
                className="mt-3 text-center text-[9px] italic"
                style={{ color: "var(--xp-border-dark)" }}
              >
                Hinweis: Deine Petition wird mit h&ouml;chster Priorit&auml;t
                ignoriert.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
