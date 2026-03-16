import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkAdminOrMod } from "@/lib/utils/auth-check";

interface UserRecord {
  id: string;
  username: string;
  avatar_url: string | null;
  discord_id: string;
}

export async function GET() {
  const isAllowed = await checkAdminOrMod();
  if (!isAllowed) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const supabase = await createServiceClient();

  const { data: reports, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: "Fehler beim Laden der Reports" }, { status: 500 });
  }

  if (!reports || reports.length === 0) {
    return NextResponse.json({ reports: [] });
  }

  // Collect all user IDs
  const userIds = new Set<string>();
  for (const r of reports) {
    if (r.reporter_id) userIds.add(r.reporter_id);
    if (r.reported_user_id) userIds.add(r.reported_user_id);
    if (r.resolved_by) userIds.add(r.resolved_by);
  }

  const { data: users } = await supabase
    .from("users")
    .select("id, username, avatar_url, discord_id")
    .in("id", [...userIds]);

  const userMap = new Map<string, UserRecord>();
  for (const u of (users ?? []) as UserRecord[]) {
    userMap.set(u.id, u);
  }

  // Resolve entity URLs (slug + hash anchor)
  const termIds = reports.filter((r) => r.entity_type === "term").map((r) => r.entity_id);
  const defIds = reports.filter((r) => r.entity_type === "definition").map((r) => r.entity_id);
  const commentIds = reports.filter((r) => r.entity_type === "comment").map((r) => r.entity_id);

  const [{ data: terms }, { data: definitions }, { data: comments }] = await Promise.all([
    termIds.length > 0
      ? supabase.from("glossary_terms").select("id, slug").in("id", termIds)
      : { data: [] },
    defIds.length > 0
      ? supabase.from("term_definitions").select("id, term_id").in("id", defIds)
      : { data: [] },
    commentIds.length > 0
      ? supabase.from("comments").select("id, entity_type, entity_id").in("id", commentIds)
      : { data: [] },
  ]);

  // Term slug map (id -> slug)
  const termSlugMap = new Map<string, string>();
  for (const t of terms ?? []) termSlugMap.set(t.id, t.slug);

  // For definitions, resolve parent term slug
  const defTermIds = [...new Set((definitions ?? []).map((d) => d.term_id).filter(Boolean))];
  if (defTermIds.length > 0) {
    const { data: defTerms } = await supabase
      .from("glossary_terms")
      .select("id, slug")
      .in("id", defTermIds);
    for (const t of defTerms ?? []) termSlugMap.set(t.id, t.slug);
  }

  // For comments on terms, resolve slug
  const commentTermIds = [...new Set(
    (comments ?? [])
      .filter((c) => c.entity_type === "term")
      .map((c) => c.entity_id)
      .filter(Boolean)
  )];
  if (commentTermIds.length > 0) {
    const { data: commentTerms } = await supabase
      .from("glossary_terms")
      .select("id, slug")
      .in("id", commentTermIds);
    for (const t of commentTerms ?? []) termSlugMap.set(t.id, t.slug);
  }

  // Build entity URL map
  const entityUrlMap = new Map<string, string>();

  for (const t of terms ?? []) {
    entityUrlMap.set(t.id, `/glossar/${t.slug}`);
  }
  for (const d of definitions ?? []) {
    const slug = termSlugMap.get(d.term_id);
    if (slug) entityUrlMap.set(d.id, `/glossar/${slug}#definition-${d.id}`);
  }
  for (const c of comments ?? []) {
    if (c.entity_type === "term") {
      const slug = termSlugMap.get(c.entity_id);
      if (slug) entityUrlMap.set(c.id, `/glossar/${slug}#comment-${c.id}`);
    }
  }

  function mapUser(id: string | null) {
    if (!id) return null;
    const u = userMap.get(id);
    if (!u) return { id, username: "Unbekannt", avatar_url: null, discord_id: "" };
    return { id: u.id, username: u.username, avatar_url: u.avatar_url, discord_id: u.discord_id };
  }

  const enrichedReports = reports.map((r) => ({
    ...r,
    reporter: mapUser(r.reporter_id),
    reported_user: mapUser(r.reported_user_id),
    resolved_by_user: mapUser(r.resolved_by),
    entity_url: entityUrlMap.get(r.entity_id) ?? null,
  }));

  // Sort: pending first, then rest (both newest-first)
  enrichedReports.sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (a.status !== "pending" && b.status === "pending") return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return NextResponse.json({ reports: enrichedReports });
}
