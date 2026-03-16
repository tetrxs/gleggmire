"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth, redirectToLogin } from "@/lib/hooks/use-auth";
import { XpButton } from "@/components/ui/xp-button";
import { AttachmentPicker, type AttachmentData } from "@/components/comments/attachment-picker";

const STORAGE_KEY_PREFIX = "gleggmire-def-draft-";

type SourceType = "youtube" | "twitch" | "image" | "gif" | "other";

interface SavedAttachment {
  type: "youtube" | "twitch";
  url: string;
  startSeconds?: number;
  title?: string;
}

interface FormData {
  definition: string;
  beispielsatz: string;
  sourceType: SourceType | "";
  sourceText: string;
  savedAttachment?: SavedAttachment | null;
}

const EMPTY_FORM: FormData = {
  definition: "",
  beispielsatz: "",
  sourceType: "",
  sourceText: "",
  savedAttachment: null,
};

const SOURCE_OPTIONS: { value: SourceType; label: string }[] = [
  { value: "youtube", label: "YouTube-Video" },
  { value: "twitch", label: "Twitch-Clip" },
  { value: "image", label: "Bild hochladen" },
  { value: "gif", label: "GIF hochladen" },
  { value: "other", label: "Andere" },
];

interface SubmitDefinitionFormProps {
  termSlug: string;
  onSuccess?: () => void;
}

export function SubmitDefinitionForm({ termSlug, onSuccess }: SubmitDefinitionFormProps) {
  const { user } = useAuth();
  const storageKey = STORAGE_KEY_PREFIX + termSlug;

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const formRef = useRef<FormData>(form);
  formRef.current = form;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<FormData>;
        setForm((prev) => ({ ...prev, ...parsed }));
        // Restore attachment from saved draft
        if (parsed.savedAttachment) {
          setAttachment(parsed.savedAttachment as AttachmentData);
        }
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(formRef.current));
      } catch {
        // storage full
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [storageKey]);

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
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
    // Build a descriptive source text from the attachment
    if (data.type === "youtube" || data.type === "twitch") {
      updateField("sourceText", data.url);
      // Persist serializable attachment data for draft recovery
      setForm((prev) => ({
        ...prev,
        sourceText: data.url,
        savedAttachment: {
          type: data.type as "youtube" | "twitch",
          url: data.url,
          startSeconds: data.startSeconds,
          title: data.title,
        },
      }));
    } else {
      updateField("sourceText", data.file?.name ?? "Bild/GIF");
    }
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) { redirectToLogin(); return; }

      const newErrors: Record<string, string> = {};
      if (!form.definition.trim()) newErrors.definition = "Bitte gib eine Definition ein.";
      if (!form.beispielsatz.trim()) newErrors.beispielsatz = "Bitte gib einen Beispielsatz ein.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setStatus("loading");
      setErrorMsg("");

      // Build origin_context from source — encode startSeconds as &t= for YouTube
      let originContext: string | undefined;
      if (form.sourceType === "other" && form.sourceText.trim()) {
        originContext = form.sourceText.trim();
      } else if (attachment) {
        let url = attachment.url;
        if (attachment.type === "youtube" && attachment.startSeconds && attachment.startSeconds > 0) {
          const sep = url.includes("?") ? "&" : "?";
          url = `${url}${sep}t=${attachment.startSeconds}`;
        }
        originContext = url;
      }

      try {
        const res = await fetch(`/api/v1/terms/${termSlug}/definitions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            definition: form.definition.trim(),
            example_sentence: form.beispielsatz.trim(),
            origin_context: originContext,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          setErrorMsg(data.error || "Ein Fehler ist aufgetreten.");
          setStatus("error");
          return;
        }

        try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
        setForm(EMPTY_FORM);
        setAttachment(null);
        setErrors({});
        setStatus("success");
      } catch {
        setErrorMsg("Netzwerkfehler. Bitte versuche es spaeter erneut.");
        setStatus("error");
      }
    },
    [form, termSlug, storageKey, attachment]
  );

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <span style={{ fontSize: "2rem" }}>&#x2705;</span>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Deine Definition wurde hinzugefuegt. Vielen Dank!
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            if (onSuccess) onSuccess();
          }}
          className="btn-filled text-xs"
        >
          SCHLIESSEN
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="Was bedeutet dieser Begriff deiner Meinung nach?"
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
          style={{
            borderColor: errors.beispielsatz ? "#EF4444" : "var(--color-border)",
            backgroundColor: "var(--color-bg)",
            minHeight: "80px",
          }}
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
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <option value="">— Keine Quelle —</option>
          {SOURCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Attachment picker for YouTube/Twitch/Image/GIF */}
        {showPicker && (form.sourceType === "youtube" || form.sourceType === "twitch" || form.sourceType === "image" || form.sourceType === "gif") && (
          <AttachmentPicker
            mode={form.sourceType}
            onAttach={handleAttach}
            onCancel={() => { setShowPicker(false); if (!attachment) updateField("sourceType", ""); }}
            initialUrl={attachment?.url ? (
              attachment.startSeconds && attachment.startSeconds > 0
                ? `${attachment.url}${attachment.url.includes("?") ? "&" : "?"}t=${attachment.startSeconds}`
                : attachment.url
            ) : undefined}
          />
        )}

        {/* Attachment preview */}
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
                {attachment.type === "youtube" && attachment.startSeconds != null && attachment.startSeconds > 0 && (
                  <> — ab {Math.floor(attachment.startSeconds / 60)}:{String(attachment.startSeconds % 60).padStart(2, "0")}</>
                )}
              </p>
            </div>
            {(attachment.type === "youtube" || attachment.type === "twitch") && (
              <button
                type="button"
                onClick={() => { setShowPicker(true); }}
                className="shrink-0 text-xs font-medium hover:underline"
                style={{ color: "var(--color-text-muted)" }}
              >
                Aendern
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setAttachment(null);
                setForm((prev) => ({ ...prev, savedAttachment: null, sourceText: "" }));
                updateField("sourceType", "");
              }}
              className="shrink-0 text-xs font-medium text-red-500 hover:underline"
            >
              Entfernen
            </button>
          </div>
        )}

        {/* Free text for "Andere" */}
        {form.sourceType === "other" && (
          <textarea
            value={form.sourceText}
            onChange={(e) => updateField("sourceText", e.target.value)}
            className="w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
              minHeight: "60px",
            }}
            placeholder="Woher stammt diese Bedeutung? (Stream, Video, Discord, etc.)"
          />
        )}
      </div>

      {/* Error message */}
      {status === "error" && (
        <p
          className="rounded-lg px-3 py-2 text-xs"
          style={{
            color: "var(--color-accent)",
            border: "1px solid var(--color-accent)",
            backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
          }}
        >
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
          Entwurf wird automatisch gespeichert.
        </p>
        <XpButton variant="primary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Wird gesendet..." : "Definition einreichen"}
        </XpButton>
      </div>
    </form>
  );
}
