import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { commentRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { isAdmin } from "@/lib/constants/admin";
import { checkBanned } from "@/lib/utils/ban-check";
import { logModerationAction } from "@/lib/data/moderation-log";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(commentRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const banStatus = await checkBanned(user.id);
  if (banStatus.banned) {
    return NextResponse.json({ error: "Du bist gesperrt." }, { status: 403 });
  }

  // Fetch comment
  const serviceClient = await createServiceClient();
  const { data: comment, error: commentError } = await serviceClient
    .from("comments")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (commentError || !comment) {
    return NextResponse.json({ error: "Kommentar nicht gefunden" }, { status: 404 });
  }

  // Only the creator or an admin may edit
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  const userIsAdmin = discordId && isAdmin(discordId);

  if (comment.user_id !== user.id && !userIsAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.text === "string") {
    const text = body.text.trim() || null;
    if (text && text.length > 2000) {
      return NextResponse.json({ error: "Kommentar zu lang (max. 2000 Zeichen)" }, { status: 400 });
    }
    updates.text = text;
  }

  if (typeof body.attachment_type === "string") {
    if (body.attachment_type && !["image", "gif", "youtube", "twitch"].includes(body.attachment_type)) {
      return NextResponse.json({ error: "Ungueltiger Anhangstyp" }, { status: 400 });
    }
    updates.attachment_type = body.attachment_type || null;
  }

  if (typeof body.attachment_url === "string") {
    updates.attachment_url = body.attachment_url.trim() || null;
  }

  if (typeof body.attachment_start_seconds === "number") {
    updates.attachment_start_seconds = body.attachment_start_seconds;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Keine Aenderungen angegeben" }, { status: 400 });
  }

  // Must still have text or attachment after update
  if (updates.text === null && updates.attachment_url === null) {
    return NextResponse.json({ error: "Text oder Anhang erforderlich" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await serviceClient
    .from("comments")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Fehler beim Bearbeiten des Kommentars" }, { status: 500 });
  }

  await logModerationAction({
    action: "comment_edited",
    target_type: "comment",
    target_id: id,
    details: "Kommentar bearbeitet: " + Object.keys(updates).join(", "),
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(commentRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { id } = await params;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid comment ID" }, { status: 400 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  // Fetch comment
  const serviceClient = await createServiceClient();
  const { data: comment, error: commentError } = await serviceClient
    .from("comments")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (commentError || !comment) {
    return NextResponse.json({ error: "Kommentar nicht gefunden" }, { status: 404 });
  }

  // Only the creator or an admin may delete
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  const userIsAdmin = discordId && isAdmin(discordId);

  if (comment.user_id !== user.id && !userIsAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Delete replies first, then the comment itself
  await serviceClient
    .from("comments")
    .delete()
    .eq("parent_id", id);

  const { error: deleteError } = await serviceClient
    .from("comments")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: "Fehler beim Loeschen des Kommentars" }, { status: 500 });
  }

  await logModerationAction({
    action: "comment_deleted",
    target_type: "comment",
    target_id: id,
    details: "Kommentar geloescht",
  });

  return NextResponse.json({ success: true });
}
