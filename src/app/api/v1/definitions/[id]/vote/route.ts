import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { checkBanned } from "@/lib/utils/ban-check";

/**
 * Recount votes from the votes table and set absolute values on term_definitions.
 * This is self-correcting: no race conditions, no drift over time.
 */
async function syncVoteCounts(definitionId: string) {
  const service = await createServiceClient();

  const [{ count: upCount }, { count: downCount }] = await Promise.all([
    service
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("entity_type", "definition")
      .eq("entity_id", definitionId)
      .eq("vote_type", "up"),
    service
      .from("votes")
      .select("*", { count: "exact", head: true })
      .eq("entity_type", "definition")
      .eq("entity_id", definitionId)
      .eq("vote_type", "down"),
  ]);

  const upvotes = upCount ?? 0;
  const downvotes = downCount ?? 0;

  await service
    .from("term_definitions")
    .update({ upvotes, downvotes })
    .eq("id", definitionId);

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

  if (!user) {
    return NextResponse.json({ vote_type: null });
  }

  const { id: definitionId } = await params;

  const { data: existingVote } = await supabase
    .from("votes")
    .select("vote_type")
    .eq("user_id", user.id)
    .eq("entity_type", "definition")
    .eq("entity_id", definitionId)
    .maybeSingle();

  return NextResponse.json({ vote_type: existingVote?.vote_type ?? null });
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

  const supabase = await createClient();

  // Check auth
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

  const { id: definitionId } = await params;

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

  // Verify the definition exists and get author
  const { data: definition } = await supabase
    .from("term_definitions")
    .select("id, submitted_by")
    .eq("id", definitionId)
    .maybeSingle();

  if (!definition) {
    return NextResponse.json(
      { error: "Definition not found" },
      { status: 404 }
    );
  }

  // Prevent self-voting
  if (definition.submitted_by === user.id) {
    return NextResponse.json(
      { error: "Du kannst nicht fuer deine eigene Definition stimmen." },
      { status: 403 }
    );
  }

  try {
    // Check if user already voted on this definition
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", user.id)
      .eq("entity_type", "definition")
      .eq("entity_id", definitionId)
      .maybeSingle();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Toggle off: remove vote
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

        const counts = await syncVoteCounts(definitionId);
        return NextResponse.json({
          action: "removed",
          vote_type: null,
          ...counts,
        });
      }

      // Switch vote: update existing
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

      const counts = await syncVoteCounts(definitionId);
      return NextResponse.json({
        action: "switched",
        vote_type: voteType,
        ...counts,
      });
    }

    // New vote
    const { error: voteError } = await supabase.from("votes").insert({
      user_id: user.id,
      entity_type: "definition",
      entity_id: definitionId,
      vote_type: voteType,
    });

    if (voteError) {
      return NextResponse.json(
        { error: "Failed to cast vote" },
        { status: 500 }
      );
    }

    const counts = await syncVoteCounts(definitionId);
    return NextResponse.json({
      action: "voted",
      vote_type: voteType,
      ...counts,
    });
  } catch (err) {
    console.error("Vote error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
