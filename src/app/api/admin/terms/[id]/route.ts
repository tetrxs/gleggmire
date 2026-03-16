import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { logModerationAction } from "@/lib/data/moderation-log";
import { notifyDiscordUser } from "@/lib/discord";
import { checkAdminOrMod } from "@/lib/utils/auth-check";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminOrMod();
  if (!admin) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status erforderlich" }, { status: 400 });
    }

    const validStatuses = ["approved", "pending", "disputed", "locked"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Ungueltiger Status. Zum Ablehnen bitte DELETE verwenden." }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { data: existingTerm } = await supabase
      .from("glossary_terms")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (!existingTerm) {
      return NextResponse.json({ error: "Begriff nicht gefunden" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("glossary_terms")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logModerationAction({
      action: "term_" + status,
      target_type: "term",
      target_id: id,
      details: status === "approved"
        ? "Begriff freigeschaltet: " + (data.term ?? id)
        : "Status geaendert zu: " + status,
    });

    // Notify term creator via Discord DM
    if (status === "approved" && data.created_by) {
      const service = await createServiceClient();
      const { data: creator } = await service
        .from("users")
        .select("discord_id")
        .eq("id", data.created_by)
        .maybeSingle();

      if (creator?.discord_id) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gleggmire.net";
        notifyDiscordUser(creator.discord_id, {
          title: "Dein Begriff wurde freigeschaltet!",
          description: "**" + (data.term ?? "Dein Begriff") + "** ist jetzt im Glossar sichtbar.",
          color: 0x22c55e,
          url: siteUrl + "/glossar/" + (data.slug ?? ""),
          footer: "gleggmire.net",
        }).catch(() => {});
      }
    }

    return NextResponse.json({ term: data });
  } catch {
    return NextResponse.json({ error: "Ungueltige Anfrage" }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdminOrMod();
  if (!admin) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const supabase = await createServiceClient();

    const { data: termToDelete } = await supabase
      .from("glossary_terms")
      .select("id, term, created_by")
      .eq("id", id)
      .maybeSingle();

    if (!termToDelete) {
      return NextResponse.json({ error: "Begriff nicht gefunden" }, { status: 404 });
    }

    await Promise.all([
      supabase.from("term_definitions").delete().eq("term_id", id),
      supabase.from("term_tags").delete().eq("term_id", id),
      supabase.from("term_aliases").delete().eq("term_id", id),
    ]);

    const { error } = await supabase
      .from("glossary_terms")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logModerationAction({
      action: "term_rejected",
      target_type: "term",
      target_id: id,
      details: "Begriff abgelehnt und geloescht: " + (termToDelete.term ?? id),
    });

    // Notify creator that term was rejected
    if (termToDelete.created_by) {
      const { data: creator } = await supabase
        .from("users")
        .select("discord_id")
        .eq("id", termToDelete.created_by)
        .maybeSingle();

      if (creator?.discord_id) {
        notifyDiscordUser(creator.discord_id, {
          title: "Begriff abgelehnt",
          description: "**" + (termToDelete.term ?? "Dein Begriff") + "** wurde leider abgelehnt.",
          color: 0xef4444,
          footer: "gleggmire.net",
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Fehler beim Loeschen" }, { status: 500 });
  }
}
