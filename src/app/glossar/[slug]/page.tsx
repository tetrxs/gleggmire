import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTermBySlug } from "@/lib/data/glossary";
import { getCommentsForEntity } from "@/lib/data/comments";
import { getUserInfoByIds } from "@/lib/data/users";
import { TermDetail } from "@/components/glossary/term-detail";
import { CommentSection } from "@/components/comments/comment-section";
import { YouTubeMuteProvider } from "@/lib/youtube-mute-context";
import { FloatingMuteButton } from "@/components/ui/floating-mute-button";
import { HashHighlight } from "@/components/ui/hash-highlight";

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

  // Resolve usernames and avatars for term creator and all definition authors
  const userIds = [
    term.created_by,
    ...definitions.map((d) => d.submitted_by),
  ];
  const userInfoMap = await getUserInfoByIds(userIds);

  const comments = await getCommentsForEntity("term", term.id);

  // Get current user for edit/delete permissions
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  return (
    <YouTubeMuteProvider>
      <div className="py-10">
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
