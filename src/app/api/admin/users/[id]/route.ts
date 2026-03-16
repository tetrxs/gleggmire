import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/constants/admin";
import { logModerationAction } from "@/lib/data/moderation-log";
import { notifyDiscordUser } from "@/lib/discord";

async function checkAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  return discordId ? isAdmin(discordId) : false;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { is_banned, ban_reason, ban_type, remove_content, is_moderator } = body;

    const updateData: Record<string, unknown> = {};

    if (is_banned !== undefined) {
      if (typeof is_banned !== "boolean") {
        return NextResponse.json({ error: "is_banned muss ein Boolean sein" }, { status: 400 });
      }
      updateData.is_banned = is_banned;
      if (is_banned) {
        updateData.ban_reason = typeof ban_reason === "string" ? ban_reason.trim() || null : null;
        updateData.banned_at = new Date().toISOString();
        if (ban_type === "temp_ban") {
          updateData.ban_until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        } else {
          updateData.ban_until = null;
        }
      } else {
        updateData.ban_reason = null;
        updateData.banned_at = null;
        updateData.ban_until = null;
      }
    }

    if (is_moderator !== undefined) {
      if (typeof is_moderator !== "boolean") {
        return NextResponse.json({ error: "is_moderator muss ein Boolean sein" }, { status: 400 });
      }
      updateData.is_moderator = is_moderator;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Keine Felder zum Aktualisieren" }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id, username, discord_id")
      .eq("id", id)
      .maybeSingle();

    if (!existingUser) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log moderation actions
    const targetName = existingUser.username ?? id;

    if (is_banned === true) {
      const banDuration = ban_type === "temp_ban" ? " (7 Tage)" : " (Permanent)";
      const actionType = ban_type === "temp_ban" ? "user_banned" : "user_banned";

      await logModerationAction({
        action: actionType,
        target_type: "user",
        target_id: id,
        details: (ban_reason ? ban_reason + banDuration : "Nutzer gebannt" + banDuration) + " — " + targetName,
      });

      // Notify banned user via Discord DM
      if (existingUser.discord_id) {
        notifyDiscordUser(existingUser.discord_id, {
          title: "Du wurdest gesperrt" + (ban_type === "temp_ban" ? " (7 Tage)" : " (Permanent)"),
          description: ban_reason ? "Grund: " + ban_reason : "Kontaktiere einen Admin bei Fragen.",
          color: 0xef4444,
        }).catch(() => {});
      }

      // Remove all user content if requested
      if (remove_content) {
        // Delete user's terms (with cascading children)
        const { data: userTerms } = await supabase
          .from("glossary_terms")
          .select("id")
          .eq("created_by", id);

        if (userTerms && userTerms.length > 0) {
          const termIds = userTerms.map((t) => t.id);
          await Promise.all([
            supabase.from("term_definitions").delete().in("term_id", termIds),
            supabase.from("term_tags").delete().in("term_id", termIds),
            supabase.from("term_aliases").delete().in("term_id", termIds),
          ]);
          await supabase.from("glossary_terms").delete().in("id", termIds);
        }

        // Delete user's definitions, comments
        await Promise.all([
          supabase.from("term_definitions").delete().eq("created_by", id),
          supabase.from("comments").delete().eq("user_id", id),
        ]);

        await logModerationAction({
          action: "user_banned",
          target_type: "user",
          target_id: id,
          details: "Alle Inhalte entfernt — " + targetName,
        });
      }
    } else if (is_banned === false) {
      await logModerationAction({
        action: "user_unbanned",
        target_type: "user",
        target_id: id,
        details: "Nutzer entsperrt: " + targetName,
      });
    }

    if (is_moderator === true) {
      await logModerationAction({
        action: "moderator_added",
        target_type: "user",
        target_id: id,
        details: "Moderator-Rechte vergeben: " + targetName,
      });
    } else if (is_moderator === false) {
      await logModerationAction({
        action: "moderator_removed",
        target_type: "user",
        target_id: id,
        details: "Moderator-Rechte entzogen: " + targetName,
      });
    }

    return NextResponse.json({ user: data });
  } catch {
    return NextResponse.json({ error: "Ungueltige Anfrage" }, { status: 400 });
  }
}
