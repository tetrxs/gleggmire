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
    <div className="mx-auto max-w-2xl">
      <SubmitTermForm existingTerms={MOCK_EXISTING_TERMS} />
    </div>
  );
}
