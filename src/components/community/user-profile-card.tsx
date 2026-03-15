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
    <XpWindow title={`👤 ${user.username} — profil.exe`}>
      <div className="flex flex-col gap-4">
        {/* Header: Avatar + Name + Badges */}
        <div className="flex items-center gap-4">
          {/* Large avatar */}
          <div
            className="xp-raised flex h-16 w-16 shrink-0 items-center justify-center text-[20px] font-bold"
            style={{
              backgroundColor: user.is_admin
                ? "var(--glegg-orange)"
                : user.is_moderator
                  ? "var(--xp-gruen)"
                  : "var(--xp-blau-start)",
              color: "#FFFFFF",
              fontFamily: "Tahoma, Verdana, sans-serif",
            }}
          >
            {initials}
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-1">
              <span className="xp-text-heading">{user.username}</span>
              {user.isTrollDesMonats && <span title="Troll des Monats">👑</span>}
              {user.is_admin && (
                <span
                  className="xp-raised px-1 text-[9px] font-bold"
                  style={{ backgroundColor: "var(--glegg-orange)", color: "#FFFFFF" }}
                >
                  ADMIN
                </span>
              )}
              {user.is_moderator && !user.is_admin && (
                <span
                  className="xp-raised px-1 text-[9px] font-bold"
                  style={{ backgroundColor: "var(--xp-gruen)", color: "#FFFFFF" }}
                >
                  MOD
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {user.badges.slice(0, 6).map((b) => (
                <BadgeDisplay key={b} badgeType={b} size="sm" earned />
              ))}
              {user.badges.length > 6 && (
                <span
                  className="xp-text-label"
                  style={{ color: "var(--xp-border-dark)" }}
                >
                  +{user.badges.length - 6}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Glegg-Score */}
        <div
          className="xp-inset p-2"
          style={{ backgroundColor: "#F1EFE2" }}
        >
          <GleggScoreDisplay score={user.glegg_score} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="xp-inset p-2" style={{ backgroundColor: "#FFFFFF" }}>
            <span className="xp-text-label block" style={{ color: "var(--xp-border-dark)" }}>
              Eintraege erstellt
            </span>
            <span className="xp-text-body font-bold">{user.stats.termsCreated}</span>
          </div>
          <div className="xp-inset p-2" style={{ backgroundColor: "#FFFFFF" }}>
            <span className="xp-text-label block" style={{ color: "var(--xp-border-dark)" }}>
              Clips verlinkt
            </span>
            <span className="xp-text-body font-bold">{user.stats.clipsLinked}</span>
          </div>
          <div className="xp-inset p-2" style={{ backgroundColor: "#FFFFFF" }}>
            <span className="xp-text-label block" style={{ color: "var(--xp-border-dark)" }}>
              Kommentare
            </span>
            <span className="xp-text-body font-bold">{user.stats.comments}</span>
          </div>
          <div className="xp-inset p-2" style={{ backgroundColor: "#FFFFFF" }}>
            <span className="xp-text-label block" style={{ color: "var(--xp-border-dark)" }}>
              Ratio-Wins
            </span>
            <span className="xp-text-body font-bold">{user.stats.ratioWins}</span>
          </div>
        </div>

        {/* Member since */}
        <div
          className="xp-inset px-2 py-1"
          style={{ backgroundColor: "#F1EFE2" }}
        >
          <span className="xp-text-label">
            Mitglied seit: <strong>{memberSince}</strong>
          </span>
        </div>

        {/* Badge showcase */}
        <div>
          <span className="xp-text-label mb-2 block font-bold">
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
