"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { SubmitTermForm } from "@/components/glossary/submit-term-form";
import type { TermMatchCandidate } from "@/lib/data/glossary";

export function TermSubmitModal() {
  const [open, setOpen] = useState(false);
  const [existingTerms, setExistingTerms] = useState<TermMatchCandidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = async () => {
      setOpen(true);
      if (existingTerms.length === 0) {
        setLoading(true);
        try {
          const res = await fetch("/api/terms/for-matching");
          if (res.ok) {
            const data = await res.json();
            setExistingTerms(data);
          }
        } catch {
          // continue with empty list
        } finally {
          setLoading(false);
        }
      }
    };
    window.addEventListener("open-term-submit-modal", handler);
    return () => window.removeEventListener("open-term-submit-modal", handler);
  }, [existingTerms.length]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Begriff einreichen"
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Laden...
          </span>
        </div>
      ) : (
        <SubmitTermForm
          existingTerms={existingTerms}
          onSuccess={() => setOpen(false)}
        />
      )}
    </Modal>
  );
}
