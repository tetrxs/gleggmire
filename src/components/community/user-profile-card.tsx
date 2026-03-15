"use client";

import { XpWindow } from "@/components/ui/xp-window";
import { BadgeDisplay } from "@/components/community/badge-display";
import { GleggScoreDisplay } from "@/components/community/glegg-score-display";
import { BADGES } from "@/lib/constants/badges";
import type { MockUserWithStats } from "@/lib/mock-users";

interface UserProfileCardProps {
  user: MockUserWithStats;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const initials = user.username.slice(0, 2).toUpperCase();
  const memberSince = new Date(user.joined_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <XpWindow title={`${user.username} — Profil`}>
      <div className="flex flex-col gap-5">
        {/* Header: Avatar + Name + Badges */}
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
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

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-lg font-bold text-[var(--color-text)]">{user.username}</span>
              {user.isTrollDesMonats && <span title="Troll des Monats">&#x1F451;</span>}
              {user.is_admin && (
                <span className="rounded-full bg-[#E8593C] px-2 py-0.5 text-[10px] font-bold text-white">
                  ADMIN
                </span>
              )}
              {user.is_moderator && !user.is_admin && (
                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  MOD
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {user.badges.slice(0, 6).map((b) => (
                <BadgeDisplay key={b} badgeType={b} size="sm" earned />
              ))}
              {user.badges.length > 6 && (
                <span className="text-xs text-[var(--color-muted)]">
                  +{user.badges.length - 6}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Glegg-Score */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 dark:border-zinc-700">
          <GleggScoreDisplay score={user.glegg_score} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Eintraege erstellt", value: user.stats.termsCreated },
            { label: "Clips verlinkt", value: user.stats.clipsLinked },
            { label: "Kommentare", value: user.stats.comments },
            { label: "Ratio-Wins", value: user.stats.ratioWins },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 dark:border-zinc-700">
              <span className="block text-xs text-[var(--color-muted)]">{stat.label}</span>
              <span className="text-lg font-bold text-[var(--color-text)]">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Member since */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 dark:border-zinc-700">
          <span className="text-xs text-[var(--color-muted)]">
            Mitglied seit: <strong className="text-[var(--color-text)]">{memberSince}</strong>
          </span>
        </div>

        {/* Badge showcase */}
        <div>
          <span className="mb-2 block text-sm font-bold text-[var(--color-text)]">
            Badge-Sammlung ({user.badges.length}/{BADGES.length})
          </span>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
            {BADGES.map((badge) => (
              <BadgeDisplay
                key={badge.type}
                badgeType={badge.type}
                size="md"
                earned={user.badges.includes(badge.type)}
              />
            ))}
          </div>
        </div>
      </div>
    </XpWindow>
  );
}
