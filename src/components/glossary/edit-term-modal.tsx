"use client";

import { useState, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { XpButton } from "@/components/ui/xp-button";
import type { GlossaryTerm } from "@/types/database";

interface EditTermModalProps {
  open: boolean;
  onClose: () => void;
  term: GlossaryTerm;
  onSaved: () => void;
}

export function EditTermModal({ open, onClose, term, onSaved }: EditTermModalProps) {
  const [termName, setTermName] = useState(term.term);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termName.trim()) {
      setError("Bitte gib einen Begriff ein.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/terms/${term.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: termName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Unbekannter Fehler" }));
        if (res.status === 401) {
          setError("Bitte einloggen um Begriffe zu bearbeiten.");
        } else if (res.status === 403) {
          setError("Du hast keine Berechtigung diesen Begriff zu bearbeiten.");
        } else {
          setError(data.error ?? "Fehler beim Speichern.");
        }
        setSubmitting(false);
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen.");
    }
    setSubmitting(false);
  }, [termName, term.slug, onSaved, onClose]);

  return (
    <Modal open={open} onClose={onClose} title="Begriff bearbeiten">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium" style={{ color: "var(--color-text)" }}>
            Begriff <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={termName}
            onChange={(e) => { setTermName(e.target.value); setError(null); }}
            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
          />
        </div>

        {error && (
          <p
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              color: "var(--color-accent)",
              border: "1px solid var(--color-accent)",
              backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
            }}
          >
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <XpButton onClick={onClose} disabled={submitting}>Abbrechen</XpButton>
          <XpButton variant="primary" type="submit" disabled={submitting}>
            {submitting ? "Wird gespeichert..." : "Speichern"}
          </XpButton>
        </div>
      </form>
    </Modal>
  );
}
