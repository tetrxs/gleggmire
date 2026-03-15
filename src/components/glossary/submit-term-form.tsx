"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { XpButton } from "@/components/ui/xp-button";
import { XpDialog } from "@/components/ui/xp-dialog";
import { TagSelect } from "@/components/glossary/tag-select";
import { FuzzyMatchAlert } from "@/components/glossary/fuzzy-match-alert";
import { findMatches, normalizeTerm, type TermMatch } from "@/lib/utils/normalize";
import type { TermMatchCandidate } from "@/lib/data/glossary";

const WORD_TYPES = [
  "Verb",
  "Substantiv",
  "Adjektiv",
  "Ausruf",
  "Phrase",
  "Sonstiges",
] as const;

const STORAGE_KEY = "gleggmire-submit-draft";

interface FormData {
  begriff: string;
  definition: string;
  beispielsatz: string;
  tags: string[];
  phonetik: string;
  wortart: string;
  herkunft: string;
}

const EMPTY_FORM: FormData = {
  begriff: "",
  definition: "",
  beispielsatz: "",
  tags: [],
  phonetik: "",
  wortart: "",
  herkunft: "",
};

interface SubmitTermFormProps {
  existingTerms: TermMatchCandidate[];
  onSuccess?: () => void;
}

export function SubmitTermForm({ existingTerms: rawTerms, onSuccess }: SubmitTermFormProps) {
  // Transform TermMatchCandidate[] into the shape findMatches expects
  const existingTerms = rawTerms.map((t) => ({
    id: t.id,
    term: t.term,
    slug: t.slug,
    normalized: normalizeTerm(t.term),
    aliases: t.aliases.map((a) => a.alias),
  }));
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [matches, setMatches] = useState<TermMatch[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: "error" | "warning" | "info";
    title: string;
    message: string;
  }>({ open: false, type: "info", title: "", message: "" });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const formRef = useRef<FormData>(form);

  formRef.current = form;

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>;
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Auto-save to localStorage every 10 seconds
  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formRef.current));
      } catch {
        // storage full or unavailable
      }
    }, 10_000);

    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    };
  }, []);

  // Debounced fuzzy matching on term input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (form.begriff.trim().length < 3) {
      setMatches([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const results = findMatches(form.begriff, existingTerms);
      setMatches(results);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form.begriff, existingTerms]);

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      // Clear error for this field
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      const newErrors: Record<string, string> = {};
      if (!form.begriff.trim()) newErrors.begriff = "Bitte gib einen Begriff ein.";
      if (!form.definition.trim()) newErrors.definition = "Bitte gib eine Definition ein.";
      if (!form.beispielsatz.trim()) newErrors.beispielsatz = "Bitte gib einen Beispielsatz ein.";
      if (form.tags.length === 0) newErrors.tags = "Bitte wähle mindestens eine Kategorie aus.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Check for exact match blocking
      const hasExact = matches.some((m) => m.matchType === "exact");
      if (hasExact) {
        setDialog({
          open: true,
          type: "error",
          title: "Fehler",
          message: "Dieser Begriff existiert bereits. Bitte wechsle zum bestehenden Eintrag.",
        });
        return;
      }

      // Show success dialog
      setDialog({
        open: true,
        type: "info",
        title: "Erfolg",
        message:
          "Dein Begriff wurde erfolgreich eingereicht und wird von der Community geprüft. Vielen Dank für deinen Beitrag!",
      });

      // Clear draft
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }

      setForm(EMPTY_FORM);
      setMatches([]);
      setErrors({});
    },
    [form, matches]
  );

  const handleNavigate = useCallback(
    (slug: string) => {
      router.push(`/glossar/${slug}`);
    },
    [router]
  );

  const handleSubmitAnyway = useCallback(() => {
    setMatches([]);
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border p-6 sm:p-8 space-y-6"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        {/* Begriff */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Begriff <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.begriff}
            onChange={(e) => updateField("begriff", e.target.value)}
            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: errors.begriff ? "#EF4444" : "var(--color-border)",
              backgroundColor: "var(--color-bg)",
            }}
            placeholder="z.B. Geglaggmirt"
          />
          {errors.begriff && (
            <p className="text-xs text-red-500">{errors.begriff}</p>
          )}
        </div>

        {/* Fuzzy match results */}
        {matches.length > 0 && (
          <FuzzyMatchAlert
            matches={matches}
            onNavigate={handleNavigate}
            onSubmitAnyway={handleSubmitAnyway}
          />
        )}

        {/* Definition */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Definition <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.definition}
            onChange={(e) => updateField("definition", e.target.value)}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: errors.definition ? "#EF4444" : "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              minHeight: "100px",
            }}
            placeholder="Was bedeutet dieser Begriff?"
          />
          {errors.definition && (
            <p className="text-xs text-red-500">{errors.definition}</p>
          )}
        </div>

        {/* Beispielsatz */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Beispielsatz <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.beispielsatz}
            onChange={(e) => updateField("beispielsatz", e.target.value)}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: errors.beispielsatz ? "#EF4444" : "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              minHeight: "80px",
            }}
            placeholder="z.B. 'Der wurde richtig gegläggmirt gestern'"
          />
          {errors.beispielsatz && (
            <p className="text-xs text-red-500">{errors.beispielsatz}</p>
          )}
        </div>

        {/* Kategorie-Tags */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Kategorie-Tags <span className="text-red-500">*</span>
          </label>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            Wähle mindestens eine Kategorie aus:
          </p>
          <TagSelect
            selectedTags={form.tags}
            onChange={(tags) => updateField("tags", tags)}
          />
          {errors.tags && (
            <p className="text-xs text-red-500">{errors.tags}</p>
          )}
        </div>

        {/* Separator */}
        <div
          className="border-t"
          style={{ borderColor: "var(--color-border)" }}
        />

        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          Optionale Felder — helfen bei der Einordnung:
        </p>

        {/* Phonetik (IPA) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Phonetik (IPA)
          </label>
          <input
            type="text"
            value={form.phonetik}
            onChange={(e) => updateField("phonetik", e.target.value)}
            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
            }}
            placeholder="/gɛˈglɛgmɪʁt/"
          />
        </div>

        {/* Wortart */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Wortart
          </label>
          <select
            value={form.wortart}
            onChange={(e) => updateField("wortart", e.target.value)}
            className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
            }}
          >
            <option value="">— Bitte wählen —</option>
            {WORD_TYPES.map((wt) => (
              <option key={wt} value={wt}>
                {wt}
              </option>
            ))}
          </select>
        </div>

        {/* Herkunft/Kontext */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium">
            Herkunft / Kontext
          </label>
          <textarea
            value={form.herkunft}
            onChange={(e) => updateField("herkunft", e.target.value)}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              minHeight: "80px",
            }}
            placeholder="Woher stammt der Begriff? In welchem Stream/Video kam er erstmals vor?"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px]" style={{ color: "var(--color-muted)" }}>
            Entwurf wird automatisch gespeichert.
          </p>
          <XpButton variant="primary" type="submit">
            Begriff einreichen
          </XpButton>
        </div>
      </form>

      {/* Dialog for errors/success */}
      <XpDialog
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        open={dialog.open}
        onClose={() => {
          const wasSuccess = dialog.type === "info" && dialog.title === "Erfolg";
          setDialog((prev) => ({ ...prev, open: false }));
          if (wasSuccess && onSuccess) onSuccess();
        }}
      />
    </>
  );
}
