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
  {
    label: "Ausstehende Einreichungen",
    value: 7,
    color: "var(--glegg-orange)",
  },
  { label: "Aktive Disputes", value: 2, color: "var(--xp-fehler-rot)" },
  { label: "Nutzer gesamt / gebannt", value: "10 / 0", color: "var(--xp-blau-start)" },
  { label: "Mod-Aktionen heute", value: 3, color: "var(--xp-gruen)" },
];

export function AdminDashboard() {
  const [view, setView] = useState<AdminView>("dashboard");

  if (view === "queue") {
    return (
      <div>
        <div className="mb-3">
          <XpButton onClick={() => setView("dashboard")}>
            {"<"} Zurueck zum Dashboard
          </XpButton>
        </div>
        <ModerationQueue />
      </div>
    );
  }

  if (view === "users") {
    return (
      <div>
        <div className="mb-3">
          <XpButton onClick={() => setView("dashboard")}>
            {"<"} Zurueck zum Dashboard
          </XpButton>
        </div>
        <UserManagement />
      </div>
    );
  }

  if (view === "log") {
    return (
      <div>
        <div className="mb-3">
          <XpButton onClick={() => setView("dashboard")}>
            {"<"} Zurueck zum Dashboard
          </XpButton>
        </div>
        <ModerationLog />
      </div>
    );
  }

  if (view === "news") {
    return (
      <div>
        <div className="mb-3">
          <XpButton onClick={() => setView("dashboard")}>
            {"<"} Zurueck zum Dashboard
          </XpButton>
        </div>
        <BreakingNewsForm />
      </div>
    );
  }

  return (
    <XpWindow title="🔧 Admin-Panel — admin.exe">
      {/* Stats Cards */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="xp-raised p-3"
            style={{ backgroundColor: "var(--xp-silber-luna)" }}
          >
            <div
              className="xp-text-label mb-1"
              style={{ color: "var(--xp-border-dark)" }}
            >
              {stat.label}
            </div>
            <div
              className="text-xl font-bold"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div
        className="xp-inset p-3"
        style={{ backgroundColor: "#F1EFE2" }}
      >
        <div className="xp-text-heading mb-3">Schnellaktionen</div>
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
      <div className="mt-4">
        <div
          className="xp-inset p-2"
          style={{
            backgroundColor: "#FFFFFF",
            fontFamily: "Consolas, monospace",
            fontSize: "10px",
            color: "var(--xp-border-dark)",
          }}
        >
          <div>C:\gleggmire\admin&gt; status.bat</div>
          <div>System: gleggmire.net v1.0.0</div>
          <div>Admin-Modus: AKTIV</div>
          <div>Letzte Pruefung: {new Date().toLocaleString("de-DE")}</div>
          <div className="mt-1 text-[var(--xp-gruen)]">
            Alle Systeme nominal.
          </div>
        </div>
      </div>
    </XpWindow>
  );
}
