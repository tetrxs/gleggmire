"use client";

import { useState, useMemo } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import type { ModerationLogEntry } from "@/lib/data/moderation-log";

const ACTION_LABELS: Record<string, string> = {
  term_approved: "Begriff freigeschaltet",
  term_rejected: "Begriff abgelehnt",
  term_submitted: "Begriff eingereicht",
  user_banned: "Nutzer gebannt",
  user_unbanned: "Nutzer entsperrt",
  moderator_added: "Moderator ernannt",
  moderator_removed: "Moderator entfernt",
  breaking_news: "Breaking News",
  definition_submitted: "Definition eingereicht",
  comment_posted: "Kommentar geschrieben",
  term_self_deleted: "Begriff vom Ersteller geloescht",
  term_edited: "Begriff bearbeitet",
  report_dismiss: "Report abgelehnt",
  report_delete: "Report: Inhalt geloescht",
  report_warn: "Report: Verwarnung",
  report_temp_ban: "Report: Temp. Bann",
  report_perm_ban: "Report: Perm. Bann",
};

const ACTION_COLORS: Record<string, string> = {
  term_approved: "#22C55E",
  term_rejected: "#EF4444",
  term_submitted: "#3B82F6",
  user_banned: "#EF4444",
  user_unbanned: "#22C55E",
  moderator_added: "#3B82F6",
  moderator_removed: "#E8593C",
  breaking_news: "#E8593C",
  definition_submitted: "#3B82F6",
  comment_posted: "#71717a",
  term_self_deleted: "#8B5CF6",
  term_edited: "#3B82F6",
  report_dismiss: "#71717a",
  report_delete: "#F97316",
  report_warn: "#F59E0B",
  report_temp_ban: "#EF4444",
  report_perm_ban: "#991B1B",
};

interface ModerationLogProps {
  entries?: ModerationLogEntry[];
}

const PAGE_SIZE = 10;

export function ModerationLog({ entries = [] }: ModerationLogProps) {
  const [filterMod, setFilterMod] = useState<string>("all");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("");
  const [page, setPage] = useState(0);

  const allModerators = useMemo(() => [...new Set(entries.map((e) => e.moderator))], [entries]);
  const allActionTypes = useMemo(() => [...new Set(entries.map((e) => e.action))], [entries]);

  const filteredLog = useMemo(() => {
    return entries.filter((entry) => {
      if (filterMod !== "all" && entry.moderator !== filterMod) return false;
      if (filterAction !== "all" && entry.action !== filterAction) return false;
      if (filterDate) {
        const entryDate = entry.timestamp.split("T")[0];
        if (entryDate !== filterDate) return false;
      }
      return true;
    });
  }, [entries, filterMod, filterAction, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filteredLog.length / PAGE_SIZE));
  const pagedEntries = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredLog.slice(start, start + PAGE_SIZE);
  }, [filteredLog, page]);

  // Reset page when filters change
  useMemo(() => {
    setPage(0);
  }, [filterMod, filterAction, filterDate]);

  return (
    <XpWindow title="Moderations-Log">
      {/* Filters */}
      <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
        <div className="mb-2 text-sm font-bold">Filter:</div>
        <div className="flex flex-wrap gap-3">
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--color-text-muted)" }}>Moderator:</label>
            <select value={filterMod} onChange={(e) => setFilterMod(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm">
              <option value="all">Alle</option>
              {allModerators.map((mod) => <option key={mod} value={mod}>{mod}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--color-text-muted)" }}>Aktion:</label>
            <select value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm">
              <option value="all">Alle</option>
              {allActionTypes.map((action) => <option key={action} value={action}>{ACTION_LABELS[action] ?? action}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs" style={{ color: "var(--color-text-muted)" }}>Datum:</label>
            <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1.5 text-sm" />
          </div>
          <div className="flex items-end">
            <XpButton onClick={() => { setFilterMod("all"); setFilterAction("all"); setFilterDate(""); }}>
              Zuruecksetzen
            </XpButton>
          </div>
        </div>
      </div>

      <div className="mb-3 text-xs" style={{ color: "var(--color-text-muted)" }}>{filteredLog.length} Eintraege</div>

      {/* Log Entries as Cards */}
      {pagedEntries.length === 0 ? (
        <div
          className="flex h-32 items-center justify-center rounded-xl text-sm"
          style={{ border: "2px dashed var(--color-border)", color: "var(--color-text-muted)" }}
        >
          Keine Eintraege gefunden.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pagedEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: ACTION_COLORS[entry.action] ?? "var(--color-text)" }}
                >
                  {ACTION_LABELS[entry.action] ?? entry.action}
                </span>
                <span className="shrink-0 text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                  {new Date(entry.timestamp).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" })}{" "}
                  {new Date(entry.timestamp).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <span>Moderator: <strong style={{ color: "var(--color-text)" }}>{entry.moderator}</strong></span>
                <span>Typ: <strong style={{ color: "var(--color-text)" }}>{entry.targetType}</strong></span>
              </div>
              {entry.details && (
                <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {entry.details}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredLog.length > PAGE_SIZE && (
        <div className="mt-4 flex items-center justify-between">
          <XpButton disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Zurueck
          </XpButton>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Seite {page + 1} / {totalPages}
          </span>
          <XpButton disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Weiter
          </XpButton>
        </div>
      )}
    </XpWindow>
  );
}
