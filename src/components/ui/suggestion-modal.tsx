"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";

export function SuggestionModal() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discord, setDiscord] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-suggestion-modal", handler);
    return () => window.removeEventListener("open-suggestion-modal", handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    setSubmitted(false);
    setError("");
    setTitle("");
    setDescription("");
    setDiscord("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, discord_username: discord }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Fehler beim Senden");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Netzwerkfehler – bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Funktion vorschlagen">
      {submitted ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span style={{ fontSize: "2rem" }}>&#x2705;</span>
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Danke! Dein Vorschlag wurde eingereicht. Wir schauen ihn uns an.
          </p>
          <button onClick={handleClose} className="btn-filled text-xs">
            SCHLIESSEN
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--color-text-muted)" }}
            >
              Titel <span style={{ color: "var(--color-accent)" }}>*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Dunkelmodus fuer Glossar-Karten"
              maxLength={100}
              required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1.5px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--color-text-muted)" }}
            >
              Beschreibung <span style={{ color: "var(--color-accent)" }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Erklaere deine Idee genauer..."
              maxLength={2000}
              rows={4}
              required
              className="w-full resize-none rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1.5px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
            <span className="text-right text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              {description.length}/2000
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--color-text-muted)" }}
            >
              Discord (optional)
            </label>
            <input
              type="text"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="deinname"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1.5px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
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

          <button type="submit" disabled={loading} className="btn-filled text-xs">
            {loading ? "SENDEN..." : "VORSCHLAG EINREICHEN"}
          </button>
        </form>
      )}
    </Modal>
  );
}
