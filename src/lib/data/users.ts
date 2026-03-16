import { createClient } from "@/lib/supabase/server";
import { computeScoreFromComponents } from "@/lib/utils/glegg-score";
import type { ScoreComponents } from "@/lib/utils/glegg-score";
import type { User } from "@/types/database";

/**
 * Look up usernames for a list of user IDs.
 * Returns a map of userId -> username (or "Unbekannt" if not found).
 */
export async function getUsernamesByIds(
  userIds: string[]
): Promise<Record<string, string>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  if (unique.length === 0) return {};

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, username")
      .in("id", unique);

    if (error || !data) return {};

    const map: Record<string, string> = {};
    for (const user of data) {
      map[user.id] = user.username;
    }
    return map;
  } catch {
    return {};
  }
}

export interface UserInfo {
  username: string;
  avatar_url?: string;
}

/**
 * Look up usernames and avatar URLs for a list of user IDs.
 */
export async function getUserInfoByIds(
  userIds: string[]
): Promise<Record<string, UserInfo>> {
  const unique = [...new Set(userIds.filter(Boolean))];
  if (unique.length === 0) return {};

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("users")
      .select("id, username, avatar_url")
      .in("id", unique);

    if (error || !data) return {};

    const map: Record<string, UserInfo> = {};
    for (const user of data) {
      map[user.id] = { username: user.username, avatar_url: user.avatar_url ?? undefined };
    }
    return map;
  } catch {
    return {};
  }
}

export interface UserWithStats extends User {
  badges: string[];
  stats: {
    termsCreated: number;
    definitionsWritten: number;
    comments: number;
  };
}

/**
 * Get the top N users by live-computed glegg_score for the leaderboard.
 * Uses the compute_glegg_score_components() Postgres function for efficiency.
 */
export async function getTopUsers(limit: number = 10): Promise<UserWithStats[]> {
  try {
    const supabase = await createClient();

    // Fetch score components for all non-banned users in one RPC call
    const { data: components, error: rpcError } = await supabase
      .rpc("compute_glegg_score_components");

    if (rpcError || !components) return [];

    // Build a map of user_id -> score components
    const componentMap = new Map<string, ScoreComponents>();
    for (const row of components) {
      componentMap.set(row.user_id, row);
    }

    const userIds = components.map((c: { user_id: string }) => c.user_id);
    if (userIds.length === 0) return [];

    // Fetch all badges and user data in parallel
    const [{ data: badges }, { data: users }] = await Promise.all([
      supabase
        .from("badges")
        .select("user_id, badge_type")
        .in("user_id", userIds),
      supabase
        .from("users")
        .select("*")
        .eq("is_banned", false),
    ]);

    if (!users) return [];

    // Compute live scores
    const scored = users.map((user) => {
      const comp = componentMap.get(user.id) ?? {
        approved_term_count: 0,
        approved_def_count: 0,
        def_vote_sum: 0,
        def_context_count: 0,
        comment_count: 0,
        comment_attachment_count: 0,
      };
      const userBadges = (badges ?? [])
        .filter((b) => b.user_id === user.id)
        .map((b) => b.badge_type);
      const liveScore = computeScoreFromComponents(comp, userBadges);

      return {
        ...user,
        glegg_score: liveScore,
        badges: userBadges,
        stats: {
          termsCreated: comp.approved_term_count,
          definitionsWritten: comp.approved_def_count,
          comments: comp.comment_count,
        },
      } as UserWithStats;
    });

    // Sort by live score descending and take top N
    scored.sort((a, b) => b.glegg_score - a.glegg_score);
    return scored.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Get all users for admin user management.
 * Computes live glegg_score via the same RPC as the leaderboard.
 */
export async function getAllUsers(): Promise<UserWithStats[]> {
  try {
    const supabase = await createClient();

    // Fetch users and score components in parallel
    const [{ data: users, error }, { data: components }, { data: allBadges }] =
      await Promise.all([
        supabase.from("users").select("*").order("username", { ascending: true }),
        supabase.rpc("compute_glegg_score_components"),
        supabase.from("badges").select("user_id, badge_type"),
      ]);

    if (error || !users) return [];

    // Build maps for fast lookup
    const componentMap = new Map<string, ScoreComponents>();
    for (const row of components ?? []) {
      componentMap.set(row.user_id, row);
    }

    const badgeMap = new Map<string, string[]>();
    for (const b of allBadges ?? []) {
      const list = badgeMap.get(b.user_id) ?? [];
      list.push(b.badge_type);
      badgeMap.set(b.user_id, list);
    }

    return users.map((user) => {
      const comp = componentMap.get(user.id) ?? {
        approved_term_count: 0,
        approved_def_count: 0,
        def_vote_sum: 0,
        def_context_count: 0,
        comment_count: 0,
        comment_attachment_count: 0,
      };
      const userBadges = badgeMap.get(user.id) ?? [];
      const liveScore = computeScoreFromComponents(comp, userBadges);

      return {
        ...user,
        glegg_score: liveScore,
        badges: userBadges,
        stats: {
          termsCreated: comp.approved_term_count,
          definitionsWritten: comp.approved_def_count,
          comments: comp.comment_count,
        },
      } as UserWithStats;
    });
  } catch {
    return [];
  }
}
