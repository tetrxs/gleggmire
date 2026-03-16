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
  created_at: string;
}

const PAGE_SIZE = 10;

export function SuggestionsManager() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/suggestions?offset=${page * PAGE_SIZE}&limit=${PAGE_SIZE}`);
      if (res.ok) {
        const data = await res.json();
        const items = data.suggestions ?? [];
        setSuggestions(items);
        setHasMore(items.length === PAGE_SIZE);
      } else {
        setSuggestions([]);
        if (res.status === 500) {
          setError("Tabelle 'feature_suggestions' existiert noch nicht oder ist nicht erreichbar. Bitte Migration ausfuehren.");
        }
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      setSuggestions([]);
      setError("Verbindungsfehler beim Laden der Vorschlaege.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/admin/suggestions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSuggestions((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete suggestion:", err);
    }
    setDeleteConfirm(null);
  };

  return (
    <XpWindow title="Feature-Vorschlaege">
      {error && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-800">{error}</p>
        </div>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          Laden...
        </p>
      ) : suggestions.length === 0 && !error ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          Keine Vorschlaege vorhanden.
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
                <span className="shrink-0 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {new Date(s.created_at).toLocaleDateString("de-DE")}
                </span>
              </div>

              <p className="mb-2 text-xs whitespace-pre-wrap" style={{ color: "var(--color-text-muted)" }}>
                {s.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {s.discord_username && <span>Discord: <strong>{s.discord_username}</strong></span>}
                  {s.contact_info && <span>Kontakt: <strong>{s.contact_info}</strong></span>}
                </div>
                <XpButton variant="danger" onClick={() => setDeleteConfirm(s.id)}>
                  Loeschen
                </XpButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (suggestions.length > 0 || page > 0) && (
        <div className="mt-4 flex items-center justify-between">
          <XpButton disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Zurueck
          </XpButton>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Seite {page + 1}
          </span>
          <XpButton disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
            Weiter
          </XpButton>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="card w-[400px] max-w-[90vw] p-6 shadow-lg" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <h4 className="text-base font-semibold mb-2">Vorschlag loeschen</h4>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Diesen Feature-Vorschlag wirklich loeschen?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <XpButton onClick={() => setDeleteConfirm(null)}>Abbrechen</XpButton>
              <XpButton variant="danger" onClick={() => handleDelete(deleteConfirm)}>Ja, loeschen</XpButton>
            </div>
          </div>
        </div>
      )}
    </XpWindow>
  );
}
