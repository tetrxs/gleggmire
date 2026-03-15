"use client";

import { useState } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { BadgeDisplay } from "@/components/community/badge-display";
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
      return { bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-400", text: "text-amber-700 dark:text-amber-400", label: "1." };
    case 2:
      return { bg: "bg-zinc-100 dark:bg-zinc-800/50", border: "border-zinc-400", text: "text-zinc-600 dark:text-zinc-300", label: "2." };
    case 3:
      return { bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-400", text: "text-orange-700 dark:text-orange-400", label: "3." };
    default:
      return { bg: "bg-[var(--color-bg)]", border: "border-[var(--color-border)] dark:border-zinc-700", text: "text-[var(--color-text)]", label: `${rank}.` };
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
        if (a.isTrollDesMonats && !b.isTrollDesMonats) return -1;
        if (!a.isTrollDesMonats && b.isTrollDesMonats) return 1;
        return b.glegg_score - a.glegg_score;
      case "badges":
        return b.badges.length - a.badges.length;
    }
  });

  const tabs: { mode: Tab; label: string }[] = [
    { mode: "score", label: "Top Glegg-Score" },
    { mode: "troll", label: "Troll des Monats" },
    { mode: "badges", label: "Badge-Sammler" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <XpWindow title="Glegg-Leaderboard">
        <div className="flex flex-col gap-4">
          {/* Tab bar */}
          <div className="inline-flex rounded-lg border border-[var(--color-border)] p-1 dark:border-zinc-700">
            {tabs.map(({ mode, label }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setActiveTab(mode)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === mode
                    ? "bg-[#E8593C] text-white"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab description */}
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 dark:border-zinc-700">
            <span className="text-sm text-[var(--color-muted)]">
              {activeTab === "score" && "Rangliste nach Glegg-Score — Wer hat am meisten abgeliefert?"}
              {activeTab === "troll" && "Der aktuelle Troll des Monats und die Anwaerter auf den Thron."}
              {activeTab === "badges" && "Wer hat die meisten Badges gesammelt? Die fleissigsten Sammler."}
            </span>
          </div>

          {/* Leaderboard list */}
          <div className="flex flex-col gap-1.5">
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
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-[var(--color-surface)] cursor-pointer ${style.bg} ${style.border}`}
                >
                  {/* Rank */}
                  <div className={`flex w-8 shrink-0 items-center justify-center text-center font-bold ${style.text} ${isTop3 ? "text-lg" : "text-sm"}`}>
                    {style.label}
                  </div>

                  {/* Avatar */}
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{
                      backgroundColor: user.is_admin
                        ? "#E8593C"
                        : user.is_moderator
                          ? "#16a34a"
                          : "#2563eb",
                    }}
                  >
                    {initials}
                  </div>

                  {/* Username + badges */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`truncate text-[var(--color-text)] ${isTop3 ? "font-bold text-sm" : "text-sm"}`}>
                        {user.username}
                      </span>
                      {user.isTrollDesMonats && (
                        <span title="Troll des Monats">&#x1F451;</span>
                      )}
                      {user.is_admin && (
                        <span className="rounded-full bg-[#E8593C] px-1.5 py-0.5 text-[8px] font-bold text-white">
                          ADMIN
                        </span>
                      )}
                      {user.is_moderator && !user.is_admin && (
                        <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[8px] font-bold text-white">
                          MOD
                        </span>
                      )}
                      {/* Inline badges (first 3) */}
                      <div className="hidden items-center gap-[2px] sm:flex">
                        {user.badges.slice(0, 3).map((b) => (
                          <BadgeDisplay key={b} badgeType={b} size="sm" earned />
                        ))}
                        {user.badges.length > 3 && (
                          <span className="text-[9px] text-[var(--color-muted)]">
                            +{user.badges.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score / Badge count */}
                  <div className="flex shrink-0 flex-col items-end">
                    {activeTab === "badges" ? (
                      <span className={`font-bold ${style.text} ${isTop3 ? "text-base" : "text-sm"}`}>
                        {user.badges.length} Badges
                      </span>
                    ) : (
                      <>
                        <span className={`font-bold ${style.text} ${isTop3 ? "text-base" : "text-sm"}`}>
                          {user.glegg_score.toLocaleString("de-DE")}
                        </span>
                        <span className="text-[9px] text-[var(--color-muted)]">
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
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 dark:border-zinc-700">
            <span className="text-xs text-[var(--color-muted)]">
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
              Profil schliessen
            </XpButton>
          </div>
          <UserProfileCard user={selectedUser} />
        </div>
      )}
    </div>
  );
}
