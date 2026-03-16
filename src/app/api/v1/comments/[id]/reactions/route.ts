import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { checkBanned } from "@/lib/utils/ban-check";

const VALID_REACTIONS = ["W", "L", "Ratio", "Cope", "Seethe", "Geglaggmirt", "Kek"];

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

  const reactionType = body.reaction_type as string;
  if (!VALID_REACTIONS.includes(reactionType)) {
    return NextResponse.json({ error: "Invalid reaction_type" }, { status: 400 });
  }

  // Verify comment exists
  const { data: comment } = await supabase
    .from("comments")
    .select("id")
    .eq("id", commentId)
    .maybeSingle();

  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  try {
    // Check if user already has this reaction
    const { data: existingReaction } = await supabase
      .from("reactions")
      .select("id")
      .eq("user_id", user.id)
      .eq("comment_id", commentId)
      .eq("reaction_type", reactionType)
      .maybeSingle();

    if (existingReaction) {
      // Toggle off — remove reaction
      await supabase.from("reactions").delete().eq("id", existingReaction.id);
      return NextResponse.json({ action: "removed", reaction_type: reactionType });
    }

    // Add reaction
    const { error } = await supabase.from("reactions").insert({
      user_id: user.id,
      comment_id: commentId,
      reaction_type: reactionType,
    });

    if (error) {
      return NextResponse.json({ error: "Failed to add reaction" }, { status: 500 });
    }

    return NextResponse.json({ action: "added", reaction_type: reactionType });
  } catch (err) {
    console.error("Reaction error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
