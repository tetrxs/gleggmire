import type { Metadata } from "next";
import { XpWindow } from "@/components/ui/xp-window";
import { GlossaryList } from "@/components/glossary/glossary-list";
import { MOCK_TERMS, MOCK_DEFINITIONS, MOCK_TAGS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Glossar — gleggmire.net",
};

export default function GlossarPage() {
  // TODO: Replace mock data with Supabase query
  const terms = MOCK_TERMS;
  const definitions = MOCK_DEFINITIONS;
  const tags = MOCK_TAGS;

  return (
    <XpWindow title="📖 Gleggmire-Enzyklopädie — Glossar.exe">
      <GlossaryList terms={terms} definitions={definitions} tags={tags} />
    </XpWindow>
  );
}
