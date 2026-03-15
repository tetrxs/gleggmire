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
      <XpWindow title="👥 Nutzerverwaltung — users.exe">
        {/* Search */}
        <div className="mb-3">
          <div
            className="xp-text-label mb-1"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Nutzer suchen:
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Username oder Discord-ID..."
              className="xp-inset flex-1 px-2 py-1"
              style={{
                backgroundColor: "#FFFFFF",
                fontSize: "11px",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
            />
            <XpButton onClick={() => setSearch("")}>Zuruecksetzen</XpButton>
          </div>
        </div>

        {/* User Count */}
        <div
          className="xp-text-label mb-2"
          style={{ color: "var(--xp-border-dark)" }}
        >
          {filteredUsers.length} Nutzer gefunden
        </div>

        {/* User List */}
        <div className="flex flex-col gap-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="xp-raised p-3"
              style={{
                backgroundColor: user.is_banned
                  ? "#FFE0E0"
                  : "var(--xp-silber-luna)",
                borderColor: user.is_banned
                  ? "var(--xp-fehler-rot)"
                  : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div
                  className="xp-inset flex h-10 w-10 shrink-0 items-center justify-center"
                  style={{
                    backgroundColor: "#FFFFFF",
                    fontSize: "18px",
                  }}
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="xp-text-heading">
                      {user.username}
                    </span>
                    {user.is_admin && (
                      <span
                        className="xp-text-label font-bold"
                        style={{ color: "var(--glegg-orange)" }}
                      >
                        [ADMIN]
                      </span>
                    )}
                    {user.is_moderator && !user.is_admin && (
                      <span
                        className="xp-text-label font-bold"
                        style={{ color: "var(--xp-blau-start)" }}
                      >
                        [MOD]
                      </span>
                    )}
                    {user.is_banned && (
                      <span
                        className="xp-text-label font-bold"
                        style={{ color: "var(--xp-fehler-rot)" }}
                      >
                        [GEBANNT]
                      </span>
                    )}
                  </div>
                  <div
                    className="xp-text-label"
                    style={{ color: "var(--xp-border-dark)" }}
                  >
                    Discord-ID: {user.discord_id} | Glegg-Score:{" "}
                    <span className="font-bold">{user.glegg_score}</span> |
                    Status:{" "}
                    {user.is_banned ? (
                      <span style={{ color: "var(--xp-fehler-rot)" }}>
                        Gebannt
                        {user.ban_reason && ` (${user.ban_reason})`}
                      </span>
                    ) : (
                      <span style={{ color: "var(--xp-gruen)" }}>
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
                    onClick={() =>
                      setDialog({ type: "unban", user })
                    }
                  >
                    Entsperren
                  </XpButton>
                ) : (
                  <XpButton
                    variant="danger"
                    onClick={() =>
                      setDialog({ type: "ban-confirm", user })
                    }
                  >
                    Bannen
                  </XpButton>
                )}

                {user.is_moderator && !user.is_admin ? (
                  <XpButton
                    onClick={() =>
                      setDialog({ type: "demote", user })
                    }
                  >
                    Moderator entfernen
                  </XpButton>
                ) : !user.is_moderator && !user.is_admin ? (
                  <XpButton
                    onClick={() =>
                      setDialog({ type: "promote", user })
                    }
                  >
                    Zum Moderator ernennen
                  </XpButton>
                ) : null}

                <XpButton
                  onClick={() =>
                    setDialog({
                      type: "score",
                      user,
                      newScore: String(user.glegg_score),
                    })
                  }
                >
                  Glegg-Score anpassen
                </XpButton>
              </div>
            </div>
          ))}
        </div>
      </XpWindow>

      {/* Ban Step 1: "Bist du sicher?" */}
      {dialog.type === "ban-confirm" && (
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
              <span>Nutzer bannen</span>
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
                  Bist du sicher, dass du{" "}
                  <strong>{dialog.user.username}</strong> bannen willst?
                </p>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="danger"
                  onClick={() =>
                    setDialog({
                      type: "ban-reason",
                      user: dialog.user,
                      reason: "",
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

      {/* Ban Step 2: Reason */}
      {dialog.type === "ban-reason" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[420px]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Banngrund angeben</span>
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
              <div className="mb-3">
                <label
                  className="xp-text-label mb-1 block"
                  style={{ color: "var(--xp-border-dark)" }}
                >
                  Grund fuer den Bann von{" "}
                  <strong>{dialog.user.username}</strong>:
                </label>
                <textarea
                  value={dialog.reason}
                  onChange={(e) =>
                    setDialog({ ...dialog, reason: e.target.value })
                  }
                  className="xp-inset w-full p-2"
                  style={{
                    backgroundColor: "#FFFFFF",
                    fontSize: "11px",
                    fontFamily: "Tahoma, Verdana, sans-serif",
                    minHeight: "60px",
                    resize: "vertical",
                  }}
                  placeholder="Banngrund eingeben..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <XpButton
                  variant="danger"
                  disabled={!dialog.reason.trim()}
                  onClick={() =>
                    setDialog({
                      type: "ban-final",
                      user: dialog.user,
                      reason: dialog.reason,
                      confirmText: "",
                    })
                  }
                >
                  Weiter
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban Step 3: Type username to confirm */}
      {dialog.type === "ban-final" && (
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
                    Tippe den Nutzernamen{" "}
                    <strong>{dialog.user.username}</strong> ein, um den
                    Bann zu bestaetigen:
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
                    placeholder={dialog.user.username}
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="danger"
                  disabled={
                    dialog.confirmText !== dialog.user.username
                  }
                  onClick={() =>
                    handleBan(dialog.user.id, dialog.reason)
                  }
                >
                  BANNEN
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unban Dialog */}
      {dialog.type === "unban" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[400px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Nutzer entsperren</span>
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
              <p className="xp-text-body">
                <strong>{dialog.user.username}</strong> entsperren?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="primary"
                  onClick={() => handleUnban(dialog.user.id)}
                >
                  Ja, entsperren
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promote Dialog */}
      {dialog.type === "promote" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[400px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Zum Moderator ernennen</span>
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
              <p className="xp-text-body">
                <strong>{dialog.user.username}</strong> zum Moderator
                ernennen?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="primary"
                  onClick={() => handlePromote(dialog.user.id)}
                >
                  Ja, ernennen
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demote Dialog */}
      {dialog.type === "demote" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[400px]"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>Moderator entfernen</span>
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
              <p className="xp-text-body">
                <strong>{dialog.user.username}</strong> den
                Moderator-Status entziehen?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <XpButton
                  variant="danger"
                  onClick={() => handleDemote(dialog.user.id)}
                >
                  Ja, entfernen
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Score Adjust Dialog */}
      {dialog.type === "score" && (
        <div
          className="xp-overlay"
          onClick={() => setDialog({ type: "none" })}
        >
          <div
            className="xp-window-outer w-[400px]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="xp-titlebar">
              <span>
                Glegg-Score anpassen — {dialog.user.username}
              </span>
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
              <div className="mb-3">
                <label
                  className="xp-text-label mb-1 block"
                  style={{ color: "var(--xp-border-dark)" }}
                >
                  Aktueller Score:{" "}
                  <strong>{dialog.user.glegg_score}</strong>
                </label>
                <label
                  className="xp-text-label mb-1 block"
                  style={{ color: "var(--xp-border-dark)" }}
                >
                  Neuer Score:
                </label>
                <input
                  type="number"
                  value={dialog.newScore}
                  onChange={(e) =>
                    setDialog({ ...dialog, newScore: e.target.value })
                  }
                  className="xp-inset w-full px-2 py-1"
                  style={{
                    backgroundColor: "#FFFFFF",
                    fontSize: "11px",
                    fontFamily: "Tahoma, Verdana, sans-serif",
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <XpButton
                  variant="primary"
                  disabled={
                    !dialog.newScore.trim() ||
                    isNaN(Number(dialog.newScore))
                  }
                  onClick={() =>
                    handleScoreChange(
                      dialog.user.id,
                      Number(dialog.newScore)
                    )
                  }
                >
                  Speichern
                </XpButton>
                <XpButton onClick={() => setDialog({ type: "none" })}>
                  Abbrechen
                </XpButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
