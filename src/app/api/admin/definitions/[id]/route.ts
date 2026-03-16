import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logModerationAction } from "@/lib/data/moderation-log";
import { notifyUser } from "@/lib/discord";
import { checkAdminOrMod } from "@/lib/utils/auth-check";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminOrMod();
  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const action = body.action as string;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json(
      { error: "Action must be 'approve' or 'reject'" },
      { status: 400 }
    );
  }

  const serviceClient = await createServiceClient();

  // Fetch definition info before any mutation (needed for logging and notification)
  const { data: definition } = await serviceClient
    .from("term_definitions")
    .select("*, glossary_terms(term)")
    .eq("id", id)
    .maybeSingle();

  if (!definition) {
    return NextResponse.json({ error: "Definition not found" }, { status: 404 });
  }

  const termName = definition.glossary_terms?.term ?? "Unbekannt";

  if (action === "reject") {
    const { error } = await serviceClient
      .from("term_definitions")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to reject" }, { status: 500 });
    }

    await logModerationAction({
      action: "definition_rejected",
      target_type: "definition",
      target_id: id,
      details: "Definition abgelehnt fuer Begriff: " + termName,
    });

    if (definition.submitted_by) {
      notifyUser(definition.submitted_by, {
        title: "Definition abgelehnt",
        description: "Deine Definition fuer **" + termName + "** wurde leider abgelehnt.",
        color: 0xef4444,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, action: "rejected" });
  }

  // Approve
  const { error } = await serviceClient
    .from("term_definitions")
    .update({ status: "approved" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }

  await logModerationAction({
    action: "definition_approved",
    target_type: "definition",
    target_id: id,
    details: "Definition freigegeben fuer Begriff: " + termName,
  });

  if (definition.submitted_by) {
    notifyUser(definition.submitted_by, {
      title: "Definition freigegeben!",
      description: "Deine Definition fuer **" + termName + "** wurde freigeschaltet!",
      color: 0x22c55e,
      url: process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL + "/glossar/" + (definition.glossary_terms?.slug ?? "") : undefined,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, action: "approved" });
}
