import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { checkBanned } from "@/lib/utils/ban-check";

/**
 * Recount votes from the votes table and set absolute values on comments.
 * This is self-correcting: no race conditions, no drift over time.
 */
async function syncCommentVoteCounts(commentId: string) {
  const service = await createServiceClient();

  const [{ count: upCount }, { count: downCount }] = await Promise.all([
    service
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("entity_type", "comment")
      .eq("entity_id", commentId)
      .eq("vote_type", "up"),
    service
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("entity_type", "comment")
      .eq("entity_id", commentId)
      .eq("vote_type", "down"),
  ]);

  const upvotes = upCount ?? 0;
  const downvotes = downCount ?? 0;

  await service
    .from("comments")
    .update({ upvotes, downvotes })
    .eq("id", commentId);

  return { upvotes, downvotes };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  if (!user) {
    return NextResponse.json({ vote_type: null }, { headers });
  }

  const { id: commentId } = await params;

  const { data: existingVote } = await supabase
    .from("votes")
    .select("vote_type")
    .eq("user_id", user.id)
    .eq("entity_type", "comment")
    .eq("entity_id", commentId)
    .maybeSingle();

  return NextResponse.json(
    { vote_type: existingVote?.vote_type ?? null },
    { headers }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const banStatus = await checkBanned(user.id);
  if (banStatus.banned) {
    return NextResponse.json({ error: "Du bist gesperrt." }, { status: 403 });
  }

  const { id: commentId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const voteType = body.vote_type;
  if (voteType !== "up" && voteType !== "down") {
    return NextResponse.json({ error: "vote_type must be 'up' or 'down'" }, { status: 400 });
  }

  // Verify comment exists and get author
  const { data: comment } = await supabase
    .from("comments")
    .select("id, user_id")
    .eq("id", commentId)
    .maybeSingle();

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Prevent self-voting
  if (comment.user_id === user.id) {
    return NextResponse.json(
      { error: "Du kannst nicht fuer deinen eigenen Kommentar stimmen." },
      { status: 403 }
    );
  }

  try {
    // Check existing vote
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", user.id)
      .eq("entity_type", "comment")
      .eq("entity_id", commentId)
      .maybeSingle();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Toggle off
        const { error: deleteError } = await supabase
          .from("votes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) {
          return NextResponse.json(
            { error: "Failed to remove vote" },
            { status: 500 }
          );
        }

        const counts = await syncCommentVoteCounts(commentId);
        return NextResponse.json({
          action: "removed",
          vote_type: null,
          ...counts,
        });
      }

      // Switch vote
      const { error: updateError } = await supabase
        .from("votes")
        .update({ vote_type: voteType })
        .eq("id", existingVote.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to switch vote" },
          { status: 500 }
        );
      }

      const counts = await syncCommentVoteCounts(commentId);
      return NextResponse.json({
        action: "switched",
        vote_type: voteType,
        ...counts,
      });
    }

    // New vote
    const { error: voteError } = await supabase.from("votes").insert({
      user_id: user.id,
      entity_type: "comment",
      entity_id: commentId,
      vote_type: voteType,
    });

    if (voteError) {
      return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
    }

    const counts = await syncCommentVoteCounts(commentId);
    return NextResponse.json({
      action: "voted",
      vote_type: voteType,
      ...counts,
    });
  } catch (err) {
    console.error("Comment vote error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
