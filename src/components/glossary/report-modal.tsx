"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { XpButton } from "@/components/ui/xp-button";
import type { TermDefinition } from "@/types/database";
import type { CommentWithMeta } from "@/lib/data/comments";

const REPORT_REASONS = [
  { value: "hate_speech", label: "Hassrede" },
  { value: "racism", label: "Rassismus" },
  { value: "sexual_content", label: "Sexuelle Inhalte" },
  { value: "harassment", label: "Belaestigung" },
  { value: "spam", label: "Spam" },
  { value: "misinformation", label: "Falschinformation" },
  { value: "personal_info", label: "Persoenliche Daten" },
  { value: "other", label: "Sonstiges" },
];

type ReportCategory = "term" | "definition" | "comment";

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  termId: string;
  termName: string;
  definitions: TermDefinition[];
  comments: CommentWithMeta[];
}

export function ReportModal({
  open,
  onClose,
  termId,
  termName,
  definitions,
  comments,
}: ReportModalProps) {
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Flatten comment replies into a single list
  const allComments = useMemo(() => {
    const flat: CommentWithMeta[] = [];
    function collect(list: CommentWithMeta[]) {
      for (const c of list) {
        flat.push(c);
        if (c.replies) collect(c.replies);
      }
    }
    collect(comments);
    return flat;
  }, [comments]);

  // Filtered definitions/comments based on search
  const filteredDefinitions = useMemo(() => {
    if (!search.trim()) return definitions;
    const q = search.toLowerCase();
    return definitions.filter((d) => d.definition.toLowerCase().includes(q));
  }, [definitions, search]);

  const filteredComments = useMemo(() => {
    if (!search.trim()) return allComments;
    const q = search.toLowerCase();
    return allComments.filter(
      (c) =>
        (c.text && c.text.toLowerCase().includes(q)) ||
        (c.username && c.username.toLowerCase().includes(q))
    );
  }, [allComments, search]);

  // Current step based on state
  const step = !category
    ? "category"
    : category === "term"
      ? !reason
        ? "reason"
        : "description"
      : !selectedEntityId
        ? "select"
        : !reason
          ? "reason"
          : "description";

  function reset() {
    setCategory(null);
    setSelectedEntityId(null);
    setSearch("");
    setReason(null);
    setDescription("");
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleBack() {
    setError(null);
    if (step === "description") {
      setReason(null);
      setDescription("");
    } else if (step === "reason") {
      if (category !== "term") {
        setSelectedEntityId(null);
        setSearch("");
      } else {
        setCategory(null);
      }
    } else if (step === "select") {
      setCategory(null);
      setSearch("");
    }
  }

  async function handleSubmit() {
    if (!category || !reason) return;

    const entityType = category;
    const entityId =
      category === "term" ? termId : selectedEntityId;

    if (!entityId) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: entityType,
          entity_id: entityId,
          reason,
          description: description.trim() || null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json().catch(() => ({ error: "Fehler" }));
        if (res.status === 401) {
          setError("Bitte einloggen um Inhalte zu melden.");
        } else if (res.status === 409) {
          setError("Du hast diesen Inhalt bereits gemeldet.");
        } else {
          setError(data.error ?? "Fehler beim Senden der Meldung");
        }
      }
    } catch {
      setError("Netzwerkfehler — bitte erneut versuchen.");
    }
    setSubmitting(false);
  }

  if (!open) return null;

  const stepTitles: Record<string, string> = {
    category: "Was moechtest du melden?",
    select:
      category === "definition"
        ? "Welche Definition?"
        : "Welchen Kommentar?",
    reason: "Grund der Meldung",
    description: "Zusaetzliche Details",
  };

  return (
    <Modal open={open} onClose={handleClose} maxWidth="md" title="Inhalt melden">
      <div className="p-6">
        {success ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">&#10003;</div>
            <h3
              className="text-lg font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Danke fuer deine Meldung!
            </h3>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Wir werden den gemeldeten Inhalt pruefen.
            </p>
            <div className="mt-4">
              <XpButton onClick={handleClose}>Schliessen</XpButton>
            </div>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-5">
              {["category", ...(category && category !== "term" ? ["select"] : []), "reason", "description"].map(
                (s, i, arr) => (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full transition-colors ${
                        arr.indexOf(step) >= i
                          ? "bg-[var(--color-accent)]"
                          : "bg-[var(--color-border)]"
                      }`}
                    />
                    {i < arr.length - 1 && (
                      <div
                        className="h-px w-4"
                        style={{ backgroundColor: "var(--color-border)" }}
                      />
                    )}
                  </div>
                )
              )}
            </div>

            <h3
              className="text-lg font-bold mb-4"
              style={{ color: "var(--color-text)" }}
            >
              {stepTitles[step]}
            </h3>

            {/* Step: Category */}
            {step === "category" && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setCategory("term")}
                  className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3 text-left text-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
                >
                  <span className="text-lg">&#128209;</span>
                  <div>
                    <div className="font-medium" style={{ color: "var(--color-text)" }}>
                      Begriff
                    </div>
                    <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      &quot;{termName}&quot; melden
                    </div>
                  </div>
                </button>

                {definitions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCategory("definition")}
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3 text-left text-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
                  >
                    <span className="text-lg">&#128221;</span>
                    <div>
                      <div className="font-medium" style={{ color: "var(--color-text)" }}>
                        Definition
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {definitions.length} Definition{definitions.length !== 1 ? "en" : ""} verfuegbar
                      </div>
                    </div>
                  </button>
                )}

                {allComments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCategory("comment")}
                    className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] px-4 py-3 text-left text-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
                  >
                    <span className="text-lg">&#128172;</span>
                    <div>
                      <div className="font-medium" style={{ color: "var(--color-text)" }}>
                        Kommentar
                      </div>
                      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {allComments.length} Kommentar{allComments.length !== 1 ? "e" : ""} verfuegbar
                      </div>
                    </div>
                  </button>
                )}
              </div>
            )}

            {/* Step: Select definition or comment */}
            {step === "select" && (
              <div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Suchen..."
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] mb-3 focus:outline-none focus:ring-2 focus:ring-[#E8593C]"
                />

                <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5">
                  {category === "definition" && (
                    <>
                      {filteredDefinitions.length === 0 ? (
                        <p className="text-sm py-2 text-center" style={{ color: "var(--color-text-muted)" }}>
                          Keine Definitionen gefunden
                        </p>
                      ) : (
                        filteredDefinitions.map((d, i) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setSelectedEntityId(d.id)}
                            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
                          >
                            <span className="font-medium" style={{ color: "var(--color-text)" }}>
                              #{definitions.indexOf(d) + 1}
                            </span>
                            <span className="ml-2" style={{ color: "var(--color-text-muted)" }}>
                              {d.definition.length > 80
                                ? d.definition.slice(0, 80) + "..."
                                : d.definition}
                            </span>
                          </button>
                        ))
                      )}
                    </>
                  )}

                  {category === "comment" && (
                    <>
                      {filteredComments.length === 0 ? (
                        <p className="text-sm py-2 text-center" style={{ color: "var(--color-text-muted)" }}>
                          Keine Kommentare gefunden
                        </p>
                      ) : (
                        filteredComments.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedEntityId(c.id)}
                            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-left text-sm transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
                          >
                            <span className="font-medium" style={{ color: "var(--color-text)" }}>
                              {c.username ?? "Anonym"}
                            </span>
                            <span className="ml-2" style={{ color: "var(--color-text-muted)" }}>
                              {c.text
                                ? c.text.length > 70
                                  ? c.text.slice(0, 70) + "..."
                                  : c.text
                                : c.attachment_type
                                  ? "[" + c.attachment_type + "]"
                                  : "[kein Text]"}
                            </span>
                          </button>
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Step: Reason */}
            {step === "reason" && (
              <div className="flex flex-col gap-1.5">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                      reason === r.value
                        ? "bg-[var(--color-accent)]/10 border border-[var(--color-accent)]"
                        : "border border-[var(--color-border)] hover:border-[var(--color-text-muted)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="accent-[#E8593C]"
                    />
                    <span style={{ color: "var(--color-text)" }}>
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Step: Description */}
            {step === "description" && (
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreibe das Problem genauer... (optional)"
                  rows={3}
                  maxLength={1000}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[#E8593C]"
                />
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-5">
              <div>
                {step !== "category" && (
                  <XpButton onClick={handleBack}>Zurueck</XpButton>
                )}
              </div>
              <div className="flex gap-2">
                <XpButton onClick={handleClose}>Abbrechen</XpButton>
                {step === "description" && (
                  <XpButton
                    variant="danger"
                    disabled={submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Wird gesendet..." : "Melden"}
                  </XpButton>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
