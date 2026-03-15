"use client";

import { useState } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { BadgeDisplay } from "@/components/community/badge-display";
import { GleggScoreDisplay } from "@/components/community/glegg-score-display";
import { UserProfileCard } from "@/components/community/user-profile-card";
import type { MockUserWithStats } from "@/lib/mock-users";

type Tab = "score" | "troll" | "badges";

interface LeaderboardViewProps {
  users: MockUserWithStats[];
}

function getRankStyle(rank: number): {
  bg: string;
  border: string;
  text: string;
  label: string;
} {
  switch (rank) {
    case 1:
      return {
        bg: "#FFF8DC",
        border: "#DAA520",
        text: "#B8860B",
        label: "🥇",
      };
    case 2:
      return {
        bg: "#F5F5F5",
        border: "#C0C0C0",
        text: "#808080",
        label: "🥈",
      };
    case 3:
      return {
        bg: "#FFF0E6",
        border: "#CD7F32",
        text: "#8B4513",
        label: "🥉",
      };
    default:
      return {
        bg: "#FFFFFF",
        border: "var(--xp-border-dark)",
        text: "var(--xp-text)",
        label: `${rank}.`,
      };
  }
}

export function LeaderboardView({ users }: LeaderboardViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("score");
  const [selectedUser, setSelectedUser] = useState<MockUserWithStats | null>(null);

  const sortedUsers = [...users].sort((a, b) => {
    switch (activeTab) {
      case "score":
        return b.glegg_score - a.glegg_score;
      case "troll":
        // Troll des Monats first, then by score
        if (a.isTrollDesMonats && !b.isTrollDesMonats) return -1;
        if (!a.isTrollDesMonats && b.isTrollDesMonats) return 1;
        return b.glegg_score - a.glegg_score;
      case "badges":
        return b.badges.length - a.badges.length;
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <XpWindow title="🏆 Glegg-Leaderboard — ranking.exe">
        <div className="flex flex-col gap-3">
          {/* Tab bar */}
          <div className="flex flex-wrap gap-1">
            <XpButton
              onClick={() => setActiveTab("score")}
              className={activeTab === "score" ? "xp-button-pressed" : ""}
            >
              Top Glegg-Score
            </XpButton>
            <XpButton
              onClick={() => setActiveTab("troll")}
              className={activeTab === "troll" ? "xp-button-pressed" : ""}
            >
              Troll des Monats
            </XpButton>
            <XpButton
              onClick={() => setActiveTab("badges")}
              className={activeTab === "badges" ? "xp-button-pressed" : ""}
            >
              Badge-Sammler
            </XpButton>
          </div>

          {/* Tab description */}
          <div
            className="xp-inset px-2 py-1"
            style={{ backgroundColor: "#F1EFE2" }}
          >
            <span className="xp-text-label">
              {activeTab === "score" && "Rangliste nach Glegg-Score — Wer hat am meisten abgeliefert?"}
              {activeTab === "troll" && "Der aktuelle Troll des Monats und die Anwaerter auf den Thron."}
              {activeTab === "badges" && "Wer hat die meisten Badges gesammelt? Die fleissigsten Sammler."}
            </span>
          </div>

          {/* Leaderboard list */}
          <div className="flex flex-col gap-1">
            {sortedUsers.map((user, index) => {
              const rank = index + 1;
              const style = getRankStyle(rank);
              const isTop3 = rank <= 3;
              const initials = user.username.slice(0, 2).toUpperCase();

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  className={`flex w-full items-center gap-3 p-2 text-left transition-colors hover:brightness-95 ${
                    isTop3 ? "xp-raised-strong" : "xp-raised"
                  }`}
                  style={{
                    backgroundColor: style.bg,
                    borderColor: isTop3 ? style.border : undefined,
                    fontFamily: "Tahoma, Verdana, sans-serif",
                  }}
                >
                  {/* Rank */}
                  <div
                    className="flex w-8 shrink-0 items-center justify-center text-center font-bold"
                    style={{
                      fontSize: isTop3 ? "18px" : "13px",
                      color: style.text,
                    }}
                  >
                    {style.label}
                  </div>

                  {/* Avatar */}
                  <div
                    className="xp-raised flex h-8 w-8 shrink-0 items-center justify-center text-[11px] font-bold"
                    style={{
                      backgroundColor: user.is_admin
                        ? "var(--glegg-orange)"
                        : user.is_moderator
                          ? "var(--xp-gruen)"
                          : "var(--xp-blau-start)",
                      color: "#FFFFFF",
                    }}
                  >
                    {initials}
                  </div>

                  {/* Username + badges */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-1">
                      <span
                        className={`truncate ${isTop3 ? "font-bold" : ""}`}
                        style={{
                          fontSize: isTop3 ? "14px" : "12px",
                          color: style.text,
                        }}
                      >
                        {user.username}
                      </span>
                      {user.isTrollDesMonats && (
                        <span title="Troll des Monats">👑</span>
                      )}
                      {user.is_admin && (
                        <span
                          className="xp-raised px-1 text-[8px] font-bold"
                          style={{
                            backgroundColor: "var(--glegg-orange)",
                            color: "#FFFFFF",
                          }}
                        >
                          ADMIN
                        </span>
                      )}
                      {user.is_moderator && !user.is_admin && (
                        <span
                          className="xp-raised px-1 text-[8px] font-bold"
                          style={{
                            backgroundColor: "var(--xp-gruen)",
                            color: "#FFFFFF",
                          }}
                        >
                          MOD
                        </span>
                      )}
                      {/* Inline badges (first 3) */}
                      <div className="hidden items-center gap-[2px] sm:flex">
                        {user.badges.slice(0, 3).map((b) => (
                          <BadgeDisplay key={b} badgeType={b} size="sm" earned />
                        ))}
                        {user.badges.length > 3 && (
                          <span
                            className="text-[9px]"
                            style={{ color: "var(--xp-border-dark)" }}
                          >
                            +{user.badges.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score / Badge count */}
                  <div className="flex shrink-0 flex-col items-end">
                    {activeTab === "badges" ? (
                      <>
                        <span
                          className="font-bold"
                          style={{
                            fontSize: isTop3 ? "16px" : "13px",
                            color: style.text,
                          }}
                        >
                          {user.badges.length} Badges
                        </span>
                      </>
                    ) : (
                      <>
                        <span
                          className="font-bold"
                          style={{
                            fontSize: isTop3 ? "16px" : "13px",
                            color: style.text,
                          }}
                        >
                          {user.glegg_score.toLocaleString("de-DE")}
                        </span>
                        <span
                          className="text-[9px]"
                          style={{ color: "var(--xp-border-dark)" }}
                        >
                          Glegg-Score
                        </span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div
            className="xp-inset px-2 py-1"
            style={{ backgroundColor: "#F1EFE2" }}
          >
            <span className="xp-text-label">
              {sortedUsers.length} Benutzer im Ranking
            </span>
          </div>
        </div>
      </XpWindow>

      {/* Selected user profile card */}
      {selectedUser && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <XpButton onClick={() => setSelectedUser(null)}>
              Profil schliessen ✕
            </XpButton>
          </div>
          <UserProfileCard user={selectedUser} />
        </div>
      )}
    </div>
  );
}
