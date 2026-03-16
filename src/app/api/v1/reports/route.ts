import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { submitRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { checkBanned } from "@/lib/utils/ban-check";
import { notifyAdmins } from "@/lib/discord";

const VALID_REASONS = [
  "hate_speech", "racism", "sexual_content", "harassment",
  "spam", "misinformation", "personal_info", "other",
];

const VALID_ENTITY_TYPES = ["term", "definition", "comment"];

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(submitRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body" }, { status: 400 });
  }

  const entityType = body.entity_type as string;
  const entityId = body.entity_id as string;
  const reason = body.reason as string;
  const description = typeof body.description === "string" ? body.description.trim() || null : null;

  if (!VALID_ENTITY_TYPES.includes(entityType)) {
    return NextResponse.json({ error: "Ungueltiger entity_type" }, { status: 400 });
  }
  if (!entityId) {
    return NextResponse.json({ error: "entity_id erforderlich" }, { status: 400 });
  }
  if (!VALID_REASONS.includes(reason)) {
    return NextResponse.json({ error: "Ungueltiger Meldegrund" }, { status: 400 });
  }
  if (description && description.length > 1000) {
    return NextResponse.json({ error: "Beschreibung zu lang (max. 1000 Zeichen)" }, { status: 400 });
  }

  const serviceClient = await createServiceClient();

  // Resolve entity and reported user
  let reportedUserId: string | null = null;
  let entityPreview = "";

  if (entityType === "term") {
    const { data: term } = await serviceClient
      .from("glossary_terms")
      .select("id, created_by, term")
      .eq("id", entityId)
      .maybeSingle();
    if (!term) {
      return NextResponse.json({ error: "Begriff nicht gefunden" }, { status: 404 });
    }
    reportedUserId = term.created_by;
    entityPreview = term.term;
  } else if (entityType === "definition") {
    const { data: def } = await serviceClient
      .from("term_definitions")
      .select("id, submitted_by, definition")
      .eq("id", entityId)
      .maybeSingle();
    if (!def) {
      return NextResponse.json({ error: "Definition nicht gefunden" }, { status: 404 });
    }
    reportedUserId = def.submitted_by;
    entityPreview = def.definition.slice(0, 100);
  } else if (entityType === "comment") {
    const { data: comment } = await serviceClient
      .from("comments")
      .select("id, user_id, text")
      .eq("id", entityId)
      .maybeSingle();
    if (!comment) {
      return NextResponse.json({ error: "Kommentar nicht gefunden" }, { status: 404 });
    }
    reportedUserId = comment.user_id;
    entityPreview = (comment.text ?? "").slice(0, 100);
  }

  // Prevent self-reporting
  if (reportedUserId === user.id) {
    return NextResponse.json({ error: "Du kannst dich nicht selbst melden" }, { status: 400 });
  }

  // Check for duplicate report
  const { data: existingReport } = await serviceClient
    .from("reports")
    .select("id")
    .eq("reporter_id", user.id)
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("status", "pending")
    .maybeSingle();

  if (existingReport) {
    return NextResponse.json({ error: "Du hast diesen Inhalt bereits gemeldet" }, { status: 409 });
  }

  // Create report
  const { data: report, error: insertError } = await serviceClient
    .from("reports")
    .insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId,
      entity_type: entityType,
      entity_id: entityId,
      reason,
      description,
    })
    .select()
    .single();

  if (insertError || !report) {
    console.error("Report insert error:", insertError);
    return NextResponse.json({ error: "Fehler beim Erstellen der Meldung" }, { status: 500 });
  }

  // Notify admins via Discord
  const REASON_LABELS: Record<string, string> = {
    hate_speech: "Hassrede",
    racism: "Rassismus",
    sexual_content: "Sexuelle Inhalte",
    harassment: "Belaestigung",
    spam: "Spam",
    misinformation: "Falschinformation",
    personal_info: "Persoenliche Daten",
    other: "Sonstiges",
  };

  notifyAdmins({
    title: "Neue Meldung",
    description: "**Typ:** " + entityType + "\n**Grund:** " + (REASON_LABELS[reason] ?? reason) + "\n**Inhalt:** " + entityPreview.slice(0, 150),
    color: 0xef4444,
    url: process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL + "/admin" : undefined,
  }).catch(() => {});

  return NextResponse.json({ success: true, report_id: report.id }, { status: 201 });
}
