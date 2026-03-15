import type { Metadata } from "next";
import { SubmitTermForm } from "@/components/glossary/submit-term-form";
import { MOCK_EXISTING_TERMS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Begriff einreichen — gleggmire.net",
  description:
    "Reiche einen neuen Begriff für das Gleggmire-Glossar ein. Die Community prüft und bewertet deinen Vorschlag.",
};

export default function EinreichenPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Begriff einreichen
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          Reiche einen neuen Begriff für das Gleggmire-Glossar ein. Die
          Community prüft und bewertet deinen Vorschlag.
        </p>
      </div>

      <SubmitTermForm existingTerms={MOCK_EXISTING_TERMS} />
    </main>
  );
}
