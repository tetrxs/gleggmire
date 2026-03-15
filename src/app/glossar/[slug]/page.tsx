import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTermBySlug } from "@/lib/data/glossary";
import { TermDetail } from "@/components/glossary/term-detail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTermBySlug(slug);

  if (!data) {
    return { title: "Begriff nicht gefunden — gleggmire.net" };
  }

  const firstDefinition = data.definitions[0]?.definition ?? "";

  return {
    title: `${data.term} — Gleggmire-Glossar`,
    description: firstDefinition.slice(0, 160),
    openGraph: {
      title: `${data.term} — Gleggmire-Glossar`,
      description: firstDefinition.slice(0, 160),
      siteName: "gleggmire.net",
    },
  };
}

export default async function GlossarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getTermBySlug(slug);

  if (!data) {
    notFound();
  }

  const { definitions, aliases, tags, ...term } = data;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <TermDetail
        term={term}
        definitions={definitions}
        aliases={aliases}
        tags={tags}
      />
    </main>
  );
}
