"use client";

import { useState, useMemo } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";

type ActionType =
  | "term_approved"
  | "term_rejected"
  | "user_banned"
  | "user_unbanned"
  | "moderator_added"
  | "moderator_removed"
  | "score_adjusted"
  | "breaking_news";

interface LogEntry {
  id: string;
  timestamp: string;
  moderator: string;
  actionType: ActionType;
  target: string;
  details: string;
}

const ACTION_LABELS: Record<ActionType, string> = {
  term_approved: "Begriff freigeschaltet",
  term_rejected: "Begriff abgelehnt",
  user_banned: "Nutzer gebannt",
  user_unbanned: "Nutzer entsperrt",
  moderator_added: "Moderator ernannt",
  moderator_removed: "Moderator entfernt",
  score_adjusted: "Score angepasst",
  breaking_news: "Breaking News gesendet",
};

const ACTION_COLORS: Record<ActionType, string> = {
  term_approved: "var(--xp-gruen)",
  term_rejected: "var(--xp-fehler-rot)",
  user_banned: "var(--xp-fehler-rot)",
  user_unbanned: "var(--xp-gruen)",
  moderator_added: "var(--xp-blau-start)",
  moderator_removed: "var(--glegg-orange)",
  score_adjusted: "var(--xp-blau-start)",
  breaking_news: "var(--glegg-orange)",
};

const MOCK_LOG: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "2026-03-15T14:30:00Z",
    moderator: "GleggLord420",
    actionType: "term_approved",
    target: "Snench-Alarm",
    details: "Begriff in Glossar aufgenommen.",
  },
  {
    id: "log-2",
    timestamp: "2026-03-15T13:15:00Z",
    moderator: "GleggLord420",
    actionType: "term_rejected",
    target: "ASDF123",
    details: "Spam / kein realer Begriff.",
  },
  {
    id: "log-3",
    timestamp: "2026-03-15T11:00:00Z",
    moderator: "KanackenKoenig",
    actionType: "user_banned",
    target: "SpamBot9000",
    details: "Automatisierter Spam in Kommentaren. Bann dauerhaft.",
  },
  {
    id: "log-4",
    timestamp: "2026-03-14T22:45:00Z",
    moderator: "GleggLord420",
    actionType: "breaking_news",
    target: "Alle Nutzer",
    details: "Gleggmire ist live! Neuer Glossar-Drop incoming.",
  },
  {
    id: "log-5",
    timestamp: "2026-03-14T18:30:00Z",
    moderator: "GleggVerified",
    actionType: "moderator_added",
    target: "SnenchMeister",
    details: "Zum Moderator ernannt fuer herausragende Community-Beitraege.",
  },
  {
    id: "log-6",
    timestamp: "2026-03-14T16:00:00Z",
    moderator: "KanackenKoenig",
    actionType: "term_approved",
    target: "Glegg-Pause",
    details: "Community-Voting war ueberwiegend positiv. Freigeschaltet.",
  },
  {
    id: "log-7",
    timestamp: "2026-03-13T20:15:00Z",
    moderator: "GleggLord420",
    actionType: "score_adjusted",
    target: "CopeLordSupreme",
    details: "Score von 1580 auf 1680 angepasst (+100 Bonus Event).",
  },
  {
    id: "log-8",
    timestamp: "2026-03-13T14:00:00Z",
    moderator: "GleggVerified",
    actionType: "user_unbanned",
    target: "ReformedUser42",
    details: "Bann nach 30 Tagen aufgehoben. Verwarnung bleibt bestehen.",
  },
  {
    id: "log-9",
    timestamp: "2026-03-12T10:30:00Z",
    moderator: "KanackenKoenig",
    actionType: "moderator_removed",
    target: "InactiveMod",
    details: "Moderator-Status entfernt wegen Inaktivitaet (90+ Tage).",
  },
  {
    id: "log-10",
    timestamp: "2026-03-11T08:00:00Z",
    moderator: "GleggLord420",
    actionType: "term_approved",
    target: "Kanalratte",
    details: "Qualitativ hochwertige Einreichung. Sofort freigeschaltet.",
  },
];

const ALL_MODERATORS = [...new Set(MOCK_LOG.map((e) => e.moderator))];
const ALL_ACTION_TYPES = [...new Set(MOCK_LOG.map((e) => e.actionType))];

export function ModerationLog() {
  const [filterMod, setFilterMod] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");

  const filteredLog = useMemo(() => {
    return MOCK_LOG.filter((entry) => {
      if (filterMod !== "all" && entry.moderator !== filterMod)
        return false;
      if (filterAction !== "all" && entry.actionType !== filterAction)
        return false;
      if (filterDate) {
        const entryDate = entry.timestamp.split("T")[0];
        if (entryDate !== filterDate) return false;
      }
      return true;
    });
  }, [filterMod, filterAction, filterDate]);

  return (
    <XpWindow title="📜 Moderations-Log — audit.exe">
      {/* Filters */}
      <div
        className="xp-inset mb-3 p-3"
        style={{ backgroundColor: "#F1EFE2" }}
      >
        <div className="xp-text-label mb-2 font-bold">Filter:</div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label
              className="xp-text-label mb-1 block"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Moderator:
            </label>
            <select
              value={filterMod}
              onChange={(e) => setFilterMod(e.target.value)}
              className="xp-inset px-2 py-1"
              style={{
                backgroundColor: "#FFFFFF",
                fontSize: "11px",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
            >
              <option value="all">Alle</option>
              {ALL_MODERATORS.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="xp-text-label mb-1 block"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Aktion:
            </label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="xp-inset px-2 py-1"
              style={{
                backgroundColor: "#FFFFFF",
                fontSize: "11px",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
            >
              <option value="all">Alle</option>
              {ALL_ACTION_TYPES.map((action) => (
                <option key={action} value={action}>
                  {ACTION_LABELS[action as ActionType]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="xp-text-label mb-1 block"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Datum:
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="xp-inset px-2 py-1"
              style={{
                backgroundColor: "#FFFFFF",
                fontSize: "11px",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
            />
          </div>

          <div className="flex items-end">
            <XpButton
              onClick={() => {
                setFilterMod("all");
                setFilterAction("all");
                setFilterDate("");
              }}
            >
              Filter zuruecksetzen
            </XpButton>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div
        className="xp-text-label mb-2"
        style={{ color: "var(--xp-border-dark)" }}
      >
        {filteredLog.length} Eintraege
      </div>

      {/* Log Entries */}
      <div
        className="xp-inset flex flex-col gap-0"
        style={{
          backgroundColor: "#FFFFFF",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {filteredLog.length === 0 && (
          <div
            className="p-4 text-center xp-text-body"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Keine Eintraege gefunden.
          </div>
        )}

        {filteredLog.map((entry, idx) => (
          <div
            key={entry.id}
            className="flex gap-3 border-b px-3 py-2"
            style={{
              borderColor: "var(--xp-silber-luna)",
              backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F8F7F2",
              fontSize: "11px",
            }}
          >
            {/* Timestamp */}
            <div
              className="w-32 shrink-0 font-mono"
              style={{ color: "var(--xp-border-dark)" }}
            >
              {new Date(entry.timestamp).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}{" "}
              {new Date(entry.timestamp).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Moderator */}
            <div className="w-28 shrink-0 font-bold">
              {entry.moderator}
            </div>

            {/* Action */}
            <div className="w-40 shrink-0">
              <span
                className="font-bold"
                style={{
                  color: ACTION_COLORS[entry.actionType],
                }}
              >
                {ACTION_LABELS[entry.actionType]}
              </span>
            </div>

            {/* Target */}
            <div className="w-28 shrink-0 font-bold">{entry.target}</div>

            {/* Details */}
            <div
              className="min-w-0 flex-1"
              style={{ color: "var(--xp-border-darker)" }}
            >
              {entry.details}
            </div>
          </div>
        ))}
      </div>

      {/* Immutability Notice */}
      <div
        className="mt-3 xp-text-label"
        style={{
          color: "var(--xp-border-dark)",
          fontStyle: "italic",
        }}
      >
        Hinweis: Das Moderations-Log ist unveraenderbar. Eintraege koennen
        nicht geloescht oder bearbeitet werden.
      </div>
    </XpWindow>
  );
}
