import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/constants/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const redirectTo = new URL(next, request.url);

  if (!code) {
    redirectTo.pathname = "/";
    redirectTo.searchParams.set("error", "no_code");
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.exchangeCodeForSession(code);

  if (sessionError || !sessionData.user) {
    redirectTo.pathname = "/";
    redirectTo.searchParams.set("error", "auth_failed");
    return NextResponse.redirect(redirectTo);
  }

  const user = sessionData.user;
  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  const username =
    user.user_metadata?.custom_claims?.global_name ??
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    "Unknown";
  const avatarUrl = user.user_metadata?.avatar_url;

  if (discordId) {
    try {
      // Use service role client for user management (RLS requires service_role for INSERT)
      const serviceClient = await createServiceClient();

      const { data: existingUser } = await serviceClient
        .from("users")
        .select("id")
        .eq("discord_id", discordId)
        .single();

      if (!existingUser) {
        // Create new user record
        await serviceClient.from("users").insert({
          id: user.id,
          discord_id: discordId,
          username,
          avatar_url: avatarUrl,
          glegg_score: 0,
          is_gleggmire: false,
          is_admin: isAdmin(discordId),
          is_moderator: false,
          is_banned: false,
        });
      } else {
        // Update existing user with latest Discord info
        await serviceClient
          .from("users")
          .update({
            username,
            avatar_url: avatarUrl,
            is_admin: isAdmin(discordId),
          })
          .eq("discord_id", discordId);
      }
    } catch {
      // User record creation is non-blocking; log but don't fail auth
      console.error("Failed to upsert user record");
    }
  }

  return NextResponse.redirect(redirectTo);
}
