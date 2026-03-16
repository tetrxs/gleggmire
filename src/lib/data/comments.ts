import { createClient } from "@/lib/supabase/server";
import type { Comment, ReactionType } from "@/types/database";

export interface CommentReaction {
  type: ReactionType;
  count: number;
}

export interface CommentWithMeta extends Comment {
  username?: string;
  avatar_url?: string;
  replies?: CommentWithMeta[];
  reactions?: CommentReaction[];
}

/**
 * Get all comments for a given entity (term) with nested replies,
 * usernames, and aggregated reactions.
 */
export async function getCommentsForEntity(
  entityType: string,
  entityId: string,
): Promise<CommentWithMeta[]> {
  try {
    const supabase = await createClient();

    // Fetch all comments for this entity
    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: true });

    if (error || !comments) return [];

    // Collect user IDs for username lookup
    const userIds = [
      ...new Set(
        comments.filter((c) => c.user_id).map((c) => c.user_id as string),
      ),
    ];

    // Fetch usernames and avatars
    const { data: users } = userIds.length > 0
      ? await supabase
          .from("users")
          .select("id, username, avatar_url")
          .in("id", userIds)
      : { data: [] };

    const userMap = new Map<string, { username: string; avatar_url?: string }>();
    for (const u of users ?? []) {
      userMap.set(u.id, { username: u.username, avatar_url: u.avatar_url ?? undefined });
    }

    // Fetch reactions for all comments
    const commentIds = comments.map((c) => c.id);
    const { data: reactions } = commentIds.length > 0
      ? await supabase
          .from("reactions")
          .select("comment_id, reaction_type")
          .in("comment_id", commentIds)
      : { data: [] };

    // Aggregate reactions per comment
    const reactionMap = new Map<string, Map<string, number>>();
    for (const r of reactions ?? []) {
      if (!reactionMap.has(r.comment_id)) {
        reactionMap.set(r.comment_id, new Map());
      }
      const counts = reactionMap.get(r.comment_id)!;
      counts.set(r.reaction_type, (counts.get(r.reaction_type) ?? 0) + 1);
    }

    // Build comment map
    const commentMap = new Map<string, CommentWithMeta>();
    const topLevel: CommentWithMeta[] = [];

    for (const comment of comments) {
      const reactionCounts = reactionMap.get(comment.id);
      const commentReactions: CommentReaction[] = reactionCounts
        ? Array.from(reactionCounts.entries()).map(([type, count]) => ({
            type: type as ReactionType,
            count,
          }))
        : [];

      const userData = comment.user_id ? userMap.get(comment.user_id) : undefined;
      const enriched: CommentWithMeta = {
        ...comment,
        username: userData?.username,
        avatar_url: userData?.avatar_url,
        replies: [],
        reactions: commentReactions.length > 0 ? commentReactions : undefined,
      };

      commentMap.set(comment.id, enriched);
    }

    // Build tree
    for (const comment of comments) {
      const enriched = commentMap.get(comment.id)!;
      if (comment.parent_id && commentMap.has(comment.parent_id)) {
        commentMap.get(comment.parent_id)!.replies!.push(enriched);
      } else {
        topLevel.push(enriched);
      }
    }

    return topLevel;
  } catch {
    return [];
  }
}
