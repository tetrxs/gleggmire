"use client";

import { useState } from "react";
import { BadgeDisplay } from "@/components/community/badge-display";
import { GleggScoreDisplay } from "@/components/community/glegg-score-display";
import { BADGES } from "@/lib/constants/badges";

interface ProfileData {
  username: string;
  avatar_url?: string;
  glegg_score: number;
  is_admin: boolean;
  is_moderator: boolean;
  is_gleggmire: boolean;
  notifications_enabled: boolean;
  joined_at: string;
  badges: string[];
  stats: {
    termsCreated: number;
    definitionsWritten: number;
    comments: number;
  };
}

export function ProfileView({ profile }: { profile: ProfileData }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.notifications_enabled
  );
  const [toggling, setToggling] = useState(false);

  const initials = profile.username.slice(0, 2).toUpperCase();
  const memberSince = new Date(profile.joined_at).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  async function handleToggleNotifications() {
    if (toggling) return;
    setToggling(true);
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);

    try {
      const res = await fetch("/api/v1/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newValue }),
      });
      if (!res.ok) {
        setNotificationsEnabled(!newValue);
      }
    } catch {
      setNotificationsEnabled(!newValue);
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="py-10">
      {/* Page heading */}
      <h1
        className="text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: "var(--color-text)" }}
      >
        Mein Profil
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Dein persoenliches Profil auf gleggmire.net
      </p>

      {/* Profile header card */}
      <div className="card mt-8 p-6">
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 shrink-0 rounded-full"
            />
          ) : (
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{
                backgroundColor: profile.is_admin
                  ? "#E8593C"
                  : profile.is_moderator
                    ? "#2563eb"
                    : "#2563eb",
              }}
            >
              {initials}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-bold text-[var(--color-text)]">
                {profile.username}
              </span>
              {profile.is_admin && (
                <span className="rounded-full bg-[#E8593C] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Admin
                </span>
              )}
              {profile.is_moderator && !profile.is_admin && (
                <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Mod
                </span>
              )}
            </div>
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              Mitglied seit {memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* Glegg-Score */}
      <div className="card mt-4 p-5">
        <GleggScoreDisplay score={profile.glegg_score} />
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[
          { label: "Eintraege erstellt", value: profile.stats.termsCreated },
          { label: "Definitionen", value: profile.stats.definitionsWritten },
          { label: "Kommentare", value: profile.stats.comments },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <span className="block text-xs" style={{ color: "var(--color-text-muted)" }}>
              {stat.label}
            </span>
            <span className="text-2xl font-bold text-[var(--color-text)]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Notifications toggle */}
      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-[var(--color-text)]">
              Benachrichtigungen
            </span>
            <p className="mt-0.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Nachrichten vom Discord-Bot erhalten
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            disabled={toggling}
            onClick={handleToggleNotifications}
            className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50"
            style={{
              backgroundColor: notificationsEnabled
                ? "var(--color-accent)"
                : "var(--color-border)",
            }}
          >
            <span
              className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200"
              style={{
                transform: notificationsEnabled
                  ? "translateX(20px)"
                  : "translateX(0px)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Badge showcase */}
      <div className="mt-8">
        <h2
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--color-text)" }}
        >
          Badge-Sammlung
        </h2>
        <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
          {profile.badges.length} von {BADGES.length} Badges freigeschaltet
        </p>
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
          {BADGES.map((badge) => (
            <BadgeDisplay
              key={badge.type}
              badgeType={badge.type}
              size="md"
              earned={profile.badges.includes(badge.type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
