import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin, ADMIN_DISCORD_IDS } from "@/lib/constants/admin";

export type AuthLevel = "admin" | "mod" | "user" | null;

/**
 * Determine the auth level of the current user.
 * Returns "admin", "mod", "user", or null (not authenticated).
 */
export async function getAuthLevel(): Promise<AuthLevel> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
  if (discordId && isAdmin(discordId)) return "admin";

  // Check moderator status in users table
  const serviceClient = await createServiceClient();
  const { data: dbUser } = await serviceClient
    .from("users")
    .select("is_moderator")
    .eq("id", user.id)
    .maybeSingle();

  if (dbUser?.is_moderator) return "mod";

  return "user";
}

/**
 * Check if current user is admin or moderator.
 */
export async function checkAdminOrMod(): Promise<boolean> {
  const level = await getAuthLevel();
  return level === "admin" || level === "mod";
}

/**
 * Check if current user is admin.
 */
export async function checkIsAdmin(): Promise<boolean> {
  const level = await getAuthLevel();
  return level === "admin";
}

/**
 * Client-side check: is a Discord ID an admin?
 */
export function isAdminDiscordId(discordId: string): boolean {
  return ADMIN_DISCORD_IDS.includes(discordId);
}
