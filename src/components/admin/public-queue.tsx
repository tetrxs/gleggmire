"use client";

import { useState } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { XpDialog } from "@/components/ui/xp-dialog";

interface QueueItem {
  id: string;
  term: string;
  definition: string;
  submittedBy: string;
  date: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  status: "pending" | "auto-approved" | "sent-back";
}

const INITIAL_QUEUE: QueueItem[] = [
  { id: "q1", term: "Auf Glegg", definition: "Wenn etwas 'auf Glegg' passiert, bedeutet das, dass es auf eine besonders chaotische, unterhaltsame oder unerwartete Weise geschieht.", submittedBy: "xXClipChimpXx", date: "2026-03-15T10:00:00Z", upvotes: 8, downvotes: 1, userVote: null, status: "pending" },
  { id: "q2", term: "Glegg-Ratio", definition: "Wenn Gleggmire jemanden so hart ratioed, dass die Person den Stream verlaesst. Gilt als hoechste Form der Demontage.", submittedBy: "CopeLordSupreme", date: "2026-03-14T18:30:00Z", upvotes: 6, downvotes: 2, userVote: null, status: "pending" },
  { id: "q3", term: "Snench-Alarm", definition: "Ausruf im Chat, wenn jemand etwas besonders Snench-artiges sagt oder tut. Wird oft mit CAPSLOCK geschrieben.", submittedBy: "SnenchMeister", date: "2026-03-14T14:15:00Z", upvotes: 4, downvotes: 0, userVote: null, status: "pending" },
  { id: "q4", term: "Kanalratte", definition: "Bezeichnung fuer einen besonders treuen Zuschauer, der jeden Stream schaut, jeden Clip kennt und jedes Meme versteht.", submittedBy: "LungenTorpedo69", date: "2026-03-13T20:00:00Z", upvotes: 7, downvotes: 1, userVote: null, status: "pending" },
  { id: "q5", term: "Torpedieren", definition: "Jemanden verbal so hart treffen, dass kein Comeback mehr moeglich ist. Abgeleitet von Lungen-Torpedo.", submittedBy: "RatioGott", date: "2026-03-12T16:45:00Z", upvotes: 3, downvotes: 0, userVote: null, status: "pending" },
  { id: "q6", term: "Chat-Tornado", definition: "Moment, in dem der Chat komplett eskaliert und keiner mehr weiss was los ist. Tritt oft nach kontroversen Takes auf.", submittedBy: "xXClipChimpXx", date: "2026-03-11T12:00:00Z", upvotes: 2, downvotes: 7, userVote: null, status: "pending" },
  { id: "q7", term: "Glegg-Pause", definition: "Eine unangekuendigte Pause im Stream, in der Gleggmire einfach verschwindet. Kann 5 Minuten oder 2 Stunden dauern.", submittedBy: "Neuling2025", date: "2026-03-10T08:30:00Z", upvotes: 5, downvotes: 1, userVote: null, status: "pending" },
];

const AUTO_APPROVE_THRESHOLD = 10;
const SENT_BACK_THRESHOLD = 10;

export function PublicQueue() {
  const [items, setItems] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [notification, setNotification] = useState<{ type: "info" | "warning"; title: string; message: string } | null>(null);

  function handleVote(itemId: string, voteType: "up" | "down") {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        if (item.status !== "pending") return item;

        let newUp = item.upvotes;
        let newDown = item.downvotes;
        let newVote: "up" | "down" | null = voteType;

        if (item.userVote === "up") newUp--;
        if (item.userVote === "down") newDown--;

        if (item.userVote === voteType) {
          newVote = null;
        } else {
          if (voteType === "up") newUp++;
          if (voteType === "down") newDown++;
        }

        let newStatus: QueueItem["status"] = item.status;
        if (newUp >= AUTO_APPROVE_THRESHOLD) {
          newStatus = "auto-approved";
          setNotification({ type: "info", title: "Automatisch freigeschaltet!", message: `"${item.term}" hat ${AUTO_APPROVE_THRESHOLD} Upvotes erreicht und wurde automatisch freigeschaltet!` });
        } else if (newDown >= SENT_BACK_THRESHOLD) {
          newStatus = "sent-back";
          setNotification({ type: "warning", title: "Zurueckgesendet", message: `"${item.term}" hat ${SENT_BACK_THRESHOLD} Downvotes erreicht und wurde zurueckgesendet.` });
        }

        return { ...item, upvotes: newUp, downvotes: newDown, userVote: newVote, status: newStatus };
      })
    );
  }

  const pendingItems = items.filter((i) => i.status === "pending");
  const resolvedItems = items.filter((i) => i.status !== "pending");

  return (
    <>
      <XpWindow title="Warteschlange — Neue Einreichungen">
        {/* Info box */}
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
          <div className="flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div className="text-sm text-[var(--color-text)]">
              <p className="font-semibold mb-1">So funktioniert die Warteschlange:</p>
              <p>
                Stimme ueber neue Einreichungen ab! Erreicht ein Begriff{" "}
                <strong>{AUTO_APPROVE_THRESHOLD} Upvotes</strong>, wird er automatisch freigeschaltet. Bei{" "}
                <strong>{SENT_BACK_THRESHOLD} Downvotes</strong> wird er zurueckgesendet.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-3 text-sm text-[var(--color-muted)]">
          {pendingItems.length} Einreichung(en) warten auf deine Stimme
        </div>

        {/* Queue Items */}
        <div className="flex flex-col gap-3">
          {pendingItems.map((item) => {
            const netVotes = item.upvotes - item.downvotes;
            return (
              <div key={item.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 dark:border-zinc-700">
                <div className="flex gap-4">
                  {/* Vote Buttons */}
                  <div className="flex shrink-0 flex-col items-center gap-1">
                    <button
                      onClick={() => handleVote(item.id, "up")}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold transition-colors cursor-pointer ${
                        item.userVote === "up"
                          ? "bg-emerald-500 text-white"
                          : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-emerald-500 dark:border-zinc-700"
                      }`}
                      title="Upvote"
                      type="button"
                    >
                      +
                    </button>
                    <span className={`text-sm font-bold font-mono ${
                      netVotes > 0 ? "text-emerald-600 dark:text-emerald-400" : netVotes < 0 ? "text-red-500" : "text-[var(--color-text)]"
                    }`}>
                      {netVotes}
                    </span>
                    <button
                      onClick={() => handleVote(item.id, "down")}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg font-bold transition-colors cursor-pointer ${
                        item.userVote === "down"
                          ? "bg-red-500 text-white"
                          : "bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-red-500 dark:border-zinc-700"
                      }`}
                      title="Downvote"
                      type="button"
                    >
                      -
                    </button>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[var(--color-text)]">{item.term}</div>
                    <div className="mt-1 text-sm text-[var(--color-muted)]">{item.definition}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted)]">
                      <span>Von <span className="font-bold">{item.submittedBy}</span></span>
                      <span>{new Date(item.date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                      <span>
                        <span className="text-emerald-600 dark:text-emerald-400">{item.upvotes}</span>/<span className="text-red-500">{item.downvotes}</span> Stimmen
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)] dark:bg-zinc-700">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${Math.min(100, (item.upvotes / AUTO_APPROVE_THRESHOLD) * 100)}%` }}
                        />
                      </div>
                      <div className="mt-0.5 text-[10px] text-[var(--color-muted)]">
                        {item.upvotes}/{AUTO_APPROVE_THRESHOLD} fuer automatische Freischaltung
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resolved items */}
        {resolvedItems.length > 0 && (
          <div className="mt-4">
            <div className="mb-2 text-xs text-[var(--color-muted)]">Abgeschlossen:</div>
            <div className="flex flex-col gap-1">
              {resolvedItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between rounded-lg p-2.5 text-xs ${
                    item.status === "auto-approved"
                      ? "bg-emerald-50 dark:bg-emerald-950/20"
                      : "bg-red-50 dark:bg-red-950/20"
                  }`}
                >
                  <span className="font-bold text-[var(--color-text)]">{item.term}</span>
                  <span className={`font-bold ${item.status === "auto-approved" ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                    {item.status === "auto-approved" ? "AUTOMATISCH FREIGESCHALTET" : "ZURUECKGESENDET"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </XpWindow>

      {notification && (
        <XpDialog
          type={notification.type}
          title={notification.title}
          message={notification.message}
          open={true}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}
