"use client";

import { useState, useMemo } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import type { UserWithStats } from "@/lib/data/users";

const BAN_REASONS: Record<string, string> = {
  hate_speech: "Hassrede",
  racism: "Rassismus",
  sexual_content: "Sexuelle Inhalte",
  harassment: "Belaestigung",
  spam: "Spam",
  misinformation: "Falschinformation",
  personal_info: "Persoenliche Daten",
  other: "Sonstiges",
};

const BAN_TYPES: Record<string, { label: string; color: string }> = {
  temp_ban: { label: "Temporaer bannen (7 Tage)", color: "#EF4444" },
  perm_ban: { label: "Permanent bannen", color: "#991B1B" },
};

type DialogState =
  | { type: "none" }
  | { type: "ban-select"; user: UserWithStats; reason: string; customReason: string; banType: string; removeContent: boolean }
  | { type: "ban-confirm"; user: UserWithStats; reason: string; customReason: string; banType: string; removeContent: boolean; confirmText: string }
  | { type: "unban"; user: UserWithStats }
  | { type: "promote"; user: UserWithStats }
  | { type: "demote"; user: UserWithStats };

const PAGE_SIZE = 10;

interface UserManagementProps {
  initialUsers: UserWithStats[];
}

export function UserManagement({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<UserWithStats[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });
  const [processing, setProcessing] = useState(false);
  const [page, setPage] = useState(0);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.discord_id.includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pagedUsers = useMemo(() => {
    const start = page * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, page]);

  // Reset page when search changes
  useMemo(() => {
    setPage(0);
  }, [search]);

  async function handleBan(userId: string, reason: string, banType: string, removeContent: boolean) {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_banned: true,
          ban_reason: reason,
          ban_type: banType,
          remove_content: removeContent,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Bannen fehlgeschlagen:", text);
        alert("Fehler beim Bannen: " + text);
        setProcessing(false);
        return;
      }
    } catch (err) {
      console.error("Bannen fehlgeschlagen:", err);
      alert("Fehler beim Bannen.");
      setProcessing(false);
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, is_banned: true, ban_reason: reason, banned_at: new Date().toISOString() }
          : u
      )
    );
    setProcessing(false);
    setDialog({ type: "none" });
  }

  async function handleUnban(userId: string) {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_banned: false }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Entsperren fehlgeschlagen:", text);
        alert("Fehler beim Entsperren: " + text);
        setProcessing(false);
        return;
      }
    } catch (err) {
      console.error("Entsperren fehlgeschlagen:", err);
      alert("Fehler beim Entsperren.");
      setProcessing(false);
      return;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, is_banned: false, ban_reason: undefined, banned_at: undefined }
          : u
      )
    );
    setProcessing(false);
    setDialog({ type: "none" });
  }

  async function handlePromote(userId: string) {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_moderator: true }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Ernennen fehlgeschlagen:", text);
        alert("Fehler beim Ernennen: " + text);
        setProcessing(false);
        return;
      }
    } catch (err) {
      console.error("Ernennen fehlgeschlagen:", err);
      alert("Fehler beim Ernennen.");
      setProcessing(false);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, is_moderator: true } : u)
    );
    setProcessing(false);
    setDialog({ type: "none" });
  }

  async function handleDemote(userId: string) {
    setProcessing(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_moderator: false }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Entfernen fehlgeschlagen:", text);
        alert("Fehler beim Entfernen: " + text);
        setProcessing(false);
        return;
      }
    } catch (err) {
      console.error("Entfernen fehlgeschlagen:", err);
      alert("Fehler beim Entfernen.");
      setProcessing(false);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => u.id === userId ? { ...u, is_moderator: false } : u)
    );
    setProcessing(false);
    setDialog({ type: "none" });
  }

  function getBanReasonText(dialog: { reason: string; customReason: string }) {
    if (dialog.reason === "other") return dialog.customReason.trim();
    return BAN_REASONS[dialog.reason] ?? dialog.reason;
  }

  return (
    <>
      <XpWindow title="Nutzerverwaltung">
        <div className="mb-3">
          <div className="mb-1 text-xs" style={{ color: "var(--color-text-muted)" }}>Nutzer suchen:</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Username oder Discord-ID..."
              className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            />
            <XpButton onClick={() => setSearch("")}>Zuruecksetzen</XpButton>
          </div>
        </div>

        <div className="mb-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          {filteredUsers.length} Nutzer gefunden
        </div>

        <div className="flex flex-col gap-3">
          {pagedUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border p-4"
              style={{
                backgroundColor: user.is_banned ? "#FEF2F2" : "var(--color-surface)",
                borderColor: user.is_banned ? "#EF4444" : "var(--color-border)",
              }}
            >
              <div className="flex items-start gap-3">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.username} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                ) : (
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{
                      backgroundColor: user.is_admin ? "#E8593C" : "#2563eb",
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{user.username}</span>
                    {user.is_admin && <span className="rounded-full bg-[#E8593C] px-1.5 py-0.5 text-[8px] font-bold text-white">ADMIN</span>}
                    {user.is_moderator && !user.is_admin && <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[8px] font-bold text-white">MOD</span>}
                    {user.is_banned && <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">GEBANNT</span>}
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Discord-ID: {user.discord_id} | Glegg-Score: <span className="font-bold">{user.glegg_score}</span> | Status:{" "}
                    {user.is_banned ? (
                      <span style={{ color: "#EF4444" }}>Gebannt{user.ban_reason && ` (${user.ban_reason})`}</span>
                    ) : (
                      <span style={{ color: "#22C55E" }}>Aktiv</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.is_banned ? (
                  <XpButton variant="primary" onClick={() => setDialog({ type: "unban", user })}>Entsperren</XpButton>
                ) : (
                  <XpButton variant="danger" onClick={() => setDialog({ type: "ban-select", user, reason: "", customReason: "", banType: "perm_ban", removeContent: false })}>Bannen</XpButton>
                )}
                {user.is_moderator && !user.is_admin ? (
                  <XpButton onClick={() => setDialog({ type: "demote", user })}>Moderator entfernen</XpButton>
                ) : !user.is_moderator && !user.is_admin ? (
                  <XpButton onClick={() => setDialog({ type: "promote", user })}>Zum Moderator ernennen</XpButton>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {filteredUsers.length > PAGE_SIZE && (
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

      {/* Ban Step 1: Select reason + type */}
      {dialog.type === "ban-select" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[480px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-4">Nutzer bannen — {dialog.user.username}</h4>

            {/* Reason selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium" style={{ color: "var(--color-text-muted)" }}>Banngrund:</label>
              <div className="flex flex-col gap-1.5">
                {Object.entries(BAN_REASONS).map(([key, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                    style={{
                      backgroundColor: dialog.reason === key ? "var(--color-accent-light, rgba(37,99,235,0.1))" : "transparent",
                      border: dialog.reason === key ? "1px solid var(--color-accent)" : "1px solid transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="ban-reason"
                      checked={dialog.reason === key}
                      onChange={() => setDialog({ ...dialog, reason: key })}
                      className="accent-[var(--color-accent)]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              {dialog.reason === "other" && (
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

            {/* Remove content option */}
            <div className="mb-4">
              <label
                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                style={{
                  backgroundColor: dialog.removeContent ? "rgba(239,68,68,0.1)" : "transparent",
                  border: dialog.removeContent ? "1px solid #991B1B" : "1px solid var(--color-border)",
                }}
              >
                <input
                  type="checkbox"
                  checked={dialog.removeContent}
                  onChange={(e) => setDialog({ ...dialog, removeContent: e.target.checked })}
                  className="accent-red-700"
                />
                <span className="font-semibold" style={{ color: "#991B1B" }}>Nutzer entfernen</span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>(alle Inhalte loeschen)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton
                variant="danger"
                disabled={!dialog.reason || (dialog.reason === "other" && !dialog.customReason.trim())}
                onClick={() =>
                  setDialog({
                    type: "ban-confirm",
                    user: dialog.user,
                    reason: dialog.reason,
                    customReason: dialog.customReason,
                    banType: dialog.banType,
                    removeContent: dialog.removeContent,
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

      {/* Ban Step 2: Confirm by typing username */}
      {dialog.type === "ban-confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[420px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-3">Endgueltige Bestaetigung</h4>

            <div className="mb-3 rounded-lg p-3 text-sm" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
              <div className="mb-1">
                <span style={{ color: "var(--color-text-muted)" }}>Nutzer: </span>
                <strong>{dialog.user.username}</strong>
              </div>
              <div className="mb-1">
                <span style={{ color: "var(--color-text-muted)" }}>Grund: </span>
                <strong>{dialog.reason === "other" ? dialog.customReason : BAN_REASONS[dialog.reason]}</strong>
              </div>
              <div className="mb-1">
                <span style={{ color: "var(--color-text-muted)" }}>Typ: </span>
                <strong style={{ color: BAN_TYPES[dialog.banType]?.color }}>{BAN_TYPES[dialog.banType]?.label}</strong>
              </div>
              {dialog.removeContent && (
                <div className="mt-1 font-bold" style={{ color: "#991B1B" }}>
                  Alle Inhalte des Nutzers werden geloescht!
                </div>
              )}
            </div>

            <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
              Tippe den Nutzernamen <strong>{dialog.user.username}</strong> ein:
            </p>
            <input
              type="text"
              value={dialog.confirmText}
              onChange={(e) => setDialog({ ...dialog, confirmText: e.target.value })}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
              placeholder={dialog.user.username}
            />
            <div className="mt-5 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton
                variant="danger"
                disabled={dialog.confirmText !== dialog.user.username || processing}
                onClick={() => handleBan(dialog.user.id, getBanReasonText(dialog), dialog.banType, dialog.removeContent)}
              >
                {processing ? "..." : "BANNEN"}
              </XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Unban */}
      {dialog.type === "unban" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-2">Nutzer entsperren</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}><strong>{dialog.user.username}</strong> entsperren?</p>
            <div className="mt-5 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="primary" disabled={processing} onClick={() => handleUnban(dialog.user.id)}>Ja, entsperren</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Promote */}
      {dialog.type === "promote" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-2">Zum Moderator ernennen</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}><strong>{dialog.user.username}</strong> zum Moderator ernennen?</p>
            <div className="mt-5 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="primary" disabled={processing} onClick={() => handlePromote(dialog.user.id)}>Ja, ernennen</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Demote */}
      {dialog.type === "demote" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-2">Moderator entfernen</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}><strong>{dialog.user.username}</strong> den Moderator-Status entziehen?</p>
            <div className="mt-5 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="danger" disabled={processing} onClick={() => handleDemote(dialog.user.id)}>Ja, entfernen</XpButton>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
