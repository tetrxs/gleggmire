import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkAdminOrMod } from "@/lib/utils/auth-check";
import { logModerationAction } from "@/lib/data/moderation-log";
import { notifyUser } from "@/lib/discord";

const VALID_ACTIONS = ["dismiss", "delete", "warn", "temp_ban", "perm_ban"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAllowed = await checkAdminOrMod();
  if (!isAllowed) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action as string;
  const note = typeof body.note === "string" ? body.note.trim() || null : null;
  const deleteContentOverride = typeof body.delete_content === "boolean" ? body.delete_content : null;

  if (!VALID_ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Ungueltige Aktion" }, { status: 400 });
  }

  const serviceClient = await createServiceClient();

  // Fetch the report
  const { data: report } = await serviceClient
    .from("reports")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!report) {
    return NextResponse.json({ error: "Report nicht gefunden" }, { status: 404 });
  }

  if (report.status !== "pending") {
    return NextResponse.json({ error: "Report wurde bereits bearbeitet" }, { status: 400 });
  }

  // Get resolver user ID
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolverId = user?.id ?? null;

  // Determine status based on action
  const statusMap: Record<string, string> = {
    dismiss: "dismissed",
    delete: "resolved_deleted",
    warn: "resolved_warned",
    temp_ban: "resolved_temp_ban",
    perm_ban: "resolved_perm_ban",
  };

  // Execute action
  const defaultDeleteContent = ["delete", "warn", "temp_ban", "perm_ban"].includes(action);
  const shouldDeleteContent = deleteContentOverride !== null ? deleteContentOverride : defaultDeleteContent;
  const shouldBan = ["temp_ban", "perm_ban"].includes(action);

  // Delete the reported content if needed
  if (shouldDeleteContent) {
    if (report.entity_type === "term") {
      // Cascade delete term and all children
      await Promise.all([
        serviceClient.from("term_definitions").delete().eq("term_id", report.entity_id),
        serviceClient.from("term_tags").delete().eq("term_id", report.entity_id),
        serviceClient.from("term_aliases").delete().eq("term_id", report.entity_id),
      ]);
      await serviceClient.from("glossary_terms").delete().eq("id", report.entity_id);
    } else if (report.entity_type === "definition") {
      await serviceClient.from("term_definitions").delete().eq("id", report.entity_id);
    } else if (report.entity_type === "comment") {
      await serviceClient.from("comments").delete().eq("id", report.entity_id);
    }
  }

  // Ban the reported user if needed
  if (shouldBan && report.reported_user_id) {
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

    const banReason = REASON_LABELS[report.reason] ?? report.reason;
    const banUpdate: Record<string, unknown> = {
      is_banned: true,
      ban_reason: banReason,
      banned_at: new Date().toISOString(),
    };

    if (action === "temp_ban") {
      banUpdate.ban_until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      banUpdate.ban_until = null; // permanent
    }

    await serviceClient
      .from("users")
      .update(banUpdate)
      .eq("id", report.reported_user_id);

    // Notify banned user
    const banDuration = action === "temp_ban" ? " (7 Tage)" : " (Permanent)";
    notifyUser(report.reported_user_id, {
      title: "Du wurdest gesperrt" + banDuration,
      description: "Grund: " + banReason + (note ? "\nAnmerkung: " + note : ""),
      color: 0xef4444,
    }).catch(() => {});

    await logModerationAction({
      action: action === "temp_ban" ? "user_temp_banned" : "user_perm_banned",
      target_type: "user",
      target_id: report.reported_user_id,
      details: banReason + banDuration,
    });
  }

  // Warn notification (delete content but no ban)
  if (action === "warn" && report.reported_user_id) {
    notifyUser(report.reported_user_id, {
      title: "Verwarnung",
      description: "Ein von dir erstellter Inhalt wurde entfernt." + (note ? "\nAnmerkung: " + note : ""),
      color: 0xf59e0b,
    }).catch(() => {});

    await logModerationAction({
      action: "user_warned",
      target_type: "user",
      target_id: report.reported_user_id,
      details: "Verwarnung wegen: " + report.reason,
    });
  }

  // Notify reporter about outcome
  if (action === "dismiss") {
    notifyUser(report.reporter_id, {
      title: "Meldung abgelehnt",
      description: "Deine Meldung wurde geprueft und abgelehnt. Der gemeldete Inhalt verstoesst nicht gegen unsere Regeln.",
      color: 0x6b7280,
    }).catch(() => {});
  } else {
    notifyUser(report.reporter_id, {
      title: "Meldung bearbeitet",
      description: "Danke fuer deine Meldung! Wir haben Massnahmen ergriffen.",
      color: 0x22c55e,
    }).catch(() => {});
  }

  // Log the report resolution
  await logModerationAction({
    action: "report_" + action,
    target_type: "report",
    target_id: id,
    details: "Report " + statusMap[action] + (note ? " - " + note : ""),
  });

  // Update report status
  await serviceClient
    .from("reports")
    .update({
      status: statusMap[action],
      resolved_by: resolverId,
      resolved_at: new Date().toISOString(),
      resolution_note: note,
    })
    .eq("id", id);

  return NextResponse.json({ success: true, action, status: statusMap[action] });
}
