import type { Metadata } from "next";
import { GlossaryList } from "@/components/glossary/glossary-list";
import { getApprovedTerms } from "@/lib/data/glossary";

export const metadata: Metadata = {
  title: "Glossar — gleggmire.net",
  description:
    "Das Gleggmire-Glossar: Alle Begriffe, Definitionen und Insider aus dem Gleggmire-Universum.",
};

export default async function GlossarPage() {
  const termsWithPreview = await getApprovedTerms();

  const terms = termsWithPreview.map(({ definitions, tags, ...term }) => term);
  const definitions = termsWithPreview.flatMap((t) => t.definitions);
  const tags = termsWithPreview.flatMap((t) => t.tags);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Glossar
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          Das offizielle Gleggmire-Lexikon. Durchsuche, filtere und entdecke
          Begriffe aus dem Gleggmire-Universum.
        </p>
      </div>

      <GlossaryList terms={terms} definitions={definitions} tags={tags} />
    </main>
  );
}
