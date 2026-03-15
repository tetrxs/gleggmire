"use client";

import { useState } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { ModerationQueue } from "./moderation-queue";
import { UserManagement } from "./user-management";
import { ModerationLog } from "./moderation-log";
import { BreakingNewsForm } from "./breaking-news-form";

type AdminView = "dashboard" | "queue" | "users" | "log" | "news";

const STATS = [
  { label: "Ausstehende Einreichungen", value: 7, color: "#E8593C" },
  { label: "Aktive Disputes", value: 2, color: "#ef4444" },
  { label: "Nutzer gesamt / gebannt", value: "10 / 0", color: "#2563eb" },
  { label: "Mod-Aktionen heute", value: 3, color: "#16a34a" },
];

export function AdminDashboard() {
  const [view, setView] = useState<AdminView>("dashboard");

  if (view === "queue") {
    return (
      <div>
        <div className="mb-4">
          <XpButton onClick={() => setView("dashboard")}>Zurueck zum Dashboard</XpButton>
        </div>
        <ModerationQueue />
      </div>
    );
  }

  if (view === "users") {
    return (
      <div>
        <div className="mb-4">
          <XpButton onClick={() => setView("dashboard")}>Zurueck zum Dashboard</XpButton>
        </div>
        <UserManagement />
      </div>
    );
  }

  if (view === "log") {
    return (
      <div>
        <div className="mb-4">
          <XpButton onClick={() => setView("dashboard")}>Zurueck zum Dashboard</XpButton>
        </div>
        <ModerationLog />
      </div>
    );
  }

  if (view === "news") {
    return (
      <div>
        <div className="mb-4">
          <XpButton onClick={() => setView("dashboard")}>Zurueck zum Dashboard</XpButton>
        </div>
        <BreakingNewsForm />
      </div>
    );
  }

  return (
    <XpWindow title="Admin-Panel">
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 dark:border-zinc-700"
          >
            <div className="text-xs text-[var(--color-muted)] mb-1">{stat.label}</div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 dark:border-zinc-700">
        <div className="text-sm font-semibold text-[var(--color-text)] mb-3">Schnellaktionen</div>
        <div className="flex flex-wrap gap-2">
          <XpButton variant="primary" onClick={() => setView("queue")}>
            Moderations-Queue oeffnen
          </XpButton>
          <XpButton onClick={() => setView("users")}>
            Nutzer verwalten
          </XpButton>
          <XpButton variant="danger" onClick={() => setView("news")}>
            Breaking News senden
          </XpButton>
          <XpButton onClick={() => setView("log")}>
            Moderations-Log
          </XpButton>
        </div>
      </div>

      {/* System Info */}
      <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 dark:border-zinc-700">
        <div className="font-mono text-xs text-[var(--color-muted)] space-y-0.5">
          <div>System: gleggmire.net v1.0.0</div>
          <div>Admin-Modus: AKTIV</div>
          <div>Letzte Pruefung: {new Date().toLocaleString("de-DE")}</div>
          <div className="mt-1 text-emerald-600 dark:text-emerald-400">
            Alle Systeme nominal.
          </div>
        </div>
      </div>
    </XpWindow>
  );
}
