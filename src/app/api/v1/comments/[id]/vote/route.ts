import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate",
  };

  // Auth + service client in parallel
  const [supabase, service] = await Promise.all([
    createClient(),
    createServiceClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ vote_type: null }, { headers });
  }

  const { id: commentId } = await params;

  const { data: existingVote } = await service
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
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Auth + service client + params in parallel
  const [supabase, service, { id: commentId }] = await Promise.all([
    createClient(),
    createServiceClient(),
    params,
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const voteType = body.vote_type;
  if (voteType !== "up" && voteType !== "down") {
    return NextResponse.json(
      { error: "vote_type must be 'up' or 'down'" },
      { status: 400 }
    );
  }

  // All checks via single service client in parallel
  const [{ data: banUser }, { data: comment }, { data: existingVote }] =
    await Promise.all([
      service
        .from("users")
        .select("is_banned, ban_reason, ban_until")
        .eq("id", user.id)
        .maybeSingle(),
      service
        .from("comments")
        .select("id, user_id")
        .eq("id", commentId)
        .maybeSingle(),
      service
        .from("votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("entity_type", "comment")
        .eq("entity_id", commentId)
        .maybeSingle(),
    ]);

  if (banUser?.is_banned) {
    if (!banUser.ban_until || new Date(banUser.ban_until) > new Date()) {
      return NextResponse.json({ error: "Du bist gesperrt." }, { status: 403 });
    }
  }

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (comment.user_id === user.id) {
    return NextResponse.json(
      { error: "Du kannst nicht fuer deinen eigenen Kommentar stimmen." },
      { status: 403 }
    );
  }

  try {
    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Toggle off
        const { error: deleteError } = await service
          .from("votes")
          .delete()
          .eq("id", existingVote.id);

        if (deleteError) {
          return NextResponse.json(
            { error: "Failed to remove vote" },
            { status: 500 }
          );
        }

        // Sync denormalized counts in background
        syncCommentVoteCounts(service, commentId);
        return NextResponse.json({
          action: "removed",
          vote_type: null,
        });
      }

      // Switch vote
      const { error: updateError } = await service
        .from("votes")
        .update({ vote_type: voteType })
        .eq("id", existingVote.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to switch vote" },
          { status: 500 }
        );
      }

      syncCommentVoteCounts(service, commentId);
      return NextResponse.json({
        action: "switched",
        vote_type: voteType,
      });
    }

    // New vote
    const { error: voteError } = await service.from("votes").insert({
      user_id: user.id,
      entity_type: "comment",
      entity_id: commentId,
      vote_type: voteType,
    });

    if (voteError) {
      return NextResponse.json(
        { error: "Failed to cast vote" },
        { status: 500 }
      );
    }

    syncCommentVoteCounts(service, commentId);
    return NextResponse.json({
      action: "voted",
      vote_type: voteType,
    });
  } catch (err) {
    console.error("Comment vote error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function syncCommentVoteCounts(service: any, commentId: string) {
  Promise.all([
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
  ])
    .then(([{ count: upCount }, { count: downCount }]) =>
      service
        .from("comments")
        .update({ upvotes: upCount ?? 0, downvotes: downCount ?? 0 })
        .eq("id", commentId)
    )
    .catch(() => {});
}
