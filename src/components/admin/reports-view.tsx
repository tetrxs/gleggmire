"use client";

import { useState, useEffect, useMemo } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { UserLink } from "@/components/ui/user-link";

const REASON_LABELS: Record<string, string> = {
  hate_speech: "Hassrede",
  racism: "Rassismus",
  sexual_content: "Sexuelle Inhalte",
  harassment: "Belaestigung",
  spam: "Spam",
  misinformation: "Falschinformation",
  personal_info: "Persoenliche Daten",
  other: "Sonstiges",
};

const REASON_SUGGESTED_BAN: Record<string, string> = {
  hate_speech: "perm_ban",
  racism: "perm_ban",
  sexual_content: "perm_ban",
  harassment: "temp_ban",
  spam: "temp_ban",
  misinformation: "temp_ban",
  personal_info: "temp_ban",
  other: "temp_ban",
};

const BAN_TYPES: Record<string, { label: string; color: string }> = {
  temp_ban: { label: "Temporaer bannen (7 Tage)", color: "#EF4444" },
  perm_ban: { label: "Permanent bannen", color: "#991B1B" },
};

const ENTITY_LABELS: Record<string, string> = {
  term: "Begriff",
  definition: "Definition",
  comment: "Kommentar",
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "OFFEN", color: "text-amber-600" },
  dismissed: { label: "ABGELEHNT", color: "text-gray-500" },
  resolved_deleted: { label: "GELOESCHT", color: "text-orange-600" },
  resolved_warned: { label: "VERWARNT", color: "text-amber-600" },
  resolved_temp_ban: { label: "TEMP. GEBANNT", color: "text-red-500" },
  resolved_perm_ban: { label: "PERM. GEBANNT", color: "text-red-700" },
};

interface ReportUser {
  id: string;
  username: string;
  avatar_url: string | null;
  discord_id: string;
}

interface Report {
  id: string;
  entity_type: string;
  entity_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
  reporter: ReportUser | null;
  reported_user: ReportUser | null;
  resolved_by_user: ReportUser | null;
  entity_url: string | null;
}

type DialogState =
  | { type: "none" }
  | { type: "dismiss-confirm"; report: Report }
  | { type: "punish"; report: Report; banReason: string; customReason: string; banType: string; deleteContent: boolean }
  | { type: "punish-confirm"; report: Report; banReason: string; customReason: string; banType: string; deleteContent: boolean; confirmText: string };

const PAGE_SIZE = 10;

export function ReportsView() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [resolvedPage, setResolvedPage] = useState(0);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/reports?status=all");
      if (!res.ok) throw new Error("Laden fehlgeschlagen");
      const data = await res.json();
      setReports(data.reports);
    } catch {
      setError("Fehler beim Laden der Reports");
    }
    setLoading(false);
  }

  async function handleDismiss(reportId: string) {
    setProcessing(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "dismiss" }),
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      } else {
        const data = await res.json().catch(() => ({ error: "Fehler" }));
        alert("Fehler: " + (data.error ?? "Unbekannt"));
      }
    } catch {
      alert("Netzwerkfehler");
    }
    setProcessing(null);
    setDialog({ type: "none" });
  }

  async function handlePunish(reportId: string, banType: string, banReason: string, deleteContent: boolean) {
    setProcessing(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: banType, delete_content: deleteContent }),
      });
      if (res.ok) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
      } else {
        const data = await res.json().catch(() => ({ error: "Fehler" }));
        alert("Fehler: " + (data.error ?? "Unbekannt"));
      }
    } catch {
      alert("Netzwerkfehler");
    }
    setProcessing(null);
    setDialog({ type: "none" });
  }

  const pendingReports = useMemo(() => reports.filter((r) => r.status === "pending"), [reports]);
  const resolvedReports = useMemo(() => reports.filter((r) => r.status !== "pending"), [reports]);
  const pagedResolved = useMemo(() => {
    const start = resolvedPage * PAGE_SIZE;
    return resolvedReports.slice(start, start + PAGE_SIZE);
  }, [resolvedReports, resolvedPage]);
  const resolvedTotalPages = Math.max(1, Math.ceil(resolvedReports.length / PAGE_SIZE));

  if (loading) {
    return (
      <div className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
        Lade Reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <XpWindow title="Reports">
        <div
          className="flex h-32 items-center justify-center rounded-xl text-sm"
          style={{ border: "2px dashed var(--color-border)", color: "var(--color-text-muted)" }}
        >
          Keine Reports vorhanden.
        </div>
      </XpWindow>
    );
  }

  function getBanReasonText(d: { banReason: string; customReason: string }) {
    if (d.banReason === "other") return d.customReason.trim();
    return REASON_LABELS[d.banReason] ?? d.banReason;
  }

  function renderReportCard(report: Report) {
    const statusInfo = STATUS_LABELS[report.status] ?? { label: report.status, color: "" };
    const isPending = report.status === "pending";
    const suggested = REASON_SUGGESTED_BAN[report.reason];

    return (
      <div
        key={report.id}
        className="rounded-xl border p-4"
        style={{
          backgroundColor: isPending ? "var(--color-surface)" : "var(--color-bg)",
          borderColor: isPending ? "var(--color-accent)" : "var(--color-border)",
        }}
      >
        {/* Header: Type + Date + Status */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[var(--color-bg)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}>
              {ENTITY_LABELS[report.entity_type] ?? report.entity_type}
            </span>
            {!isPending && (
              <span className={`text-xs font-bold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            )}
          </div>
          <span className="shrink-0 text-xs" style={{ color: "var(--color-text-muted)" }}>
            {new Date(report.created_at).toLocaleDateString("de-DE")}
          </span>
        </div>

        {/* Reason + Description */}
        <div className="mb-3 text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>Grund: </span>
          <span className="font-semibold" style={{ color: "var(--color-text)" }}>
            {REASON_LABELS[report.reason] ?? report.reason}
          </span>
          {report.description && (
            <p className="mt-1 text-xs italic" style={{ color: "var(--color-text-muted)" }}>
              &ldquo;{report.description}&rdquo;
            </p>
          )}
        </div>

        {/* Reporter + Reported User */}
        <div className="mb-3 flex flex-wrap gap-x-6 gap-y-2 text-xs">
          {report.reporter && (
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--color-text-muted)" }}>Gemeldet von:</span>
              <UserLink
                userId={report.reporter.id}
                username={report.reporter.username}
                avatarUrl={report.reporter.avatar_url}
                discordId={report.reporter.discord_id}
                showDiscordId
                size="sm"
              />
            </div>
          )}
          {report.reported_user && (
            <div className="flex items-center gap-1.5">
              <span style={{ color: "var(--color-text-muted)" }}>Beschuldigter:</span>
              <UserLink
                userId={report.reported_user.id}
                username={report.reported_user.username}
                avatarUrl={report.reported_user.avatar_url}
                discordId={report.reported_user.discord_id}
                showDiscordId
                size="sm"
              />
            </div>
          )}
        </div>

        {/* Link to content */}
        {report.entity_url && (
          <div className="mb-3">
            <a
              href={report.entity_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-text)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
              style={{ color: "var(--color-text)" }}
            >
              Inhalt anzeigen
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        )}

        {/* Actions (only pending) */}
        {isPending && (
          <div className="flex flex-wrap gap-2">
            <XpButton
              disabled={processing === report.id}
              onClick={() => setDialog({ type: "dismiss-confirm", report })}
            >
              Fallen lassen
            </XpButton>
            <XpButton
              variant="danger"
              disabled={processing === report.id}
              onClick={() =>
                setDialog({
                  type: "punish",
                  report,
                  banReason: report.reason !== "other" ? report.reason : "",
                  customReason: "",
                  banType: suggested ?? "temp_ban",
                  deleteContent: true,
                })
              }
            >
              Bestrafen
            </XpButton>
          </div>
        )}

        {/* Result (resolved) */}
        {!isPending && (
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
            {report.resolved_by_user && (
              <>
                <span>von</span>
                <UserLink
                  userId={report.resolved_by_user.id}
                  username={report.resolved_by_user.username}
                  avatarUrl={report.resolved_by_user.avatar_url}
                  size="sm"
                />
                <span>&middot;</span>
              </>
            )}
            {report.resolved_at && (
              <span>{new Date(report.resolved_at).toLocaleString("de-DE")}</span>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <XpWindow title="Reports">
      {/* Pending Reports */}
      {pendingReports.length > 0 && (
        <div className="mb-6">
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Offen ({pendingReports.length})
          </div>
          <div className="flex flex-col gap-3">
            {pendingReports.map(renderReportCard)}
          </div>
        </div>
      )}

      {/* Resolved Reports with Pagination */}
      {resolvedReports.length > 0 && (
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Abgeschlossen ({resolvedReports.length})
          </div>
          <div className="flex flex-col gap-3">
            {pagedResolved.map(renderReportCard)}
          </div>
          {resolvedReports.length > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-between">
              <XpButton disabled={resolvedPage === 0} onClick={() => setResolvedPage((p) => p - 1)}>
                Zurueck
              </XpButton>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Seite {resolvedPage + 1} / {resolvedTotalPages}
              </span>
              <XpButton disabled={resolvedPage >= resolvedTotalPages - 1} onClick={() => setResolvedPage((p) => p + 1)}>
                Weiter
              </XpButton>
            </div>
          )}
        </div>
      )}

      {/* Dismiss Confirm Dialog */}
      {dialog.type === "dismiss-confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-2">Report fallen lassen</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Diesen Report wirklich ablehnen? Der gemeldete Inhalt bleibt bestehen.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton
                variant="primary"
                disabled={processing === dialog.report.id}
                onClick={() => handleDismiss(dialog.report.id)}
              >
                {processing ? "..." : "Ja, fallen lassen"}
              </XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Punish Step 1: Select reason + ban type + delete content */}
      {dialog.type === "punish" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[480px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-4">
              Nutzer bestrafen — {dialog.report.reported_user?.username ?? "Unbekannt"}
            </h4>

            {/* Reason selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Banngrund:</label>
              <div className="flex flex-col gap-1.5">
                {Object.entries(REASON_LABELS).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                    style={{
                      backgroundColor: dialog.banReason === key ? "var(--color-accent-light, rgba(37,99,235,0.1))" : "transparent",
                      border: dialog.banReason === key ? "1px solid var(--color-accent)" : "1px solid transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="ban-reason"
                      checked={dialog.banReason === key}
                      onChange={() => setDialog({ ...dialog, banReason: key })}
                      className="accent-[var(--color-accent)]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              {dialog.banReason === "other" && (
                <textarea
                  value={dialog.customReason}
                  onChange={(e) => setDialog({ ...dialog, customReason: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm"
                  style={{ minHeight: "50px", resize: "vertical" }}
                  placeholder="Grund eingeben..."
                />
              )}
            </div>

            {/* Ban type */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Art des Banns:</label>
              <div className="flex flex-col gap-1.5">
                {Object.entries(BAN_TYPES).map(([key, info]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                    style={{
                      backgroundColor: dialog.banType === key ? "rgba(239,68,68,0.1)" : "transparent",
                      border: dialog.banType === key ? "1px solid " + info.color : "1px solid transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="ban-type"
                      checked={dialog.banType === key}
                      onChange={() => setDialog({ ...dialog, banType: key })}
                      className="accent-red-500"
                    />
                    <span style={{ color: info.color, fontWeight: 600 }}>{info.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delete content option */}
            <div className="mb-4">
              <label
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                style={{
                  backgroundColor: dialog.deleteContent ? "rgba(239,68,68,0.1)" : "transparent",
                  border: dialog.deleteContent ? "1px solid #991B1B" : "1px solid var(--color-border)",
                }}
              >
                <input
                  type="checkbox"
                  checked={dialog.deleteContent}
                  onChange={(e) => setDialog({ ...dialog, deleteContent: e.target.checked })}
                  className="accent-red-700"
                />
                <span className="font-semibold" style={{ color: "#991B1B" }}>Gemeldeten Inhalt loeschen</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton
                variant="danger"
                disabled={!dialog.banReason || (dialog.banReason === "other" && !dialog.customReason.trim())}
                onClick={() =>
                  setDialog({
                    type: "punish-confirm",
                    report: dialog.report,
                    banReason: dialog.banReason,
                    customReason: dialog.customReason,
                    banType: dialog.banType,
                    deleteContent: dialog.deleteContent,
                    confirmText: "",
                  })
                }
              >
                Weiter
              </XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Punish Step 2: Confirm by typing username */}
      {dialog.type === "punish-confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[420px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-3">Endgueltige Bestaetigung</h4>

            <div className="mb-3 rounded-lg p-3 text-sm" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
              <div className="mb-1">
                <span style={{ color: "var(--color-text-muted)" }}>Nutzer: </span>
                <strong>{dialog.report.reported_user?.username ?? "Unbekannt"}</strong>
              </div>
              <div className="mb-1">
                <span style={{ color: "var(--color-text-muted)" }}>Grund: </span>
                <strong>{getBanReasonText(dialog)}</strong>
              </div>
              <div className="mb-1">
                <span style={{ color: "var(--color-text-muted)" }}>Typ: </span>
                <strong style={{ color: BAN_TYPES[dialog.banType]?.color }}>{BAN_TYPES[dialog.banType]?.label}</strong>
              </div>
              {dialog.deleteContent && (
                <div className="mt-1 font-bold" style={{ color: "#991B1B" }}>
                  Gemeldeter Inhalt wird geloescht!
                </div>
              )}
            </div>

            <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
              Tippe den Nutzernamen <strong>{dialog.report.reported_user?.username ?? ""}</strong> ein:
            </p>
            <input
              type="text"
              value={dialog.confirmText}
              onChange={(e) => setDialog({ ...dialog, confirmText: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
              placeholder={dialog.report.reported_user?.username ?? ""}
            />
            <div className="mt-5 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton
                variant="danger"
                disabled={dialog.confirmText !== (dialog.report.reported_user?.username ?? "") || !!processing}
                onClick={() => handlePunish(dialog.report.id, dialog.banType, getBanReasonText(dialog), dialog.deleteContent)}
              >
                {processing ? "..." : "BANNEN"}
              </XpButton>
            </div>
          </div>
        </div>
      )}
    </XpWindow>
  );
}
