import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MyEntriesView } from "@/components/community/my-entries-view";
import type { GlossaryTerm, TermDefinition, Comment } from "@/types/database";

export const metadata: Metadata = {
  title: "Meins — gleggmire.net",
  description: "Deine Begriffe, Definitionen und Kommentare auf gleggmire.net",
};

export type DefinitionWithTerm = TermDefinition & {
  term_name: string;
  term_slug: string;
};

export type CommentWithTerm = Comment & {
  term_name: string;
  term_slug: string;
};

export default async function MeineEintraegePage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/api/auth/login");
  }

  // Fetch user's submitted terms
  const { data: terms } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("created_by", authUser.id)
    .order("created_at", { ascending: false });

  // Fetch user's definitions with joined term info
  const { data: rawDefinitions } = await supabase
    .from("term_definitions")
    .select("*, glossary_terms(term, slug)")
    .eq("submitted_by", authUser.id)
    .order("created_at", { ascending: false });

  const definitions: DefinitionWithTerm[] = (rawDefinitions ?? []).map((d) => {
    const termInfo = d.glossary_terms as unknown as { term: string; slug: string } | null;
    return {
      ...d,
      glossary_terms: undefined,
      term_name: termInfo?.term ?? "Unbekannt",
      term_slug: termInfo?.slug ?? "",
    } as DefinitionWithTerm;
  });

  // Fetch user's comments, then resolve term info separately
  const { data: rawComments } = await supabase
    .from("comments")
    .select("*")
    .eq("user_id", authUser.id)
    .eq("entity_type", "term")
    .order("created_at", { ascending: false });

  let comments: CommentWithTerm[] = [];
  if (rawComments && rawComments.length > 0) {
    const termIds = [...new Set(rawComments.map((c) => c.entity_id))];
    const { data: termRows } = await supabase
      .from("glossary_terms")
      .select("id, term, slug")
      .in("id", termIds);

    const termMap = new Map((termRows ?? []).map((t) => [t.id, { term: t.term, slug: t.slug }]));

    comments = rawComments
      .filter((c) => termMap.has(c.entity_id)) // skip orphaned comments
      .map((c) => {
        const termInfo = termMap.get(c.entity_id)!;
        return {
          ...c,
          term_name: termInfo.term,
          term_slug: termInfo.slug,
        } as CommentWithTerm;
      });
  }

  return (
    <MyEntriesView
      terms={terms ?? []}
      definitions={definitions}
      comments={comments}
    />
  );
}
