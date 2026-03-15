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
  { id: "pending-1", term: "Glegg-Ratio", definitionPreview: "Wenn Gleggmire jemanden so hart ratioed, dass die Person den Stream verlae...", submittedBy: "CopeLordSupreme", date: "2026-03-14T10:30:00Z", status: "pending" },
  { id: "pending-2", term: "Snench-Alarm", definitionPreview: "Ausruf im Chat, wenn jemand etwas besonders Snench-artiges sagt oder tut...", submittedBy: "SnenchMeister", date: "2026-03-13T18:45:00Z", status: "pending" },
  { id: "pending-3", term: "Kanalratte", definitionPreview: "Bezeichnung fuer einen besonders treuen Zuschauer, der jeden Stream schaut...", submittedBy: "LungenTorpedo69", date: "2026-03-12T22:00:00Z", status: "pending" },
  { id: "pending-4", term: "Torpedieren", definitionPreview: "Jemanden verbal so hart treffen, dass kein Comeback mehr moeglich ist...", submittedBy: "RatioGott", date: "2026-03-12T14:15:00Z", status: "pending" },
  { id: "pending-5", term: "Glegg-Pause", definitionPreview: "Eine unangekuendigte Pause im Stream, in der Gleggmire einfach verschwindet...", submittedBy: "Neuling2025", date: "2026-03-11T09:30:00Z", status: "pending" },
  { id: "pending-6", term: "Chat-Tornado", definitionPreview: "Moment, in dem der Chat komplett eskaliert und keiner mehr weiss was los ist...", submittedBy: "xXClipChimpXx", date: "2026-03-10T20:00:00Z", status: "pending" },
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
      <XpWindow title="Moderations-Queue">
        <div className="mb-3 text-sm text-[var(--color-muted)]">
          {pendingItems.length} Einreichung(en) ausstehend
        </div>

        {pendingItems.length === 0 && (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] p-6 text-center dark:border-zinc-700">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Keine ausstehenden Einreichungen. Alles erledigt!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 dark:border-zinc-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[var(--color-text)]">{item.term}</div>
                  <div className="mt-1 text-sm text-[var(--color-muted)]">
                    {item.definitionPreview}
                  </div>
                  <div className="mt-2 text-xs text-[var(--color-muted)]">
                    Eingereicht von <span className="font-bold">{item.submittedBy}</span> am{" "}
                    {new Date(item.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <XpButton variant="primary" onClick={() => setDialog({ type: "approve", itemId: item.id, term: item.term })}>
                  Freischalten
                </XpButton>
                <XpButton variant="danger" onClick={() => setDialog({ type: "reject", itemId: item.id, term: item.term })}>
                  Ablehnen
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "edit", itemId: item.id, term: item.term })}>
                  Bearbeiten
                </XpButton>
              </div>
            </div>
          ))}
        </div>

        {/* Processed Items */}
        {processedItems.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs text-[var(--color-muted)]">Bereits bearbeitet:</div>
            <div className="flex flex-col gap-1">
              {processedItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-lg p-2.5 text-xs ${
                    item.status === "approved"
                      ? "bg-emerald-50 dark:bg-emerald-950/20"
                      : "bg-red-50 dark:bg-red-950/20"
                  }`}
                >
                  <span className="text-[var(--color-text)]">{item.term} — {item.submittedBy}</span>
                  <span className={`font-bold ${item.status === "approved" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                    {item.status === "approved" ? "FREIGESCHALTET" : "ABGELEHNT"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </XpWindow>

      {/* Approve Dialog */}
      {dialog.type === "approve" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] p-6" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <p className="text-sm text-[var(--color-text)]">
              Bist du sicher, dass du <strong>{dialog.term}</strong> freischalten willst? Der Begriff wird oeffentlich sichtbar.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <XpButton variant="primary" onClick={() => handleApprove(dialog.itemId)}>Ja, freischalten</XpButton>
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {dialog.type === "reject" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] p-6" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <p className="text-sm text-[var(--color-text)]">
              Bist du sicher, dass du <strong>{dialog.term}</strong> ablehnen willst?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <XpButton variant="danger" onClick={() => handleReject(dialog.itemId)}>Ja, ablehnen</XpButton>
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {dialog.type === "edit" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[500px] p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Einreichung bearbeiten — {dialog.term}</p>
            <p className="text-sm text-[var(--color-muted)]">
              Bearbeitungsfunktion wird verfuegbar, sobald die Datenbank verbunden ist.
            </p>
            <div className="mt-5 flex justify-end">
              <XpButton onClick={() => setDialog({ type: "none" })}>Schliessen</XpButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
