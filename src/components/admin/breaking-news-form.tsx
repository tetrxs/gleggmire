"use client";

import { useState } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";

type DialogState =
  | { type: "none" }
  | { type: "confirm-first" }
  | { type: "confirm-final"; confirmText: string }
  | { type: "sent" };

export function BreakingNewsForm() {
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });

  function handleSend() {
    // In production this would send via API
    setDialog({ type: "sent" });
    setMessage("");
  }

  return (
    <>
      <XpWindow title="Breaking News senden">
        {/* Message Input */}
        <div className="mb-3">
          <label
            className="mb-1 block text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Nachricht:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm"
            style={{
              minHeight: "80px",
              resize: "vertical",
            }}
            placeholder="Breaking News Nachricht eingeben..."
            maxLength={280}
          />
          <div
            className="mt-1 text-right text-xs"
            style={{
              color:
                message.length > 250
                  ? "var(--color-error)"
                  : "var(--color-text-muted)",
            }}
          >
            {message.length}/280
          </div>
        </div>

        {/* Preview */}
        {message.trim() && (
          <div className="mb-4">
            <div
              className="mb-1 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Vorschau:
            </div>
            <div
              className="rounded-xl p-3"
              style={{
                background:
                  "linear-gradient(90deg, #DC2626 0%, #B91C1C 50%, #DC2626 100%)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  style={{
                    animation: "breaking-label-pulse 1s infinite",
                    display: "inline-block",
                  }}
                >
                  BREAKING
                </span>
                <span
                  className="h-[1px] flex-1"
                  style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
                />
                <span className="text-[10px] font-normal opacity-70">
                  {new Date().toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div>{message}</div>
            </div>
            <style>{`
              @keyframes breaking-label-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.6; }
              }
            `}</style>
          </div>
        )}

        {/* Send Button */}
        <div className="flex justify-end">
          <XpButton
            variant="danger"
            disabled={!message.trim()}
            onClick={() => setDialog({ type: "confirm-first" })}
          >
            Jetzt senden
          </XpButton>
        </div>

        {/* Previous Breaking News */}
        <div className="mt-4">
          <div
            className="mb-2 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Letzte Breaking News:
          </div>
          <div
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border)] py-1">
              <span>Gleggmire ist live! Neuer Glossar-Drop incoming.</span>
              <span style={{ color: "var(--color-text-muted)" }}>
                14.03.2026 22:45
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>
                Server-Wartung am Wochenende. Downtime: ca. 2 Stunden.
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>
                10.03.2026 15:00
              </span>
            </div>
          </div>
        </div>
      </XpWindow>

      {/* Step 1: "Bist du sicher?" */}
      {dialog.type === "confirm-first" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="card w-[420px] max-w-[90vw] p-6 shadow-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Breaking News senden
                </h4>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Bist du sicher? Diese Nachricht wird an{" "}
                  <strong>alle Nutzer</strong> gesendet und als Banner auf
                  der Seite angezeigt.
                </p>
              </div>
              <button
                onClick={() => setDialog({ type: "none" })}
                className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors"
                aria-label="Schliessen"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4L12 12M12 4L4 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>
                Abbrechen
              </XpButton>
              <XpButton
                variant="danger"
                onClick={() =>
                  setDialog({
                    type: "confirm-final",
                    confirmText: "",
                  })
                }
              >
                Ja, weiter
              </XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Type SENDEN to confirm */}
      {dialog.type === "confirm-final" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="card w-[420px] max-w-[90vw] p-6 shadow-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                  Endgueltige Bestaetigung
                </h4>
                <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
                  Tippe <strong>SENDEN</strong> ein, um die Breaking
                  News zu bestaetigen:
                </p>
                <input
                  type="text"
                  value={dialog.confirmText}
                  onChange={(e) =>
                    setDialog({
                      ...dialog,
                      confirmText: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  placeholder="SENDEN"
                />
              </div>
              <button
                onClick={() => setDialog({ type: "none" })}
                className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors"
                aria-label="Schliessen"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4L12 12M12 4L4 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>
                Abbrechen
              </XpButton>
              <XpButton
                variant="danger"
                disabled={dialog.confirmText !== "SENDEN"}
                onClick={handleSend}
              >
                BREAKING NEWS SENDEN
              </XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {dialog.type === "sent" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="card w-[360px] max-w-[90vw] p-6 shadow-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                  Erfolgreich gesendet
                </h4>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                  Breaking News wurde erfolgreich gesendet!
                </p>
              </div>
              <button
                onClick={() => setDialog({ type: "none" })}
                className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors"
                aria-label="Schliessen"
                type="button"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4L12 12M12 4L4 12" />
                </svg>
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <XpButton variant="primary" onClick={() => setDialog({ type: "none" })}>
                OK
              </XpButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
