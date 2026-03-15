"use client";

import { useState, useEffect, useCallback } from "react";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  discord_username: string | null;
  contact_info: string | null;
  status: "pending" | "approved" | "rejected" | "done";
  admin_notes: string | null;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Ausstehend", color: "#F59E0B" },
  approved: { label: "Akzeptiert", color: "#22C55E" },
  rejected: { label: "Abgelehnt", color: "#EF4444" },
  done: { label: "Umgesetzt", color: "#2563eb" },
};

export function SuggestionsManager() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/suggestions?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const updateStatus = async (id: string, newStatus: string, notes?: string) => {
    try {
      const res = await fetch("/api/admin/suggestions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus, admin_notes: notes }),
      });
      if (res.ok) {
        fetchSuggestions();
      }
    } catch (err) {
      console.error("Failed to update suggestion:", err);
    }
  };

  return (
    <XpWindow title="Feature-Vorschlaege">
      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["pending", "approved", "rejected", "done"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors"
            style={{
              backgroundColor: filter === s ? STATUS_LABELS[s].color : "var(--color-bg)",
              color: filter === s ? "#fff" : "var(--color-text-muted)",
              border: `1px solid ${filter === s ? STATUS_LABELS[s].color : "var(--color-border)"}`,
            }}
          >
            {STATUS_LABELS[s].label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          Laden...
        </p>
      ) : suggestions.length === 0 ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          Keine Vorschlaege mit Status &quot;{STATUS_LABELS[filter]?.label}&quot;.
        </p>
      ) : (
        <div className="space-y-3">
          {suggestions.map((s) => (
            <div
              key={s.id}
              className="rounded-lg p-4"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                  {s.title}
                </h4>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: STATUS_LABELS[s.status].color,
                    color: "#fff",
                  }}
                >
                  {STATUS_LABELS[s.status].label}
                </span>
              </div>

              <p className="mb-2 text-xs whitespace-pre-wrap" style={{ color: "var(--color-text-muted)" }}>
                {s.description}
              </p>

              <div className="mb-3 flex flex-wrap gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                {s.discord_username && <span>Discord: <strong>{s.discord_username}</strong></span>}
                {s.contact_info && <span>Kontakt: <strong>{s.contact_info}</strong></span>}
                <span>{new Date(s.created_at).toLocaleDateString("de-DE")}</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {s.status === "pending" && (
                  <>
                    <XpButton variant="primary" onClick={() => updateStatus(s.id, "approved")}>
                      Akzeptieren
                    </XpButton>
                    <XpButton variant="danger" onClick={() => updateStatus(s.id, "rejected")}>
                      Ablehnen
                    </XpButton>
                  </>
                )}
                {s.status === "approved" && (
                  <XpButton onClick={() => updateStatus(s.id, "done")}>
                    Als umgesetzt markieren
                  </XpButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </XpWindow>
  );
}
