import type { Metadata } from "next";
import { GlossaryList } from "@/components/glossary/glossary-list";
import { getApprovedTerms } from "@/lib/data/glossary";
import { OpenModalButton } from "@/components/ui/open-modal-button";

export const metadata: Metadata = {
  title: "Gleggmire Glossar — Alle Begriffe und Definitionen der Community",
  description:
    "Das vollstaendige Gleggmire-Glossar: Alle Begriffe, Definitionen, Insider und Slang aus dem Gleggmire-Universum. Von der Community gesammelt und erklaert.",
  alternates: {
    canonical: "https://gleggmire.net/glossar",
  },
  openGraph: {
    title: "Gleggmire Glossar — Alle Begriffe und Definitionen der Community",
    description:
      "Das vollstaendige Gleggmire-Glossar: Alle Begriffe, Definitionen, Insider und Slang aus dem Gleggmire-Universum.",
    url: "https://gleggmire.net/glossar",
    type: "website",
  },
};

export default async function GlossarPage() {
  const termsWithPreview = await getApprovedTerms();

  const terms = termsWithPreview.map(({ definitions, tags, commentCount, creatorUsername, creatorAvatarUrl, ...term }) => term);
  const definitions = termsWithPreview.flatMap((t) => t.definitions);
  const tags = termsWithPreview.flatMap((t) => t.tags);

  const commentCounts: Record<string, number> = {};
  const creators: Record<string, { username: string; avatarUrl: string | null }> = {};
  for (const t of termsWithPreview) {
    commentCounts[t.id] = t.commentCount;
    creators[t.id] = { username: t.creatorUsername, avatarUrl: t.creatorAvatarUrl };
  }

  // JSON-LD: DefinedTermSet schema for the glossary listing
  const termSetSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Gleggmire Community Glossar",
    description: "Community-Glossar mit Begriffen, Definitionen und Insider aus dem Gleggmire-Universum.",
    url: "https://gleggmire.net/glossar",
    hasDefinedTerm: termsWithPreview.slice(0, 50).map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definitions[0]?.definition?.slice(0, 120) ?? "",
      url: `https://gleggmire.net/glossar/${t.slug}`,
    })),
  };

  return (
    <div className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termSetSchema) }}
      />
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight"
          >
            Glossar
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Das Gleggmire-Lexikon. Durchsuche, filtere und entdecke Begriffe.
          </p>
        </div>
        <OpenModalButton
          event="open-term-submit-modal"
          className="btn-filled shrink-0 text-xs"
        >
          + Begriff EINREICHEN
        </OpenModalButton>
      </div>

      <GlossaryList terms={terms} definitions={definitions} tags={tags} commentCounts={commentCounts} creators={creators} />
    </div>
  );
}
