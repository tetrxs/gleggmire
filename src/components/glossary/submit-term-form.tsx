"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { XpWindow } from "@/components/ui/xp-window";
import { XpButton } from "@/components/ui/xp-button";
import { XpDialog } from "@/components/ui/xp-dialog";
import { TagSelect } from "@/components/glossary/tag-select";
import { FuzzyMatchAlert } from "@/components/glossary/fuzzy-match-alert";
import { findMatches, type TermMatch } from "@/lib/utils/normalize";
import type { ExistingTerm } from "@/lib/mock-data";

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
  existingTerms: ExistingTerm[];
}

export function SubmitTermForm({ existingTerms }: SubmitTermFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [matches, setMatches] = useState<TermMatch[]>([]);
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: "error" | "warning" | "info";
    title: string;
    message: string;
  }>({ open: false, type: "info", title: "", message: "" });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const formRef = useRef<FormData>(form);

  // Keep ref in sync
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
    },
    []
  );

  const showError = useCallback((message: string) => {
    setDialog({
      open: true,
      type: "error",
      title: "Fehler",
      message,
    });
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validation
      if (!form.begriff.trim()) {
        showError("Bitte gib einen Begriff ein.");
        return;
      }
      if (!form.definition.trim()) {
        showError("Bitte gib eine Definition ein.");
        return;
      }
      if (!form.beispielsatz.trim()) {
        showError("Bitte gib einen Beispielsatz ein.");
        return;
      }
      if (form.tags.length === 0) {
        showError("Bitte wähle mindestens eine Kategorie aus.");
        return;
      }

      // Check for exact match blocking
      const hasExact = matches.some((m) => m.matchType === "exact");
      if (hasExact) {
        showError(
          "Dieser Begriff existiert bereits. Bitte wechsle zum bestehenden Eintrag."
        );
        return;
      }

      // Show success dialog (placeholder)
      setDialog({
        open: true,
        type: "info",
        title: "Erfolg",
        message:
          'Dein Begriff wurde erfolgreich eingereicht und wird von der Community geprüft. Vielen Dank für deinen Beitrag!',
      });

      // Clear draft
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }

      setForm(EMPTY_FORM);
      setMatches([]);
    },
    [form, matches, showError]
  );

  const handleNavigate = useCallback(
    (slug: string) => {
      router.push(`/glossar/${slug}`);
    },
    [router]
  );

  const handleSubmitAnyway = useCallback(() => {
    // Clear matches to allow submission
    setMatches([]);
  }, []);

  return (
    <>
      <XpWindow title="📝 Neuen Begriff einreichen — submit.exe">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Begriff */}
          <fieldset>
            <label className="xp-text-label mb-1 block font-bold">
              Begriff{" "}
              <span style={{ color: "var(--xp-fehler-rot)" }}>*</span>
            </label>
            <input
              type="text"
              value={form.begriff}
              onChange={(e) => updateField("begriff", e.target.value)}
              className="xp-inset w-full p-2 text-[12px]"
              style={{
                backgroundColor: "#FFFFFF",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
              placeholder="z.B. Geglaggmirt"
              required
            />
          </fieldset>

          {/* Fuzzy match results */}
          {matches.length > 0 && (
            <FuzzyMatchAlert
              matches={matches}
              onNavigate={handleNavigate}
              onSubmitAnyway={handleSubmitAnyway}
            />
          )}

          {/* Definition */}
          <fieldset>
            <label className="xp-text-label mb-1 block font-bold">
              Definition{" "}
              <span style={{ color: "var(--xp-fehler-rot)" }}>*</span>
            </label>
            <textarea
              value={form.definition}
              onChange={(e) => updateField("definition", e.target.value)}
              className="xp-inset w-full resize-none p-2 text-[12px]"
              style={{
                backgroundColor: "#FFFFFF",
                fontFamily: "Tahoma, Verdana, sans-serif",
                minHeight: "80px",
              }}
              placeholder="Was bedeutet dieser Begriff?"
              required
            />
          </fieldset>

          {/* Beispielsatz */}
          <fieldset>
            <label className="xp-text-label mb-1 block font-bold">
              Beispielsatz{" "}
              <span style={{ color: "var(--xp-fehler-rot)" }}>*</span>
            </label>
            <textarea
              value={form.beispielsatz}
              onChange={(e) => updateField("beispielsatz", e.target.value)}
              className="xp-inset w-full resize-none p-2 text-[12px]"
              style={{
                backgroundColor: "#FFFFFF",
                fontFamily: "Tahoma, Verdana, sans-serif",
                minHeight: "60px",
              }}
              placeholder="z.B. 'Der wurde richtig gegläggmirt gestern'"
              required
            />
          </fieldset>

          {/* Kategorie-Tags */}
          <fieldset>
            <label className="xp-text-label mb-1 block font-bold">
              Kategorie-Tags{" "}
              <span style={{ color: "var(--xp-fehler-rot)" }}>*</span>
            </label>
            <p
              className="mb-2 text-[11px]"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Wähle mindestens eine Kategorie aus:
            </p>
            <TagSelect
              selectedTags={form.tags}
              onChange={(tags) => updateField("tags", tags)}
            />
          </fieldset>

          {/* Separator */}
          <hr
            className="my-1"
            style={{ borderColor: "var(--xp-border-dark)" }}
          />

          <p
            className="text-[11px] italic"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Optionale Felder — helfen bei der Einordnung:
          </p>

          {/* Phonetik (IPA) */}
          <fieldset>
            <label className="xp-text-label mb-1 block font-bold">
              Phonetik (IPA)
            </label>
            <input
              type="text"
              value={form.phonetik}
              onChange={(e) => updateField("phonetik", e.target.value)}
              className="xp-inset w-full p-2 text-[12px]"
              style={{
                backgroundColor: "#FFFFFF",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
              placeholder="/gɛˈglɛgmɪʁt/"
            />
          </fieldset>

          {/* Wortart */}
          <fieldset>
            <label className="xp-text-label mb-1 block font-bold">
              Wortart
            </label>
            <select
              value={form.wortart}
              onChange={(e) => updateField("wortart", e.target.value)}
              className="xp-inset w-full p-2 text-[12px]"
              style={{
                backgroundColor: "#FFFFFF",
                fontFamily: "Tahoma, Verdana, sans-serif",
              }}
            >
              <option value="">— Bitte wählen —</option>
              {WORD_TYPES.map((wt) => (
                <option key={wt} value={wt}>
                  {wt}
                </option>
              ))}
            </select>
          </fieldset>

          {/* Herkunft/Kontext */}
          <fieldset>
            <label className="xp-text-label mb-1 block font-bold">
              Herkunft / Kontext
            </label>
            <textarea
              value={form.herkunft}
              onChange={(e) => updateField("herkunft", e.target.value)}
              className="xp-inset w-full resize-none p-2 text-[12px]"
              style={{
                backgroundColor: "#FFFFFF",
                fontFamily: "Tahoma, Verdana, sans-serif",
                minHeight: "60px",
              }}
              placeholder="Woher stammt der Begriff? In welchem Stream/Video kam er erstmals vor?"
            />
          </fieldset>

          {/* Submit */}
          <div className="mt-2 flex items-center justify-between">
            <p
              className="text-[10px]"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Entwurf wird automatisch gespeichert.
            </p>
            <XpButton variant="primary" type="submit">
              🚀 Begriff einreichen
            </XpButton>
          </div>
        </form>
      </XpWindow>

      {/* Dialog for errors/success */}
      <XpDialog
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        open={dialog.open}
        onClose={() => setDialog((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
