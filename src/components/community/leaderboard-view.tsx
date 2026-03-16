"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { BadgeDisplay } from "@/components/community/badge-display";
import { UserProfileCard } from "@/components/community/user-profile-card";
import type { UserWithStats } from "@/lib/data/users";

interface LeaderboardViewProps {
  users: UserWithStats[];
}

function getAvatarColor(user: UserWithStats) {
  if (user.is_admin) return "#E8593C";
  if (user.is_moderator) return "#2563eb";
  return "#2563eb";
}

function PodiumUser({
  user,
  rank,
  onClick,
}: {
  user: UserWithStats | null;
  rank: 1 | 2 | 3;
  onClick: () => void;
}) {
  const avatarSizes = { 1: "h-16 w-16 text-xl", 2: "h-12 w-12 text-sm", 3: "h-12 w-12 text-sm" };
  const podiumHeights = { 1: "h-24", 2: "h-16", 3: "h-12" };
  const podiumColors = { 1: "bg-amber-400", 2: "bg-zinc-300", 3: "bg-orange-300" };
  const podiumLabels = { 1: "1", 2: "2", 3: "3" };

  // Empty placeholder
  if (!user) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          {rank === 1 && (
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl select-none opacity-30">
              &#x1F451;
            </span>
          )}
          <div
            className={`flex shrink-0 items-center justify-center rounded-full ${avatarSizes[rank]}`}
            style={{ backgroundColor: "var(--color-border)" }}
          >
            <svg
              width={rank === 1 ? 28 : 20}
              height={rank === 1 ? 28 : 20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.5 }}
            >
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
        <span className="max-w-[100px] truncate text-xs font-bold" style={{ color: "var(--color-text-muted)" }}>
          —
        </span>
        <span className="text-[11px] font-semibold" style={{ color: "var(--color-text-muted)" }}>
          —
        </span>
        <div
          className={`flex w-20 items-center justify-center rounded-t-lg ${podiumHeights[rank]} ${podiumColors[rank]}`}
          style={{ opacity: 0.4 }}
        >
          <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
            {podiumLabels[rank]}
          </span>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-2 transition-transform hover:scale-105"
    >
      {/* Avatar + Crown */}
      <div className="relative">
        {rank === 1 && (
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-2xl select-none">
            &#x1F451;
          </span>
        )}
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className={`shrink-0 rounded-full object-cover ${avatarSizes[rank]}`}
            style={{
              border: rank === 1 ? "3px solid #F59E0B" : "2px solid var(--color-border)",
            }}
          />
        ) : (
          <div
            className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${avatarSizes[rank]}`}
            style={{
              backgroundColor: getAvatarColor(user),
              border: rank === 1 ? "3px solid #F59E0B" : "2px solid var(--color-border)",
            }}
          >
            {user.username.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name */}
      <span className="max-w-[100px] truncate text-xs font-bold text-[var(--color-text)]">
        {user.username}
      </span>

      {/* Score */}
      <span className="text-[11px] font-semibold" style={{ color: "var(--color-text-muted)" }}>
        {user.glegg_score.toLocaleString("de-DE")}
      </span>

      {/* Podium block */}
      <div
        className={`flex w-20 items-center justify-center rounded-t-lg ${podiumHeights[rank]} ${podiumColors[rank]}`}
      >
        <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
          {podiumLabels[rank]}
        </span>
      </div>
    </button>
  );
}

export function LeaderboardView({ users }: LeaderboardViewProps) {
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);

  const sortedUsers = [...users].sort((a, b) => b.glegg_score - a.glegg_score);

  // Always show 6 slots — fill with null for empty positions
  const slots: (UserWithStats | null)[] = Array.from({ length: 6 }, (_, i) => sortedUsers[i] ?? null);
  const first = slots[0];
  const second = slots[1];
  const third = slots[2];
  const rest = slots.slice(3);

  return (
    <div className="flex flex-col gap-6">
      {/* Podium — Top 3 (always shown, with placeholders if empty) */}
      <div className="flex items-end justify-center gap-3 pt-8 sm:gap-6">
        <PodiumUser user={second} rank={2} onClick={() => second && setSelectedUser(second)} />
        <PodiumUser user={first} rank={1} onClick={() => first && setSelectedUser(first)} />
        <PodiumUser user={third} rank={3} onClick={() => third && setSelectedUser(third)} />
      </div>

      {/* Ranks 4–6 (always shown) */}
      <div className="flex flex-col gap-2">
        {rest.map((user, i) => {
          const rank = i + 4;

          if (!user) {
            return (
              <div
                key={`empty-${rank}`}
                className="flex w-full items-center gap-3 rounded-xl p-3"
                style={{ border: "1.5px solid var(--color-border)", opacity: 0.5 }}
              >
                <div className="flex w-8 shrink-0 items-center justify-center text-sm font-bold text-[var(--color-text-muted)]">
                  {rank}.
                </div>
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--color-border)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-sm text-[var(--color-text-muted)]">—</span>
                <span className="ml-auto shrink-0 text-sm font-bold text-[var(--color-text-muted)]">—</span>
              </div>
            );
          }

          return (
            <button
              key={user.id}
              type="button"
              onClick={() => setSelectedUser(user)}
              className="card-hover flex w-full items-center gap-3 p-3 text-left"
            >
              {/* Rank */}
              <div className="flex w-8 shrink-0 items-center justify-center text-sm font-bold text-[var(--color-text-muted)]">
                {rank}.
              </div>

              {/* Avatar */}
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: getAvatarColor(user) }}
                >
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Username + badges */}
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <span className="truncate text-sm font-medium text-[var(--color-text)]">
                  {user.username}
                </span>
                {user.is_admin && (
                  <span className="rounded-full bg-[var(--color-accent)] px-1.5 py-0.5 text-[8px] font-bold text-white">
                    ADMIN
                  </span>
                )}
                {user.is_moderator && !user.is_admin && (
                  <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[8px] font-bold text-white">
                    MOD
                  </span>
                )}
                <div className="hidden items-center gap-[2px] sm:flex">
                  {user.badges.slice(0, 3).map((b) => (
                    <BadgeDisplay key={b} badgeType={b} size="sm" earned />
                  ))}
                </div>
              </div>

              {/* Score */}
              <span className="shrink-0 text-sm font-bold text-[var(--color-text-muted)]">
                {user.glegg_score.toLocaleString("de-DE")}
              </span>
            </button>
          );
        })}
      </div>

      {/* User profile modal */}
      <Modal
        open={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title={selectedUser ? `${selectedUser.username} — Profil` : ""}
        maxWidth="max-w-xl"
      >
        {selectedUser && <UserProfileCard user={selectedUser} />}
      </Modal>
    </div>
  );
}
