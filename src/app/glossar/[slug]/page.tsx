import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MOCK_TERMS as glossaryTerms,
  MOCK_DEFINITIONS as termDefinitions,
  MOCK_ALIASES as termAliases,
  MOCK_TAGS as termTags,
} from "@/lib/mock-data";
import { TermDetail } from "@/components/glossary/term-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = glossaryTerms.find((t) => t.slug === slug);

  if (!term) {
    return { title: "Begriff nicht gefunden — gleggmire.net" };
  }

  const definitions = termDefinitions.filter((d) => d.term_id === term.id);
  const firstDefinition = definitions[0]?.definition ?? "";

  return {
    title: `${term.term} — Gleggmire-Glossar`,
    description: firstDefinition.slice(0, 160),
    openGraph: {
      title: `${term.term} — Gleggmire-Glossar`,
      description: firstDefinition.slice(0, 160),
      siteName: "gleggmire.net",
    },
  };
}

export default async function GlossarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const term = glossaryTerms.find((t) => t.slug === slug);

  if (!term) {
    notFound();
  }

  const definitions = termDefinitions.filter((d) => d.term_id === term.id);
  const aliases = termAliases.filter((a) => a.term_id === term.id);
  const tags = termTags.filter((t) => t.term_id === term.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <TermDetail
        term={term}
        definitions={definitions}
        aliases={aliases}
        tags={tags}
      />
    </main>
  );
}
