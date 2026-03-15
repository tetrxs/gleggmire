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
  {
    id: "q1",
    term: "Auf Glegg",
    definition:
      "Wenn etwas 'auf Glegg' passiert, bedeutet das, dass es auf eine besonders chaotische, unterhaltsame oder unerwartete Weise geschieht.",
    submittedBy: "xXClipChimpXx",
    date: "2026-03-15T10:00:00Z",
    upvotes: 8,
    downvotes: 1,
    userVote: null,
    status: "pending",
  },
  {
    id: "q2",
    term: "Glegg-Ratio",
    definition:
      "Wenn Gleggmire jemanden so hart ratioed, dass die Person den Stream verlaesst. Gilt als hoechste Form der Demontage.",
    submittedBy: "CopeLordSupreme",
    date: "2026-03-14T18:30:00Z",
    upvotes: 6,
    downvotes: 2,
    userVote: null,
    status: "pending",
  },
  {
    id: "q3",
    term: "Snench-Alarm",
    definition:
      "Ausruf im Chat, wenn jemand etwas besonders Snench-artiges sagt oder tut. Wird oft mit CAPSLOCK geschrieben.",
    submittedBy: "SnenchMeister",
    date: "2026-03-14T14:15:00Z",
    upvotes: 4,
    downvotes: 0,
    userVote: null,
    status: "pending",
  },
  {
    id: "q4",
    term: "Kanalratte",
    definition:
      "Bezeichnung fuer einen besonders treuen Zuschauer, der jeden Stream schaut, jeden Clip kennt und jedes Meme versteht.",
    submittedBy: "LungenTorpedo69",
    date: "2026-03-13T20:00:00Z",
    upvotes: 7,
    downvotes: 1,
    userVote: null,
    status: "pending",
  },
  {
    id: "q5",
    term: "Torpedieren",
    definition:
      "Jemanden verbal so hart treffen, dass kein Comeback mehr moeglich ist. Abgeleitet von Lungen-Torpedo.",
    submittedBy: "RatioGott",
    date: "2026-03-12T16:45:00Z",
    upvotes: 3,
    downvotes: 0,
    userVote: null,
    status: "pending",
  },
  {
    id: "q6",
    term: "Chat-Tornado",
    definition:
      "Moment, in dem der Chat komplett eskaliert und keiner mehr weiss was los ist. Tritt oft nach kontroversen Takes auf.",
    submittedBy: "xXClipChimpXx",
    date: "2026-03-11T12:00:00Z",
    upvotes: 2,
    downvotes: 7,
    userVote: null,
    status: "pending",
  },
  {
    id: "q7",
    term: "Glegg-Pause",
    definition:
      "Eine unangekuendigte Pause im Stream, in der Gleggmire einfach verschwindet. Kann 5 Minuten oder 2 Stunden dauern.",
    submittedBy: "Neuling2025",
    date: "2026-03-10T08:30:00Z",
    upvotes: 5,
    downvotes: 1,
    userVote: null,
    status: "pending",
  },
];

const AUTO_APPROVE_THRESHOLD = 10;
const SENT_BACK_THRESHOLD = 10;

export function PublicQueue() {
  const [items, setItems] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [notification, setNotification] = useState<{
    type: "info" | "warning";
    title: string;
    message: string;
  } | null>(null);

  function handleVote(itemId: string, voteType: "up" | "down") {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        if (item.status !== "pending") return item;

        let newUp = item.upvotes;
        let newDown = item.downvotes;
        let newVote: "up" | "down" | null = voteType;

        // Remove previous vote
        if (item.userVote === "up") newUp--;
        if (item.userVote === "down") newDown--;

        // Toggle or set new vote
        if (item.userVote === voteType) {
          newVote = null;
        } else {
          if (voteType === "up") newUp++;
          if (voteType === "down") newDown++;
        }

        // Check thresholds
        let newStatus: QueueItem["status"] = item.status;
        if (newUp >= AUTO_APPROVE_THRESHOLD) {
          newStatus = "auto-approved";
          setNotification({
            type: "info",
            title: "Automatisch freigeschaltet!",
            message: `"${item.term}" hat ${AUTO_APPROVE_THRESHOLD} Upvotes erreicht und wurde automatisch freigeschaltet!`,
          });
        } else if (newDown >= SENT_BACK_THRESHOLD) {
          newStatus = "sent-back";
          setNotification({
            type: "warning",
            title: "Zurueckgesendet",
            message: `"${item.term}" hat ${SENT_BACK_THRESHOLD} Downvotes erreicht und wurde zurueckgesendet.`,
          });
        }

        return {
          ...item,
          upvotes: newUp,
          downvotes: newDown,
          userVote: newVote,
          status: newStatus,
        };
      })
    );
  }

  const pendingItems = items.filter((i) => i.status === "pending");
  const resolvedItems = items.filter((i) => i.status !== "pending");

  return (
    <>
      <XpWindow title="📋 Warteschlange — Neue Einreichungen">
        {/* Info box */}
        <div
          className="xp-inset mb-3 p-3"
          style={{ backgroundColor: "#F1EFE2" }}
        >
          <div className="flex items-start gap-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden="true"
              className="shrink-0 mt-0.5"
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
            <div className="xp-text-body">
              <p className="font-bold mb-1">So funktioniert die Warteschlange:</p>
              <p>
                Stimme ueber neue Einreichungen ab! Erreicht ein Begriff{" "}
                <strong>{AUTO_APPROVE_THRESHOLD} Upvotes</strong>, wird er
                automatisch freigeschaltet. Bei{" "}
                <strong>{SENT_BACK_THRESHOLD} Downvotes</strong> wird er
                zurueckgesendet.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="xp-text-label mb-3"
          style={{ color: "var(--xp-border-dark)" }}
        >
          {pendingItems.length} Einreichung(en) warten auf deine Stimme
        </div>

        {/* Queue Items */}
        <div className="flex flex-col gap-3">
          {pendingItems.map((item) => (
            <div
              key={item.id}
              className="xp-raised p-3"
              style={{ backgroundColor: "var(--xp-silber-luna)" }}
            >
              <div className="flex gap-3">
                {/* Vote Buttons */}
                <div className="flex shrink-0 flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(item.id, "up")}
                    className="xp-raised flex h-8 w-8 items-center justify-center text-lg"
                    style={{
                      backgroundColor:
                        item.userVote === "up"
                          ? "var(--xp-gruen)"
                          : "var(--xp-silber-luna)",
                      color:
                        item.userVote === "up" ? "#FFFFFF" : "var(--xp-text)",
                      cursor: "pointer",
                    }}
                    title="Upvote"
                    type="button"
                  >
                    +
                  </button>
                  <span
                    className="text-sm font-bold font-mono"
                    style={{
                      color:
                        item.upvotes - item.downvotes > 0
                          ? "var(--xp-gruen)"
                          : item.upvotes - item.downvotes < 0
                            ? "var(--xp-fehler-rot)"
                            : "var(--xp-text)",
                    }}
                  >
                    {item.upvotes - item.downvotes}
                  </span>
                  <button
                    onClick={() => handleVote(item.id, "down")}
                    className="xp-raised flex h-8 w-8 items-center justify-center text-lg"
                    style={{
                      backgroundColor:
                        item.userVote === "down"
                          ? "var(--xp-fehler-rot)"
                          : "var(--xp-silber-luna)",
                      color:
                        item.userVote === "down"
                          ? "#FFFFFF"
                          : "var(--xp-text)",
                      cursor: "pointer",
                    }}
                    title="Downvote"
                    type="button"
                  >
                    -
                  </button>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="xp-text-heading">{item.term}</div>
                  <div
                    className="xp-text-body mt-1"
                    style={{ color: "var(--xp-border-darker)" }}
                  >
                    {item.definition}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span
                      className="xp-text-label"
                      style={{ color: "var(--xp-border-dark)" }}
                    >
                      Von <span className="font-bold">{item.submittedBy}</span>
                    </span>
                    <span
                      className="xp-text-label"
                      style={{ color: "var(--xp-border-dark)" }}
                    >
                      {new Date(item.date).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                    {/* Vote Progress */}
                    <span className="xp-text-label">
                      <span style={{ color: "var(--xp-gruen)" }}>
                        {item.upvotes}
                      </span>
                      /
                      <span style={{ color: "var(--xp-fehler-rot)" }}>
                        {item.downvotes}
                      </span>
                      {" "}Stimmen
                    </span>
                  </div>
                  {/* Progress Bar to auto-approve */}
                  <div className="mt-2">
                    <div
                      className="xp-inset h-3 w-full"
                      style={{ backgroundColor: "#FFFFFF" }}
                    >
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min(100, (item.upvotes / AUTO_APPROVE_THRESHOLD) * 100)}%`,
                          backgroundColor: "var(--xp-gruen)",
                        }}
                      />
                    </div>
                    <div
                      className="xp-text-label mt-0.5"
                      style={{ color: "var(--xp-border-dark)", fontSize: "10px" }}
                    >
                      {item.upvotes}/{AUTO_APPROVE_THRESHOLD} fuer automatische
                      Freischaltung
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resolved items */}
        {resolvedItems.length > 0 && (
          <div className="mt-4">
            <div
              className="xp-text-label mb-2"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Abgeschlossen:
            </div>
            <div className="flex flex-col gap-1">
              {resolvedItems.map((item) => (
                <div
                  key={item.id}
                  className="xp-inset flex items-center justify-between p-2"
                  style={{
                    backgroundColor:
                      item.status === "auto-approved"
                        ? "#E8F5E8"
                        : "#F5E8E8",
                    fontSize: "11px",
                  }}
                >
                  <span className="font-bold">{item.term}</span>
                  <span
                    className="font-bold"
                    style={{
                      color:
                        item.status === "auto-approved"
                          ? "var(--xp-gruen)"
                          : "var(--xp-fehler-rot)",
                    }}
                  >
                    {item.status === "auto-approved"
                      ? "AUTOMATISCH FREIGESCHALTET"
                      : "ZURUECKGESENDET"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </XpWindow>

      {/* Notification Dialog */}
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
