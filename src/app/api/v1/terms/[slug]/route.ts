import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { isAdmin } from "@/lib/constants/admin";
import { logModerationAction } from "@/lib/data/moderation-log";
import { checkBanned } from "@/lib/utils/ban-check";
import { generateSlug } from "@/lib/utils/slug";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await params;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: term, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .single();

  if (error || !term) {
    return NextResponse.json(
      { error: "Term not found" },
      { status: 404 }
    );
  }

  // Non-approved or secret terms: only visible to the creator or admins
  if (term.status !== "approved" || term.is_secret) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isAllowed = false;
    if (user) {
      if (term.created_by === user.id) {
        isAllowed = true;
      } else {
        const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
        if (discordId && isAdmin(discordId)) {
          isAllowed = true;
        }
      }
    }

    if (!isAllowed) {
      return NextResponse.json(
        { error: "Term not found" },
        { status: 404 }
      );
    }
  }

  const [definitionsResult, tagsResult, aliasesResult] = await Promise.all([
    supabase
      .from("term_definitions")
      .select("*")
      .eq("term_id", term.id),
    supabase
      .from("term_tags")
      .select("*")
      .eq("term_id", term.id),
    supabase
      .from("term_aliases")
      .select("*")
      .eq("term_id", term.id),
  ]);

  return NextResponse.json({
    ...term,
    definitions: definitionsResult.data ?? [],
    tags: tagsResult.data ?? [],
    aliases: aliasesResult.data ?? [],
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await params;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid identifier" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Look up term by ID (UUID) or slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const query = supabase
    .from("glossary_terms")
    .select("id, created_by")
    .eq(isUuid ? "id" : "slug", isUuid ? slug : slug.toLowerCase())
    .single();

  const { data: term, error } = await query;

  if (error || !term) {
    return NextResponse.json({ error: "Term not found" }, { status: 404 });
  }

  // Only the creator or an admin may delete
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  const userIsAdmin = discordId && isAdmin(discordId);

  if (term.created_by !== user.id && !userIsAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Cascade delete child rows using service client (RLS may block)
  const serviceClient = await createServiceClient();
  await Promise.all([
    serviceClient.from("term_definitions").delete().eq("term_id", term.id),
    serviceClient.from("term_tags").delete().eq("term_id", term.id),
    serviceClient.from("term_aliases").delete().eq("term_id", term.id),
  ]);

  const { error: deleteError } = await serviceClient
    .from("glossary_terms")
    .delete()
    .eq("id", term.id);

  if (deleteError) {
    return NextResponse.json({ error: "Failed to delete term" }, { status: 500 });
  }

  // Log the self-deletion for audit trail
  await logModerationAction({
    action: "term_self_deleted",
    target_type: "term",
    target_id: term.id,
    details: "Begriff vom Ersteller geloescht",
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await params;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid identifier" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const banStatus = await checkBanned(user.id);
  if (banStatus.banned) {
    return NextResponse.json({ error: "Du bist gesperrt." }, { status: 403 });
  }

  // Look up term by ID (UUID) or slug
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  const { data: term, error } = await supabase
    .from("glossary_terms")
    .select("id, created_by")
    .eq(isUuid ? "id" : "slug", isUuid ? slug : slug.toLowerCase())
    .single();

  if (error || !term) {
    return NextResponse.json({ error: "Term not found" }, { status: 404 });
  }

  // Only the creator or an admin may edit
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  const userIsAdmin = discordId && isAdmin(discordId);

  if (term.created_by !== user.id && !userIsAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.term === "string" && body.term.trim()) {
    const newTerm = body.term.trim();
    if (newTerm.length > 200) {
      return NextResponse.json({ error: "Begriff ist zu lang (max. 200 Zeichen)" }, { status: 400 });
    }
    const newSlug = generateSlug(newTerm);
    if (!newSlug) {
      return NextResponse.json({ error: "Begriff ergibt keinen gueltigen Slug" }, { status: 400 });
    }

    // Check if new slug already exists (different term)
    const serviceCheck = await createServiceClient();
    const { data: existing } = await serviceCheck
      .from("glossary_terms")
      .select("id")
      .eq("slug", newSlug)
      .neq("id", term.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Dieser Begriff existiert bereits." }, { status: 409 });
    }

    updates.term = newTerm;
    updates.slug = newSlug;
  }

  if (typeof body.phonetic === "string") {
    updates.phonetic = body.phonetic.trim() || null;
  }

  if (typeof body.word_type === "string") {
    updates.word_type = body.word_type.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Keine Aenderungen angegeben" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const serviceClient = await createServiceClient();
  const { data: updated, error: updateError } = await serviceClient
    .from("glossary_terms")
    .update(updates)
    .eq("id", term.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Failed to update term" }, { status: 500 });
  }

  await logModerationAction({
    action: "term_edited",
    target_type: "term",
    target_id: term.id,
    details: "Begriff bearbeitet: " + Object.keys(updates).join(", "),
  });

  return NextResponse.json(updated);
}
