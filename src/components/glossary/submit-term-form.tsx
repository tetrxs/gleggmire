"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth, redirectToLogin } from "@/lib/hooks/use-auth";
import { useRouter } from "next/navigation";
import { XpButton } from "@/components/ui/xp-button";
import { TagSelect } from "@/components/glossary/tag-select";
import { FuzzyMatchAlert } from "@/components/glossary/fuzzy-match-alert";
import { AttachmentPicker, type AttachmentData } from "@/components/comments/attachment-picker";
import { findMatches, normalizeTerm, type TermMatch } from "@/lib/utils/normalize";
import { stripTimestamp } from "@/lib/youtube-api";
import type { TermMatchCandidate } from "@/lib/data/glossary";

const STORAGE_KEY = "gleggmire-submit-draft";

type SourceType = "youtube" | "twitch" | "image" | "gif" | "other";

const SOURCE_OPTIONS: { value: SourceType; label: string }[] = [
  { value: "youtube", label: "YouTube-Video" },
  { value: "twitch", label: "Twitch-Clip" },
  { value: "image", label: "Bild hochladen" },
  { value: "gif", label: "GIF hochladen" },
  { value: "other", label: "Andere" },
];

interface FormData {
  begriff: string;
  definition: string;
  beispielsatz: string;
  tags: string[];
  sourceType: SourceType | "";
  sourceText: string;
}

const EMPTY_FORM: FormData = {
  begriff: "",
  definition: "",
  beispielsatz: "",
  tags: [],
  sourceType: "",
  sourceText: "",
};

interface SubmitTermFormProps {
  existingTerms: TermMatchCandidate[];
  onSuccess?: () => void;
}

export function SubmitTermForm({ existingTerms: rawTerms, onSuccess }: SubmitTermFormProps) {
  const { user } = useAuth();
  const existingTerms = useMemo(() => rawTerms.map((t) => ({
    id: t.id,
    term: t.term,
    slug: t.slug,
    normalized: normalizeTerm(t.term),
    aliases: t.aliases.map((a) => a.alias),
  })), [rawTerms]);
  const router = useRouter();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [matches, setMatches] = useState<TermMatch[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const formRef = useRef<FormData>(form);

  formRef.current = form;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>;
        setForm((prev) => ({ ...prev, ...parsed }));
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    autoSaveRef.current = setInterval(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formRef.current));
      } catch { /* ignore */ }
    }, 10_000);
    return () => { if (autoSaveRef.current) clearInterval(autoSaveRef.current); };
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (form.begriff.trim().length < 3) { setMatches([]); return; }
    debounceRef.current = setTimeout(() => {
      const results = findMatches(form.begriff, existingTerms);
      setMatches(results);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [form.begriff, existingTerms]);

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
    },
    []
  );

  function handleSourceTypeChange(value: string) {
    const st = value as SourceType | "";
    updateField("sourceType", st);
    setAttachment(null);
    setShowPicker(false);
    if (st === "youtube" || st === "twitch" || st === "image" || st === "gif") {
      setShowPicker(true);
    }
  }

  function handleAttach(data: AttachmentData) {
    setAttachment(data);
    setShowPicker(false);
    if (data.type === "youtube" || data.type === "twitch") {
      updateField("sourceText", data.url);
    } else {
      updateField("sourceText", data.file?.name ?? "Bild/GIF");
    }
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) { redirectToLogin(); return; }
      const newErrors: Record<string, string> = {};
      if (!form.begriff.trim()) newErrors.begriff = "Bitte gib einen Begriff ein.";
      if (!form.definition.trim()) newErrors.definition = "Bitte gib eine Definition ein.";
      if (!form.beispielsatz.trim()) newErrors.beispielsatz = "Bitte gib einen Beispielsatz ein.";
      if (form.tags.length === 0) newErrors.tags = "Bitte waehle mindestens eine Kategorie aus.";

      if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

      const hasExact = matches.some((m) => m.matchType === "exact");
      if (hasExact) {
        setSubmitError("Dieser Begriff existiert bereits. Bitte wechsle zum bestehenden Eintrag.");
        return;
      }

      setSubmitting(true);
      setSubmitError("");

      // Build origin_context from source — encode startSeconds as &t= for YouTube
      let originContext: string | undefined;
      if (form.sourceType === "other" && form.sourceText.trim()) {
        originContext = form.sourceText.trim();
      } else if (attachment) {
        let url = stripTimestamp(attachment.url);
        if (attachment.type === "youtube" && attachment.startSeconds && attachment.startSeconds > 0) {
          const sep = url.includes("?") ? "&" : "?";
          url = `${url}${sep}t=${attachment.startSeconds}`;
        }
        originContext = url;
      }

      try {
        const res = await fetch("/api/v1/terms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            term: form.begriff.trim(),
            definition: form.definition.trim(),
            example_sentence: form.beispielsatz.trim(),
            origin_context: originContext,
            tags: form.tags,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setSubmitError(data.error || "Ein Fehler ist aufgetreten.");
          setSubmitting(false);
          return;
        }

        const newTerm = await res.json();
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
        setForm(EMPTY_FORM);
        setAttachment(null);
        setMatches([]);
        setErrors({});
        setSubmitError("");

        // Redirect directly to the new term page
        if (onSuccess) onSuccess();
        router.push(`/glossar/${newTerm.slug}`);
        return;
      } catch {
        setSubmitError("Netzwerkfehler. Bitte versuche es spaeter erneut.");
      } finally {
        setSubmitting(false);
      }
    },
    [form, matches, attachment]
  );

  const handleNavigate = useCallback((slug: string) => { router.push(`/glossar/${slug}`); }, [router]);
  const handleSubmitAnyway = useCallback(() => { setMatches([]); }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          style={{ borderColor: errors.begriff ? "#EF4444" : "var(--color-border)", backgroundColor: "var(--color-bg)" }}
          placeholder="z.B. Geglaggmirt"
        />
        {errors.begriff && <p className="text-xs text-red-500">{errors.begriff}</p>}
      </div>

      {/* Fuzzy match results */}
      {matches.length > 0 && (
        <FuzzyMatchAlert matches={matches} onNavigate={handleNavigate} onSubmitAnyway={handleSubmitAnyway} />
      )}

      {/* Kategorie-Tags */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">
          Kategorie-Tags <span className="text-red-500">*</span>
        </label>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          Waehle mindestens eine Kategorie aus:
        </p>
        <TagSelect selectedTags={form.tags} onChange={(tags) => updateField("tags", tags)} />
        {errors.tags && <p className="text-xs text-red-500">{errors.tags}</p>}
      </div>

      {/* Separator — Initiale Definition */}
      <div className="border-t" style={{ borderColor: "var(--color-border)" }} />

      <p className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
        Initiale Definition
      </p>

      {/* Definition */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">
          Definition <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.definition}
          onChange={(e) => updateField("definition", e.target.value)}
          className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          style={{ borderColor: errors.definition ? "#EF4444" : "var(--color-border)", backgroundColor: "var(--color-bg)", minHeight: "100px" }}
          placeholder="Was bedeutet dieser Begriff?"
        />
        {errors.definition && <p className="text-xs text-red-500">{errors.definition}</p>}
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
          style={{ borderColor: errors.beispielsatz ? "#EF4444" : "var(--color-border)", backgroundColor: "var(--color-bg)", minHeight: "80px" }}
          placeholder="z.B. 'Der wurde richtig geglaggmirt gestern'"
        />
        {errors.beispielsatz && <p className="text-xs text-red-500">{errors.beispielsatz}</p>}
      </div>

      {/* Herkunft / Quelle */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium">
          Herkunft / Quelle (optional)
        </label>
        <select
          value={form.sourceType}
          onChange={(e) => handleSourceTypeChange(e.target.value)}
          className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
        >
          <option value="">— Keine Quelle —</option>
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {showPicker && (form.sourceType === "youtube" || form.sourceType === "twitch" || form.sourceType === "image" || form.sourceType === "gif") && (
          <AttachmentPicker
            mode={form.sourceType}
            onAttach={handleAttach}
            onCancel={() => { setShowPicker(false); updateField("sourceType", ""); }}
          />
        )}

        {attachment && !showPicker && (
          <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3">
            {(attachment.type === "image" || attachment.type === "gif") && (
              <img src={attachment.url} alt="Quelle" className="h-12 w-12 rounded object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium" style={{ color: "var(--color-text)" }}>
                {attachment.title ?? attachment.url}
              </p>
              <p className="truncate text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                {attachment.type === "youtube" ? "YouTube" : attachment.type === "twitch" ? "Twitch" : "Datei"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setAttachment(null); setShowPicker(true); }}
              className="shrink-0 text-xs font-medium text-red-500 hover:underline"
            >
              Entfernen
            </button>
          </div>
        )}

        {form.sourceType === "other" && (
          <textarea
            value={form.sourceText}
            onChange={(e) => updateField("sourceText", e.target.value)}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)", minHeight: "60px" }}
            placeholder="Woher stammt der Begriff? (Stream, Video, Discord, etc.)"
          />
        )}
      </div>

      {/* Submit error */}
      {submitError && (
        <p className="rounded-lg px-3 py-2 text-xs" style={{ color: "var(--color-accent)", border: "1px solid var(--color-accent)", backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)" }}>
          {submitError}
        </p>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
          Entwurf wird automatisch gespeichert.
        </p>
        <XpButton variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Wird gesendet..." : "Begriff einreichen"}
        </XpButton>
      </div>
    </form>
  );
}
