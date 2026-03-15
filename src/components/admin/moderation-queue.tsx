"use client";

import { useState } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { MOCK_TERMS, MOCK_DEFINITIONS } from "@/lib/mock-data";
import { MOCK_USERS } from "@/lib/mock-users";

interface PendingItem {
  id: string;
  term: string;
  definitionPreview: string;
  submittedBy: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const MOCK_PENDING: PendingItem[] = [
  ...MOCK_TERMS.filter((t) => t.status === "pending").map((t) => {
    const def = MOCK_DEFINITIONS.find((d) => d.term_id === t.id);
    const user = MOCK_USERS.find((u) => u.id === t.created_by);
    return {
      id: t.id,
      term: t.term,
      definitionPreview: def
        ? def.definition.slice(0, 100) + "..."
        : "Keine Definition vorhanden.",
      submittedBy: user?.username ?? t.created_by,
      date: t.created_at,
      status: "pending" as const,
    };
  }),
  {
    id: "pending-1",
    term: "Glegg-Ratio",
    definitionPreview:
      "Wenn Gleggmire jemanden so hart ratioed, dass die Person den Stream verlae...",
    submittedBy: "CopeLordSupreme",
    date: "2026-03-14T10:30:00Z",
    status: "pending",
  },
  {
    id: "pending-2",
    term: "Snench-Alarm",
    definitionPreview:
      "Ausruf im Chat, wenn jemand etwas besonders Snench-artiges sagt oder tut...",
    submittedBy: "SnenchMeister",
    date: "2026-03-13T18:45:00Z",
    status: "pending",
  },
  {
    id: "pending-3",
    term: "Kanalratte",
    definitionPreview:
      "Bezeichnung fuer einen besonders treuen Zuschauer, der jeden Stream schaut...",
    submittedBy: "LungenTorpedo69",
    date: "2026-03-12T22:00:00Z",
    status: "pending",
  },
  {
    id: "pending-4",
    term: "Torpedieren",
    definitionPreview:
      "Jemanden verbal so hart treffen, dass kein Comeback mehr moeglich ist...",
    submittedBy: "RatioGott",
    date: "2026-03-12T14:15:00Z",
    status: "pending",
  },
  {
    id: "pending-5",
    term: "Glegg-Pause",
    definitionPreview:
      "Eine unangekuendigte Pause im Stream, in der Gleggmire einfach verschwindet...",
    submittedBy: "Neuling2025",
    date: "2026-03-11T09:30:00Z",
    status: "pending",
  },
  {
    id: "pending-6",
    term: "Chat-Tornado",
    definitionPreview:
      "Moment, in dem der Chat komplett eskaliert und keiner mehr weiss was los ist...",
    submittedBy: "xXClipChimpXx",
    date: "2026-03-10T20:00:00Z",
    status: "pending",
  },
];

type DialogState =
  | { type: "none" }
  | { type: "approve"; itemId: string; term: string }
  | { type: "reject"; itemId: string; term: string }
  | { type: "edit"; itemId: string; term: string };

export function ModerationQueue() {
  const [items, setItems] = useState<PendingItem[]>(MOCK_PENDING);
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });

  function handleApprove(itemId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: "approved" as const } : item
      )
    );
    setDialog({ type: "none" });
  }

  function handleReject(itemId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: "rejected" as const } : item
      )
    );
    setDialog({ type: "none" });
  }

  const pendingItems = items.filter((i) => i.status === "pending");
  const processedItems = items.filter((i) => i.status !== "pending");

  return (
    <>
      <XpWindow title="📋 Moderations-Queue — pending.exe">
        <div className="mb-3 xp-text-label" style={{ color: "var(--xp-border-dark)" }}>
          {pendingItems.length} Einreichung(en) ausstehend
        </div>

        {pendingItems.length === 0 && (
          <div
            className="xp-inset p-4 text-center"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="xp-text-body" style={{ color: "var(--xp-gruen)" }}>
              Keine ausstehenden Einreichungen. Alles erledigt!
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="xp-raised p-3"
              style={{ backgroundColor: "var(--xp-silber-luna)" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="xp-text-heading">{item.term}</div>
                  <div
                    className="xp-text-body mt-1"
                    style={{ color: "var(--xp-border-darker)" }}
                  >
                    {item.definitionPreview}
                  </div>
                  <div
                    className="xp-text-label mt-2"
                    style={{ color: "var(--xp-border-dark)" }}
                  >
                    Eingereicht von{" "}
                    <span className="font-bold">{item.submittedBy}</span>{" "}
                    am{" "}
                    {new Date(item.date).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <XpButton
                  variant="primary"
                  onClick={() =>
                    setDialog({
                      type: "approve",
                      itemId: item.id,
                      term: item.term,
                    })
                  }
                >
                  Freischalten
                </XpButton>
                <XpButton
                  variant="danger"
                  onClick={() =>
                    setDialog({
                      type: "reject",
                      itemId: item.id,
                      term: item.term,
                    })
                  }
                >
                  Ablehnen
                </XpButton>
                <XpButton
                  onClick={() =>
                    setDialog({
                      type: "edit",
                      itemId: item.id,
                      term: item.term,
                    })
                  }
                >
                  Bearbeiten
                </XpButton>
              </div>
            </div>
          ))}
        </div>

        {/* Processed Items */}
        {processedItems.length > 0 && (
          <div className="mt-4">
            <div className="xp-text-label mb-2" style={{ color: "var(--xp-border-dark)" }}>
              Bereits bearbeitet:
            </div>
            <div className="flex flex-col gap-1">
              {processedItems.map((item) => (
                <div
                  key={item.id}
                  className="xp-inset flex items-center justify-between p-2"
                  style={{
                    backgroundColor:
                      item.status === "approved" ? "#E8F5E8" : "#F5E8E8",
                    fontSize: "11px",
                  }}
                >
                  <span>
                    {item.term} — {item.submittedBy}
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color:
                        item.status === "approved"
                          ? "var(--xp-gruen)"
                          : "var(--xp-fehler-rot)",
                    }}
                  >
                    {item.status === "approved"
                      ? "FREIGESCHALTET"
                      : "ABGELEHNT"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </XpWindow>

      {/* Approve Confirmation Dialog */}
      {dialog.type === "approve" && (
        <div className="xp-overlay" onClick={() => setDialog({ type: "none" })}>
          <div
            className="xp-window-outer w-[400px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Freischalten bestaetigen</span>
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
                  Bist du sicher, dass du <strong>{dialog.term}</strong>{" "}
                  freischalten willst? Der Begriff wird oeffentlich sichtbar.
                </p>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="primary"
                  onClick={() => handleApprove(dialog.itemId)}
                >
                  Ja, freischalten
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      {dialog.type === "reject" && (
        <div className="xp-overlay" onClick={() => setDialog({ type: "none" })}>
          <div
            className="xp-window-outer w-[400px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Ablehnung bestaetigen</span>
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
                <p className="xp-text-body pt-1">
                  Bist du sicher, dass du <strong>{dialog.term}</strong>{" "}
                  ablehnen willst?
                </p>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="danger"
                  onClick={() => handleReject(dialog.itemId)}
                >
                  Ja, ablehnen
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {dialog.type === "edit" && (
        <div className="xp-overlay" onClick={() => setDialog({ type: "none" })}>
          <div
            className="xp-window-outer w-[500px]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Einreichung bearbeiten — {dialog.term}</span>
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
              <p
                className="xp-text-body mb-3"
                style={{ color: "var(--xp-border-dark)" }}
              >
                Bearbeitungsfunktion wird verfuegbar, sobald die Datenbank
                verbunden ist.
              </p>
              <div className="flex justify-end">
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Schliessen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
