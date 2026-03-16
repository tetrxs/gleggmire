import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { commentRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { checkBanned } from "@/lib/utils/ban-check";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(commentRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();

  // Auth required (even for anonymous comments — user_id stored but hidden)
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body" }, { status: 400 });
  }

  const entityType = body.entity_type as string;
  const entityId = body.entity_id as string;
  const parentId = (typeof body.parent_id === "string" && body.parent_id) || null;
  const text = (typeof body.text === "string" ? body.text.trim() : "") || null;
  const isAnonymous = body.is_anonymous === true;
  const attachmentType = typeof body.attachment_type === "string" ? body.attachment_type : null;
  const attachmentUrl = typeof body.attachment_url === "string" ? body.attachment_url.trim() : null;
  const attachmentStartSeconds = typeof body.attachment_start_seconds === "number" ? body.attachment_start_seconds : null;

  // Validate entity type
  if (entityType !== "term") {
    return NextResponse.json({ error: "entity_type muss 'term' sein" }, { status: 400 });
  }

  if (!entityId) {
    return NextResponse.json({ error: "entity_id ist erforderlich" }, { status: 400 });
  }

  // Must have text or attachment
  if (!text && !attachmentUrl) {
    return NextResponse.json({ error: "Text oder Anhang erforderlich" }, { status: 400 });
  }

  // Validate text length
  if (text && text.length > 2000) {
    return NextResponse.json({ error: "Kommentar zu lang (max. 2000 Zeichen)" }, { status: 400 });
  }

  // Validate attachment type
  if (attachmentType && !["image", "gif", "youtube", "twitch"].includes(attachmentType)) {
    return NextResponse.json({ error: "Ungueltiger Anhangstyp" }, { status: 400 });
  }

  const serviceClient = await createServiceClient();

  // Verify entity exists
  const { data: entity } = await serviceClient
    .from("glossary_terms")
    .select("id")
    .eq("id", entityId)
    .maybeSingle();

  if (!entity) {
    return NextResponse.json({ error: "Begriff nicht gefunden" }, { status: 404 });
  }

  // Verify parent exists if reply
  if (parentId) {
    const { data: parent } = await serviceClient
      .from("comments")
      .select("id")
      .eq("id", parentId)
      .maybeSingle();

    if (!parent) {
      return NextResponse.json({ error: "Elternkommentar nicht gefunden" }, { status: 404 });
    }
  }

  // Insert comment
  const { data: newComment, error: insertError } = await serviceClient
    .from("comments")
    .insert({
      entity_type: entityType,
      entity_id: entityId,
      parent_id: parentId,
      user_id: user.id,
      is_anonymous: isAnonymous,
      text,
      attachment_type: attachmentType,
      attachment_url: attachmentUrl,
      attachment_start_seconds: attachmentStartSeconds,
      upvotes: 0,
      downvotes: 0,
    })
    .select()
    .single();

  if (insertError || !newComment) {
    console.error("Comment insert error:", insertError);
    return NextResponse.json({ error: "Fehler beim Erstellen des Kommentars" }, { status: 500 });
  }

  // Log IP for GDPR compliance (90-day retention)
  const userAgent = request.headers.get("user-agent") ?? null;
  const deleteAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

  try {
    await serviceClient
      .from("comment_ip_log")
      .insert({
        comment_id: newComment.id,
        ip_address: ip,
        user_agent: userAgent,
        submitted_at: new Date().toISOString(),
        delete_at: deleteAt,
      });
  } catch {
    // Non-blocking: IP log failure should not prevent comment
  }

  // Fetch username for response
  const { data: commentUser } = await serviceClient
    .from("users")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json(
    {
      ...newComment,
      username: isAnonymous ? undefined : commentUser?.username,
      replies: [],
      reactions: [],
    },
    { status: 201 }
  );
}
