import type { Metadata } from "next";
import { GlossaryList } from "@/components/glossary/glossary-list";
import { getApprovedTerms } from "@/lib/data/glossary";
import { OpenModalButton } from "@/components/ui/open-modal-button";

export const metadata: Metadata = {
  title: "Glossar — gleggmire.net",
  description:
    "Das Gleggmire-Glossar: Alle Begriffe, Definitionen und Insider aus dem Gleggmire-Universum.",
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

  return (
    <div className="py-10">
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
