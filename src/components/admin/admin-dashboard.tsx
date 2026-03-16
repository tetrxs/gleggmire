"use client";

import { useState } from "react";
import { ReportsView } from "./reports-view";
import { UserManagement } from "./user-management";
import { ModerationLog } from "./moderation-log";
import { SuggestionsManager } from "./suggestions-manager";
import type { UserWithStats } from "@/lib/data/users";
import type { ModerationLogEntry } from "@/lib/data/moderation-log";

type AdminView = "dashboard" | "reports" | "users" | "log" | "suggestions";

const ALL_NAV_ITEMS: { view: AdminView; label: string; adminOnly?: boolean }[] = [
  { view: "dashboard", label: "Dashboard" },
  { view: "reports", label: "Reports" },
  { view: "users", label: "Nutzerverwaltung", adminOnly: true },
  { view: "log", label: "Moderations-Log" },
  { view: "suggestions", label: "Vorschlaege", adminOnly: true },
];

interface AdminDashboardProps {
  allUsers: UserWithStats[];
  moderationLog?: ModerationLogEntry[];
  pendingReportsCount?: number;
  authLevel?: "admin" | "mod";
}

export function AdminDashboard({ allUsers, moderationLog = [], pendingReportsCount = 0, authLevel = "admin" }: AdminDashboardProps) {
  const [view, setView] = useState<AdminView>(authLevel === "mod" ? "reports" : "dashboard");

  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => !item.adminOnly || authLevel === "admin");

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full shrink-0 md:w-52">
        <nav className="card flex flex-col gap-0.5 p-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.view}
              type="button"
              onClick={() => setView(item.view)}
              className="w-full rounded-lg px-3 py-2 text-left text-sm no-underline transition-colors"
              style={{
                color: view === item.view ? "var(--color-accent)" : "var(--color-text)",
                backgroundColor: view === item.view ? "var(--color-bg)" : "transparent",
                fontWeight: view === item.view ? 600 : 400,
              }}
            >
              {item.label}
              {item.view === "reports" && pendingReportsCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {pendingReportsCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">
        {view === "dashboard" && <DashboardView pendingReportsCount={pendingReportsCount} userCount={allUsers.length} />}
        {view === "reports" && <ReportsView />}
        {view === "users" && <UserManagement initialUsers={allUsers} />}
        {view === "log" && <ModerationLog entries={moderationLog} />}
        {view === "suggestions" && <SuggestionsManager />}
      </div>
    </div>
  );
}

function DashboardView({ pendingReportsCount, userCount }: { pendingReportsCount: number; userCount: number }) {
  const stats = [
    { label: "Offene Reports", value: pendingReportsCount, color: "#E8593C" },
    { label: "Nutzer gesamt", value: userCount, color: "#2563eb" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {stat.label}
            </div>
            <div className="mt-1 text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      <div className="card p-4">
        <div className="font-mono text-xs space-y-0.5" style={{ color: "var(--color-text-muted)" }}>
          <div>System: gleggmire.net v1.0.0</div>
          <div>Moderation: AKTIV</div>
          <div>Letzte Pruefung: {new Date().toLocaleString("de-DE")}</div>
          <div className="mt-1 text-emerald-600">Alle Systeme nominal.</div>
        </div>
      </div>
    </div>
  );
}
