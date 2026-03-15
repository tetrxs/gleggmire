import { createClient } from "@/lib/supabase/server";
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

    const [{ data: definitions }, { data: tags }] = await Promise.all([
      supabase
        .from("term_definitions")
        .select("*")
        .in("term_id", termIds),
      supabase
        .from("term_tags")
        .select("*")
        .in("term_id", termIds),
    ]);

    return terms.map((term) => ({
      ...term,
      definitions: (definitions ?? []).filter((d) => d.term_id === term.id),
      tags: (tags ?? []).filter((t) => t.term_id === term.id),
    })) as TermWithPreview[];
  } catch {
    return [];
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
      .select("id, term, slug");

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

    const [{ data: definitions }, { data: tags }] = await Promise.all([
      supabase.from("term_definitions").select("*").in("term_id", termIds),
      supabase.from("term_tags").select("*").in("term_id", termIds),
    ]);

    return terms.map((term) => ({
      ...term,
      definitions: (definitions ?? []).filter((d) => d.term_id === term.id),
      tags: (tags ?? []).filter((t) => t.term_id === term.id),
    })) as TermWithPreview[];
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
 * Get terms with status 'pending' for the moderation queue.
 * Includes definitions and tags so moderators can review in full.
 */
export async function getPendingTerms(): Promise<TermWithPreview[]> {
  try {
    const supabase = await createClient();

    const { data: terms, error } = await supabase
      .from("glossary_terms")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error || !terms) return [];

    const termIds = terms.map((t) => t.id);

    const [{ data: definitions }, { data: tags }] = await Promise.all([
      supabase
        .from("term_definitions")
        .select("*")
        .in("term_id", termIds),
      supabase
        .from("term_tags")
        .select("*")
        .in("term_id", termIds),
    ]);

    return terms.map((term) => ({
      ...term,
      definitions: (definitions ?? []).filter((d) => d.term_id === term.id),
      tags: (tags ?? []).filter((t) => t.term_id === term.id),
    })) as TermWithPreview[];
  } catch {
    return [];
  }
}
