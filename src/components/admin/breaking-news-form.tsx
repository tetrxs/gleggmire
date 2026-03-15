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
      <XpWindow title="📢 Breaking News senden — alert.exe">
        {/* Message Input */}
        <div className="mb-3">
          <label
            className="xp-text-label mb-1 block"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Nachricht:
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="xp-inset w-full p-2"
            style={{
              backgroundColor: "#FFFFFF",
              fontSize: "11px",
              fontFamily: "Tahoma, Verdana, sans-serif",
              minHeight: "80px",
              resize: "vertical",
            }}
            placeholder="Breaking News Nachricht eingeben..."
            maxLength={280}
          />
          <div
            className="xp-text-label mt-1 text-right"
            style={{
              color:
                message.length > 250
                  ? "var(--xp-fehler-rot)"
                  : "var(--xp-border-dark)",
            }}
          >
            {message.length}/280
          </div>
        </div>

        {/* Preview */}
        {message.trim() && (
          <div className="mb-4">
            <div
              className="xp-text-label mb-1"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Vorschau:
            </div>
            <div
              className="xp-raised p-3"
              style={{
                background:
                  "linear-gradient(90deg, #CC0000 0%, #990000 50%, #CC0000 100%)",
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: "12px",
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                borderColor: "#660000",
              }}
            >
              <div className="mb-1 flex items-center gap-2">
                <span
                  style={{
                    animation: "xp-scale-bounce 1s infinite",
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
            className="xp-text-label mb-2"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Letzte Breaking News:
          </div>
          <div
            className="xp-inset p-2"
            style={{ backgroundColor: "#FFFFFF", fontSize: "11px" }}
          >
            <div className="flex items-center justify-between border-b border-[var(--xp-silber-luna)] py-1">
              <span>Gleggmire ist live! Neuer Glossar-Drop incoming.</span>
              <span style={{ color: "var(--xp-border-dark)" }}>
                14.03.2026 22:45
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span>
                Server-Wartung am Wochenende. Downtime: ca. 2 Stunden.
              </span>
              <span style={{ color: "var(--xp-border-dark)" }}>
                10.03.2026 15:00
              </span>
            </div>
          </div>
        </div>
      </XpWindow>

      {/* Step 1: "Bist du sicher?" */}
      {dialog.type === "confirm-first" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[420px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Breaking News senden</span>
              <button
                onClick={() => setDialog({ type: "none" })}
                className="xp-titlebar-btn xp-titlebar-btn-close"
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
            <div className="xp-window p-5">
              <div className="flex items-start gap-4">
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
                <p className="xp-text-body pt-1">
                  Bist du sicher? Diese Nachricht wird an{" "}
                  <strong>alle Nutzer</strong> gesendet und als Banner auf
                  der Seite angezeigt.
                </p>
              </div>
              <div className="mt-5 flex justify-end gap-2">
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
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Type SENDEN to confirm */}
      {dialog.type === "confirm-final" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[420px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div
              className="xp-titlebar"
              style={{
                background:
                  "linear-gradient(180deg, #CC0000 0%, #990000 100%)",
              }}
            >
              <span>ENDGUELTIGE BESTAETIGUNG</span>
              <button
                onClick={() => setDialog({ type: "none" })}
                className="xp-titlebar-btn xp-titlebar-btn-close"
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
            <div className="xp-window p-5">
              <div className="flex items-start gap-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="14" fill="#CC0000" />
                  <circle cx="16" cy="16" r="12" fill="#FF3333" />
                  <path
                    d="M10 10L22 22M22 10L10 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="pt-1">
                  <p className="xp-text-body mb-2">
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
                    className="xp-inset w-full px-2 py-1"
                    style={{
                      backgroundColor: "#FFFFFF",
                      fontSize: "11px",
                      fontFamily: "Tahoma, Verdana, sans-serif",
                    }}
                    placeholder="SENDEN"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="danger"
                  disabled={dialog.confirmText !== "SENDEN"}
                  onClick={handleSend}
                >
                  BREAKING NEWS SENDEN
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {dialog.type === "sent" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[360px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Erfolgreich gesendet</span>
              <button
                onClick={() => setDialog({ type: "none" })}
                className="xp-titlebar-btn xp-titlebar-btn-close"
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
            <div className="xp-window p-5">
              <div className="flex items-start gap-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="14" fill="#1F4ECC" />
                  <circle cx="16" cy="16" r="12" fill="#3A92D8" />
                  <text
                    x="16"
                    y="22"
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="bold"
                    fontFamily="serif"
                  >
                    i
                  </text>
                </svg>
                <p className="xp-text-body pt-1">
                  Breaking News wurde erfolgreich gesendet!
                </p>
              </div>
              <div className="mt-5 flex justify-center">
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  OK
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
