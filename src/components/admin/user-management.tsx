"use client";

import { useState, useMemo } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { MOCK_USERS, type MockUserWithStats } from "@/lib/mock-users";

type DialogState =
  | { type: "none" }
  | { type: "ban-confirm"; user: MockUserWithStats }
  | { type: "ban-reason"; user: MockUserWithStats; reason: string }
  | {
      type: "ban-final";
      user: MockUserWithStats;
      reason: string;
      confirmText: string;
    }
  | { type: "unban"; user: MockUserWithStats }
  | { type: "promote"; user: MockUserWithStats }
  | { type: "demote"; user: MockUserWithStats }
  | {
      type: "score";
      user: MockUserWithStats;
      newScore: string;
    };

export function UserManagement() {
  const [users, setUsers] = useState<MockUserWithStats[]>(MOCK_USERS);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ type: "none" });

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        u.username.toLowerCase().includes(q) ||
        u.discord_id.includes(q)
    );
  }, [users, search]);

  function handleBan(userId: string, reason: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              is_banned: true,
              ban_reason: reason,
              banned_at: new Date().toISOString(),
            }
          : u
      )
    );
    setDialog({ type: "none" });
  }

  function handleUnban(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              is_banned: false,
              ban_reason: undefined,
              banned_at: undefined,
            }
          : u
      )
    );
    setDialog({ type: "none" });
  }

  function handlePromote(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_moderator: true } : u
      )
    );
    setDialog({ type: "none" });
  }

  function handleDemote(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_moderator: false } : u
      )
    );
    setDialog({ type: "none" });
  }

  function handleScoreChange(userId: string, newScore: number) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, glegg_score: newScore } : u
      )
    );
    setDialog({ type: "none" });
  }

  return (
    <>
      <XpWindow title="Nutzerverwaltung">
        {/* Search */}
        <div className="mb-3">
          <div
            className="mb-1 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Nutzer suchen:
          </div>
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

        {/* User Count */}
        <div
          className="mb-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {filteredUsers.length} Nutzer gefunden
        </div>

        {/* User List */}
        <div className="flex flex-col gap-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border p-3"
              style={{
                backgroundColor: user.is_banned
                  ? "#FEF2F2"
                  : "var(--color-surface)",
                borderColor: user.is_banned
                  ? "#EF4444"
                  : "var(--color-border)",
              }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{
                    backgroundColor: user.is_admin
                      ? "#E8593C"
                      : user.is_moderator
                        ? "#16a34a"
                        : "#2563eb",
                  }}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
                      {user.username}
                    </span>
                    {user.is_admin && (
                      <span className="rounded-full bg-[#E8593C] px-1.5 py-0.5 text-[8px] font-bold text-white">
                        ADMIN
                      </span>
                    )}
                    {user.is_moderator && !user.is_admin && (
                      <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        MOD
                      </span>
                    )}
                    {user.is_banned && (
                      <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        GEBANNT
                      </span>
                    )}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Discord-ID: {user.discord_id} | Glegg-Score:{" "}
                    <span className="font-bold">{user.glegg_score}</span> |
                    Status:{" "}
                    {user.is_banned ? (
                      <span style={{ color: "#EF4444" }}>
                        Gebannt
                        {user.ban_reason && ` (${user.ban_reason})`}
                      </span>
                    ) : (
                      <span style={{ color: "#22C55E" }}>
                        Aktiv
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-2 flex flex-wrap gap-2">
                {user.is_banned ? (
                  <XpButton
                    variant="primary"
                    onClick={() => setDialog({ type: "unban", user })}
                  >
                    Entsperren
                  </XpButton>
                ) : (
                  <XpButton
                    variant="danger"
                    onClick={() => setDialog({ type: "ban-confirm", user })}
                  >
                    Bannen
                  </XpButton>
                )}

                {user.is_moderator && !user.is_admin ? (
                  <XpButton onClick={() => setDialog({ type: "demote", user })}>
                    Moderator entfernen
                  </XpButton>
                ) : !user.is_moderator && !user.is_admin ? (
                  <XpButton onClick={() => setDialog({ type: "promote", user })}>
                    Zum Moderator ernennen
                  </XpButton>
                ) : null}

                <XpButton
                  onClick={() => setDialog({ type: "score", user, newScore: String(user.glegg_score) })}
                >
                  Glegg-Score anpassen
                </XpButton>
              </div>
            </div>
          ))}
        </div>
      </XpWindow>

      {/* Ban Step 1 */}
      {dialog.type === "ban-confirm" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[420px] max-w-[90vw] p-6 shadow-lg animate-scale-in" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Nutzer bannen</h4>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Bist du sicher, dass du <strong>{dialog.user.username}</strong> bannen willst?</p>
              </div>
              <button onClick={() => setDialog({ type: "none" })} className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors" type="button"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4L12 12M12 4L4 12" /></svg></button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="danger" onClick={() => setDialog({ type: "ban-reason", user: dialog.user, reason: "" })}>Ja, weiter</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Ban Step 2: Reason */}
      {dialog.type === "ban-reason" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[420px] max-w-[90vw] p-6 shadow-lg animate-scale-in" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Banngrund angeben</h4>
                <label className="mb-1 block text-sm" style={{ color: "var(--color-text-muted)" }}>Grund fuer den Bann von <strong>{dialog.user.username}</strong>:</label>
                <textarea value={dialog.reason} onChange={(e) => setDialog({ ...dialog, reason: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm" style={{ minHeight: "60px", resize: "vertical" }} placeholder="Banngrund eingeben..." />
              </div>
              <button onClick={() => setDialog({ type: "none" })} className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors" type="button"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4L12 12M12 4L4 12" /></svg></button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="danger" disabled={!dialog.reason.trim()} onClick={() => setDialog({ type: "ban-final", user: dialog.user, reason: dialog.reason, confirmText: "" })}>Weiter</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Ban Step 3: Confirm */}
      {dialog.type === "ban-final" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[420px] max-w-[90vw] p-6 shadow-lg animate-scale-in" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Endgueltige Bestaetigung</h4>
                <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>Tippe den Nutzernamen <strong>{dialog.user.username}</strong> ein, um den Bann zu bestaetigen:</p>
                <input type="text" value={dialog.confirmText} onChange={(e) => setDialog({ ...dialog, confirmText: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm" placeholder={dialog.user.username} />
              </div>
              <button onClick={() => setDialog({ type: "none" })} className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors" type="button"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4L12 12M12 4L4 12" /></svg></button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="danger" disabled={dialog.confirmText !== dialog.user.username} onClick={() => handleBan(dialog.user.id, dialog.reason)}>BANNEN</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Unban Dialog */}
      {dialog.type === "unban" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg animate-scale-in" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Nutzer entsperren</h4>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}><strong>{dialog.user.username}</strong> entsperren?</p>
              </div>
              <button onClick={() => setDialog({ type: "none" })} className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors" type="button"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4L12 12M12 4L4 12" /></svg></button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="primary" onClick={() => handleUnban(dialog.user.id)}>Ja, entsperren</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Promote Dialog */}
      {dialog.type === "promote" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg animate-scale-in" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Zum Moderator ernennen</h4>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}><strong>{dialog.user.username}</strong> zum Moderator ernennen?</p>
              </div>
              <button onClick={() => setDialog({ type: "none" })} className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors" type="button"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4L12 12M12 4L4 12" /></svg></button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="primary" onClick={() => handlePromote(dialog.user.id)}>Ja, ernennen</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Demote Dialog */}
      {dialog.type === "demote" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg animate-scale-in" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>Moderator entfernen</h4>
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}><strong>{dialog.user.username}</strong> den Moderator-Status entziehen?</p>
              </div>
              <button onClick={() => setDialog({ type: "none" })} className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors" type="button"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4L12 12M12 4L4 12" /></svg></button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="danger" onClick={() => handleDemote(dialog.user.id)}>Ja, entfernen</XpButton>
            </div>
          </div>
        </div>
      )}

      {/* Score Adjust Dialog */}
      {dialog.type === "score" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setDialog({ type: "none" })}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg animate-scale-in" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold mb-2" style={{ fontFamily: "var(--font-heading)" }}>Glegg-Score anpassen — {dialog.user.username}</h4>
                <label className="mb-1 block text-sm" style={{ color: "var(--color-text-muted)" }}>Aktueller Score: <strong>{dialog.user.glegg_score}</strong></label>
                <label className="mb-1 block text-sm" style={{ color: "var(--color-text-muted)" }}>Neuer Score:</label>
                <input type="number" value={dialog.newScore} onChange={(e) => setDialog({ ...dialog, newScore: e.target.value })} className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm" />
              </div>
              <button onClick={() => setDialog({ type: "none" })} className="shrink-0 rounded-lg p-1 hover:bg-[var(--color-border)] transition-colors" type="button"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4L12 12M12 4L4 12" /></svg></button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <XpButton onClick={() => setDialog({ type: "none" })}>Abbrechen</XpButton>
              <XpButton variant="primary" disabled={!dialog.newScore.trim() || isNaN(Number(dialog.newScore))} onClick={() => handleScoreChange(dialog.user.id, Number(dialog.newScore))}>Speichern</XpButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
