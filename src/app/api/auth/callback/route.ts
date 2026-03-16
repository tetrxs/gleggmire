import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/constants/admin";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";
  // Prevent open redirect: only allow relative paths
  if (!next.startsWith("/") || next.startsWith("//")) {
    next = "/";
  }
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
  const providerToken = sessionData.session?.provider_token ?? null;
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
          ...(providerToken ? { discord_access_token: providerToken } : {}),
        });
      } else {
        // Update existing user with latest Discord info
        await serviceClient
          .from("users")
          .update({
            username,
            avatar_url: avatarUrl,
            is_admin: isAdmin(discordId),
            ...(providerToken ? { discord_access_token: providerToken } : {}),
          })
          .eq("discord_id", discordId);
      }
    } catch {
      console.error("Failed to upsert user record");
    }

    // Auto-join Discord server (for bot DM capability)
    if (providerToken && process.env.DISCORD_GUILD_ID && process.env.DISCORD_BOT_TOKEN) {
      try {
        await fetch(
          `https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${discordId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token: providerToken }),
          }
        );
      } catch {
        // Non-blocking — DMs just won't work if this fails
      }
    }
  }

  return NextResponse.redirect(redirectTo);
}
