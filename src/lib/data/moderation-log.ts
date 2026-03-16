import { createClient, createServiceClient } from "@/lib/supabase/server";

interface LogActionInput {
  action: string;
  target_type: string;
  target_id: string;
  details?: string;
}

/**
 * Insert a moderation action into the moderation_log table.
 * Automatically resolves the current authenticated user as the moderator.
 */
export async function logModerationAction(input: LogActionInput): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Need a real user ID for the FK constraint
    const moderatorId = user?.id;
    if (!moderatorId) return;

    const service = await createServiceClient();
    await service.from("moderation_log").insert({
      moderator_id: moderatorId,
      action: input.action,
      target_type: input.target_type,
      target_id: input.target_id,
      details: input.details || null,
    });
  } catch {
    // Fail silently — logging should never break the main action
  }
}

export interface ModerationLogEntry {
  id: string;
  moderator: string;
  action: string;
  targetType: string;
  targetId: string;
  details: string | null;
  timestamp: string;
}

/**
 * Fetch recent moderation log entries with resolved moderator usernames.
 */
export async function getRecentModerationLog(limit = 100): Promise<ModerationLogEntry[]> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("moderation_log")
      .select("id, moderator_id, action, target_type, target_id, details, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];

    // Resolve moderator usernames
    const modIds = [...new Set(data.map((r) => r.moderator_id).filter(Boolean))];
    const { data: users } = modIds.length > 0
      ? await supabase.from("users").select("id, username").in("id", modIds)
      : { data: [] };

    const userMap = new Map<string, string>();
    for (const u of users ?? []) {
      userMap.set(u.id, u.username);
    }

    return data.map((row) => ({
      id: row.id,
      moderator: userMap.get(row.moderator_id) ?? "Admin",
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      details: row.details,
      timestamp: row.created_at,
    }));
  } catch {
    return [];
  }
}
