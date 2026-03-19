import { createClient } from "@/lib/supabase/server";
import { calculateGleggScore } from "@/lib/utils/glegg-score";
import type {
  GlossaryTerm,
  TermDefinition,
  TermAlias,
  TermTag,
  TermEditHistory,
} from "@/types/database";

// ---------- Return types ----------

export type TermWithPreview = GlossaryTerm & {
  definitions: TermDefinition[];
  tags: TermTag[];
  commentCount: number;
  creatorUsername: string;
  creatorAvatarUrl: string | null;
};

export type TermFull = GlossaryTerm & {
  definitions: TermDefinition[];
  aliases: TermAlias[];
  tags: TermTag[];
};

export type TermMatchCandidate = {
  id: string;
  term: string;
  slug: string;
  aliases: Pick<TermAlias, "id" | "alias">[];
};

export type EditHistoryEntry = TermEditHistory & {
  glossary_terms: Pick<GlossaryTerm, "term" | "slug"> | null;
};

// ---------- Queries ----------

/**
 * Get all approved, non-secret terms with their first definition and tags.
 * Used for the main glossary listing page.
 */
export async function getApprovedTerms(): Promise<TermWithPreview[]> {
  try {
    const supabase = await createClient();

    const { data: terms, error } = await supabase
      .from("glossary_terms")
      .select("*")
      .eq("status", "approved")
      .eq("is_secret", false)
      .order("term", { ascending: true });

    if (error || !terms) return [];

    const termIds = terms.map((t) => t.id);
    const creatorIds = [...new Set(terms.map((t) => t.created_by))];

    const [{ data: definitions }, { data: tags }, { data: comments }, { data: users }] = await Promise.all([
      supabase
        .from("term_definitions")
        .select("*")
        .in("term_id", termIds)
        .eq("status", "approved"),
      supabase
        .from("term_tags")
        .select("*")
        .in("term_id", termIds),
      supabase
        .from("comments")
        .select("id, entity_id")
        .eq("entity_type", "term")
        .in("entity_id", termIds),
      supabase
        .from("users")
        .select("id, username, avatar_url")
        .in("id", creatorIds),
    ]);

    const userMap = new Map((users ?? []).map((u) => [u.id, u]));

    return terms.map((term) => {
      const creator = userMap.get(term.created_by);
      return {
        ...term,
        definitions: (definitions ?? []).filter((d) => d.term_id === term.id),
        tags: (tags ?? []).filter((t) => t.term_id === term.id),
        commentCount: (comments ?? []).filter((c) => c.entity_id === term.id).length,
        creatorUsername: creator?.username ?? "Unbekannt",
        creatorAvatarUrl: creator?.avatar_url ?? null,
      };
    }) as TermWithPreview[];
  } catch {
    return [];
  }
}

/**
 * Get the previous and next term (alphabetically) for navigation on detail pages.
 */
export async function getAdjacentTerms(
  currentTerm: string
): Promise<{ prev: { term: string; slug: string } | null; next: { term: string; slug: string } | null }> {
  try {
    const supabase = await createClient();

    const [{ data: prevData }, { data: nextData }] = await Promise.all([
      supabase
        .from("glossary_terms")
        .select("term, slug")
        .eq("status", "approved")
        .eq("is_secret", false)
        .lt("term", currentTerm)
        .order("term", { ascending: false })
        .limit(1),
      supabase
        .from("glossary_terms")
        .select("term, slug")
        .eq("status", "approved")
        .eq("is_secret", false)
        .gt("term", currentTerm)
        .order("term", { ascending: true })
        .limit(1),
    ]);

    return {
      prev: prevData?.[0] ?? null,
      next: nextData?.[0] ?? null,
    };
  } catch {
    return { prev: null, next: null };
  }
}

/**
 * Get a single term by slug with all definitions, aliases, and tags.
 * Returns null when the term does not exist.
 */
export async function getTermBySlug(slug: string): Promise<TermFull | null> {
  try {
    const supabase = await createClient();

    const { data: term, error } = await supabase
      .from("glossary_terms")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !term) return null;

    const [{ data: definitions }, { data: aliases }, { data: tags }] =
      await Promise.all([
        supabase
          .from("term_definitions")
          .select("*")
          .eq("term_id", term.id)
          .eq("status", "approved")
          .order("upvotes", { ascending: false }),
        supabase
          .from("term_aliases")
          .select("*")
          .eq("term_id", term.id),
        supabase
          .from("term_tags")
          .select("*")
          .eq("term_id", term.id),
      ]);

    return {
      ...term,
      definitions: definitions ?? [],
      aliases: aliases ?? [],
      tags: tags ?? [],
    } as TermFull;
  } catch {
    return null;
  }
}

/**
 * Get lightweight term data (id, term, slug) plus aliases for client-side
 * fuzzy matching / duplicate detection.
 */
export async function getExistingTermsForMatching(): Promise<
  TermMatchCandidate[]
> {
  try {
    const supabase = await createClient();

    const { data: terms, error } = await supabase
      .from("glossary_terms")
      .select("id, term, slug")
      .eq("status", "approved");

    if (error || !terms) return [];

    const termIds = terms.map((t) => t.id);

    const { data: aliases } = await supabase
      .from("term_aliases")
      .select("id, term_id, alias")
      .in("term_id", termIds);

    return terms.map((term) => ({
      id: term.id,
      term: term.term,
      slug: term.slug,
      aliases: (aliases ?? [])
        .filter((a) => a.term_id === term.id)
        .map(({ id, alias }) => ({ id, alias })),
    }));
  } catch {
    return [];
  }
}

/**
 * Get the N most recently added approved terms with their first definition and tags.
 * Used for homepage preview sections.
 */
export async function getLatestTerms(
  limit: number = 4
): Promise<TermWithPreview[]> {
  try {
    const supabase = await createClient();

    const { data: terms, error } = await supabase
      .from("glossary_terms")
      .select("*")
      .eq("status", "approved")
      .eq("is_secret", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !terms) return [];

    const termIds = terms.map((t) => t.id);
    const creatorIds = [...new Set(terms.map((t) => t.created_by))];

    const [{ data: definitions }, { data: tags }, { data: comments }, { data: users }] = await Promise.all([
      supabase.from("term_definitions").select("*").in("term_id", termIds).eq("status", "approved"),
      supabase.from("term_tags").select("*").in("term_id", termIds),
      supabase
        .from("comments")
        .select("id, entity_id")
        .eq("entity_type", "term")
        .in("entity_id", termIds),
      supabase
        .from("users")
        .select("id, username, avatar_url")
        .in("id", creatorIds),
    ]);

    const userMap = new Map((users ?? []).map((u) => [u.id, u]));

    return terms.map((term) => {
      const creator = userMap.get(term.created_by);
      return {
        ...term,
        definitions: (definitions ?? []).filter((d) => d.term_id === term.id),
        tags: (tags ?? []).filter((t) => t.term_id === term.id),
        commentCount: (comments ?? []).filter((c) => c.entity_id === term.id).length,
        creatorUsername: creator?.username ?? "Unbekannt",
        creatorAvatarUrl: creator?.avatar_url ?? null,
      };
    }) as TermWithPreview[];
  } catch {
    return [];
  }
}

/**
 * Get a random approved, non-secret term with at least one definition.
 * Useful for a "word of the day" or random explore feature.
 */
export async function getRandomTerm(): Promise<TermFull | null> {
  try {
    const supabase = await createClient();

    // Fetch all approved, non-secret term ids that have at least one definition
    const { data: termIds, error: idsError } = await supabase
      .from("glossary_terms")
      .select("id, slug")
      .eq("status", "approved")
      .eq("is_secret", false);

    if (idsError || !termIds || termIds.length === 0) return null;

    // Pick a random entry
    const random = termIds[Math.floor(Math.random() * termIds.length)];

    return getTermBySlug(random.slug);
  } catch {
    return null;
  }
}

/**
 * Get recent edit-history entries for the /aenderungen (changelog) page.
 * Includes the related term's name and slug for linking.
 */
export async function getRecentEdits(
  limit: number = 50
): Promise<EditHistoryEntry[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("term_edit_history")
      .select("*, glossary_terms(term, slug)")
      .order("edited_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    return data as EditHistoryEntry[];
  } catch {
    return [];
  }
}

/**
 * Get all definitions submitted by a specific user.
 */
export async function getDefinitionsByUser(
  userId: string
): Promise<TermDefinition[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("term_definitions")
      .select("*")
      .eq("submitted_by", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as TermDefinition[];
  } catch {
    return [];
  }
}

/**
 * Get comment data for a user (attachment info for score calculation).
 */
export async function getCommentsByUser(
  userId: string
): Promise<{ attachment_type: string | null }[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("comments")
      .select("attachment_type")
      .eq("user_id", userId);

    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

/**
 * Get badge types earned by a user.
 */
export async function getUserBadges(userId: string): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("badges")
      .select("badge_type")
      .eq("user_id", userId);

    if (error || !data) return [];
    return data.map((b) => b.badge_type);
  } catch {
    return [];
  }
}

/**
 * Calculate a user's Glegg-Score live from their activity data.
 */
export async function getUserGleggScore(userId: string): Promise<number> {
  const supabase = await createClient();

  const [
    { count: approvedTermCount },
    definitions,
    comments,
    badges,
  ] = await Promise.all([
    supabase
      .from("glossary_terms")
      .select("id", { count: "exact", head: true })
      .eq("created_by", userId)
      .eq("status", "approved"),
    getDefinitionsByUser(userId),
    getCommentsByUser(userId),
    getUserBadges(userId),
  ]);

  return calculateGleggScore({
    approvedTermCount: approvedTermCount ?? 0,
    definitions,
    comments,
    badges,
  });
}

