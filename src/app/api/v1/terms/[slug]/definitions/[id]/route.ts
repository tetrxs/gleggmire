import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { isAdmin } from "@/lib/constants/admin";
import { checkBanned } from "@/lib/utils/ban-check";
import { logModerationAction } from "@/lib/data/moderation-log";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug, id } = await params;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid definition ID" }, { status: 400 });
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

  // Verify term exists
  const { data: term, error: termError } = await supabase
    .from("glossary_terms")
    .select("id")
    .eq("slug", slug.toLowerCase())
    .single();

  if (termError || !term) {
    return NextResponse.json({ error: "Term not found" }, { status: 404 });
  }

  // Fetch definition
  const serviceClient = await createServiceClient();
  const { data: definition, error: defError } = await serviceClient
    .from("term_definitions")
    .select("id, submitted_by, term_id")
    .eq("id", id)
    .eq("term_id", term.id)
    .single();

  if (defError || !definition) {
    return NextResponse.json({ error: "Definition not found" }, { status: 404 });
  }

  // Only the creator or an admin may edit
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  const userIsAdmin = discordId && isAdmin(discordId);

  if (definition.submitted_by !== user.id && !userIsAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.definition === "string" && body.definition.trim()) {
    const def = body.definition.trim();
    if (def.length > 5000) {
      return NextResponse.json({ error: "Definition ist zu lang (max. 5000 Zeichen)" }, { status: 400 });
    }
    updates.definition = def;
  }

  if (typeof body.example_sentence === "string" && body.example_sentence.trim()) {
    updates.example_sentence = body.example_sentence.trim();
  }

  if (typeof body.origin_context === "string") {
    updates.origin_context = body.origin_context.trim() || null;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Keine Aenderungen angegeben" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await serviceClient
    .from("term_definitions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Failed to update definition" }, { status: 500 });
  }

  await logModerationAction({
    action: "definition_edited",
    target_type: "definition",
    target_id: id,
    details: "Definition bearbeitet: " + Object.keys(updates).join(", "),
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug, id } = await params;
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid definition ID" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify term exists
  const { data: term, error: termError } = await supabase
    .from("glossary_terms")
    .select("id")
    .eq("slug", slug.toLowerCase())
    .single();

  if (termError || !term) {
    return NextResponse.json({ error: "Term not found" }, { status: 404 });
  }

  // Fetch definition
  const serviceClient = await createServiceClient();
  const { data: definition, error: defError } = await serviceClient
    .from("term_definitions")
    .select("id, submitted_by, term_id")
    .eq("id", id)
    .eq("term_id", term.id)
    .single();

  if (defError || !definition) {
    return NextResponse.json({ error: "Definition not found" }, { status: 404 });
  }

  // Only the creator or an admin may delete
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  const userIsAdmin = discordId && isAdmin(discordId);

  if (definition.submitted_by !== user.id && !userIsAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: deleteError } = await serviceClient
    .from("term_definitions")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: "Failed to delete definition" }, { status: 500 });
  }

  await logModerationAction({
    action: "definition_deleted",
    target_type: "definition",
    target_id: id,
    details: "Definition geloescht",
  });

  return NextResponse.json({ success: true });
}
