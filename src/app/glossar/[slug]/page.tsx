import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTermBySlug, getAdjacentTerms } from "@/lib/data/glossary";
import { getCommentsForEntity } from "@/lib/data/comments";
import { getUserInfoByIds } from "@/lib/data/users";
import { TermDetail } from "@/components/glossary/term-detail";
import { CommentSection } from "@/components/comments/comment-section";
import { YouTubeMuteProvider } from "@/lib/youtube-mute-context";
import { FloatingMuteButton } from "@/components/ui/floating-mute-button";
import { HashHighlight } from "@/components/ui/hash-highlight";
import { TermNavigation } from "@/components/glossary/term-navigation";

const BASE_URL = "https://gleggmire.net";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTermBySlug(slug);

  if (!data) {
    return { title: "Begriff nicht gefunden — gleggmire.net" };
  }

  const firstDef = data.definitions[0];
  const defText = firstDef?.definition ?? "";
  const exampleText = firstDef?.example_sentence ?? "";
  const aliasNames = data.aliases.map((a) => a.alias);
  const tagNames = data.tags.map((t) => t.tag);
  const keywords = [data.term, ...aliasNames, ...tagNames, "Gleggmire", "Glossar"];

  // Build a rich description: definition + example sentence
  let description = `${data.term}: ${defText}`;
  if (exampleText) {
    description += ` Beispiel: "${exampleText}"`;
  }
  description = description.slice(0, 160);

  const url = `${BASE_URL}/glossar/${slug}`;

  return {
    title: `${data.term} — Was bedeutet ${data.term}? | Gleggmire-Glossar`,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${data.term} — Was bedeutet ${data.term}? | Gleggmire-Glossar`,
      description,
      url,
      type: "article",
      locale: "de_DE",
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

  // Resolve usernames and avatars for term creator and all definition authors
  const userIds = [
    term.created_by,
    ...definitions.map((d) => d.submitted_by),
  ];
  const userInfoMap = await getUserInfoByIds(userIds);

  const [comments, adjacentTerms] = await Promise.all([
    getCommentsForEntity("term", term.id),
    getAdjacentTerms(term.id),
  ]);

  // Get current user for edit/delete permissions
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // JSON-LD: DefinedTerm schema
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: data.term,
    description: definitions[0]?.definition ?? "",
    url: `${BASE_URL}/glossar/${slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Gleggmire Community Glossar",
      url: `${BASE_URL}/glossar`,
    },
  };

  // JSON-LD: BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Glossar",
        item: `${BASE_URL}/glossar`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.term,
      },
    ],
  };

  return (
    <YouTubeMuteProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="py-10">
        <TermNavigation prev={adjacentTerms.prev} next={adjacentTerms.next} />
        <TermDetail
          term={term}
          definitions={definitions}
          aliases={aliases}
          tags={tags}
          comments={comments}
          userInfoMap={userInfoMap}
          currentUserId={authUser?.id}
        />

        {/* Comment section */}
        <div className="mt-10">
          <CommentSection
            entityType="term"
            entityId={term.id}
            comments={comments}
            currentUserId={authUser?.id}
          />
        </div>
      </div>
      <FloatingMuteButton />
      <HashHighlight />
    </YouTubeMuteProvider>
  );
}
