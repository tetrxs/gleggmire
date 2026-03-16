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
    color: ["#FF0000", "#FFD700", "#00FF00", "#2563eb", "#FF00FF", "#E8593C"][i % 6],
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 h-3 w-2 rounded-sm"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
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
          Petition zum Loeschen
        </XpButton>

        {showFailed && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
            Petition gescheitert ({count}x)
          </span>
        )}

        {count > 0 && !showFailed && (
          <span className="text-[10px] text-[var(--color-text-muted)]">
            {count}/{THRESHOLD} Stimmen
          </span>
        )}
      </div>

      {/* Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialogOpen(false)}>
          <div
            className="card w-[400px] p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Petition zum Loeschen"
          >
            <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Petition zum Loeschen</p>
            <p className="text-sm text-[var(--color-text)] mb-3">
              Du willst wirklich &bdquo;{termName}&rdquo; loeschen lassen? Begruende deine Petition:
            </p>
            <textarea
              ref={textareaRef}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Warum soll dieser Begriff geloescht werden?"
              rows={4}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[#E8593C]"
            />

            <div className="mt-4 flex justify-end gap-2">
              <XpButton onClick={() => setDialogOpen(false)}>Abbrechen</XpButton>
              <XpButton variant="danger" onClick={handleSubmit} disabled={!reason.trim()}>
                Einreichen
              </XpButton>
            </div>

            <p className="mt-3 text-center text-[9px] italic text-[var(--color-text-muted)]">
              Hinweis: Deine Petition wird mit hoechster Prioritaet ignoriert.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
