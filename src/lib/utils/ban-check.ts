import { createServiceClient } from "@/lib/supabase/server";

/**
 * Check if a user is banned. Handles temporary bans by auto-unbanning
 * when ban_until has passed.
 */
export async function checkBanned(
  userId: string
): Promise<{ banned: boolean; reason?: string }> {
  const supabase = await createServiceClient();

  const { data: user } = await supabase
    .from("users")
    .select("is_banned, ban_reason, ban_until")
    .eq("id", userId)
    .maybeSingle();

  if (!user || !user.is_banned) {
    return { banned: false };
  }

  // Check if temporary ban has expired
  if (user.ban_until) {
    const banExpiry = new Date(user.ban_until);
    if (banExpiry <= new Date()) {
      // Auto-unban: temp ban has expired
      await supabase
        .from("users")
        .update({
          is_banned: false,
          ban_reason: null,
          banned_at: null,
          ban_until: null,
        })
        .eq("id", userId);

      return { banned: false };
    }
  }

  return {
    banned: true,
    reason: user.ban_reason ?? undefined,
  };
}
