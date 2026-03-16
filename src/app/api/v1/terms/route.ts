import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { apiRateLimit, submitRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { generateSlug } from "@/lib/utils/slug";
import { notifyAdmins } from "@/lib/discord";
import { logModerationAction } from "@/lib/data/moderation-log";
import { checkBanned } from "@/lib/utils/ban-check";

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const search = searchParams.get("search");

  const supabase = await createClient();

  let query = supabase
    .from("glossary_terms")
    .select("*", { count: "exact" })
    .eq("status", "approved")
    .eq("is_secret", false)
    .order("term", { ascending: true });

  if (search) {
    // Escape SQL LIKE wildcards in user input
    const escaped = search.replace(/[%_\\]/g, (ch) => `\\${ch}`);
    query = query.ilike("term", `%${escaped}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data: terms, count: total, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch terms" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    terms: terms ?? [],
    total: total ?? 0,
    page,
    limit,
  });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(submitRateLimit, ip);
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

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungueltiger JSON-Body" }, { status: 400 });
  }

  const term = (typeof body.term === "string" ? body.term : "").trim();
  const definition = (typeof body.definition === "string" ? body.definition : "").trim();
  const exampleSentence = (typeof body.example_sentence === "string" ? body.example_sentence : "").trim();
  const originContext = (typeof body.origin_context === "string" ? body.origin_context : "").trim() || null;
  const rawTags = Array.isArray(body.tags) ? body.tags : [];
  const tags: string[] = rawTags
    .filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    .map((t) => t.trim());
  if (!term) {
    return NextResponse.json({ error: "Begriff ist erforderlich" }, { status: 400 });
  }
  if (term.length > 200) {
    return NextResponse.json({ error: "Begriff ist zu lang (max. 200 Zeichen)" }, { status: 400 });
  }
  if (!definition) {
    return NextResponse.json({ error: "Definition ist erforderlich" }, { status: 400 });
  }
  if (definition.length > 5000) {
    return NextResponse.json({ error: "Definition ist zu lang (max. 5000 Zeichen)" }, { status: 400 });
  }
  if (!exampleSentence) {
    return NextResponse.json({ error: "Beispielsatz ist erforderlich" }, { status: 400 });
  }
  if (tags.length === 0) {
    return NextResponse.json({ error: "Mindestens ein Tag ist erforderlich" }, { status: 400 });
  }
  if (tags.length > 20) {
    return NextResponse.json({ error: "Maximal 20 Tags erlaubt" }, { status: 400 });
  }

  const slug = generateSlug(term);
  if (!slug) {
    return NextResponse.json({ error: "Begriff ergibt keinen gueltigen Slug" }, { status: 400 });
  }

  // Ensure the user has a record in the users table (new Discord logins may not)
  try {
    const serviceClient = await createServiceClient();
    const { data: existingUser } = await serviceClient
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingUser) {
      const discordId = user.user_metadata?.provider_id ?? user.user_metadata?.sub;
      const username =
        user.user_metadata?.custom_claims?.global_name ??
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        "Unknown";
      const avatarUrl = user.user_metadata?.avatar_url;

      await serviceClient.from("users").insert({
        id: user.id,
        discord_id: discordId ?? "",
        username,
        avatar_url: avatarUrl ?? null,
        glegg_score: 0,
        is_gleggmire: false,
        is_admin: false,
        is_moderator: false,
        is_banned: false,
      });
    }
  } catch {
    // Non-blocking: user record creation failure should not prevent term submission
    console.error("Failed to ensure user record exists for", user.id);
  }

  // Check if slug already exists among approved terms
  const { data: existing } = await supabase
    .from("glossary_terms")
    .select("id")
    .eq("slug", slug)
    .in("status", ["approved", "pending", "disputed", "locked"])
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Dieser Begriff existiert bereits." },
      { status: 409 }
    );
  }

  // Insert term
  const { data: newTerm, error: termError } = await supabase
    .from("glossary_terms")
    .insert({
      slug,
      term,
      status: "approved",
      created_by: user.id,
      is_secret: false,
      verified_by_gleggmire: false,
    })
    .select()
    .single();

  if (termError || !newTerm) {
    console.error("Term insert error:", termError);
    return NextResponse.json(
      { error: "Fehler beim Erstellen des Begriffs: " + (termError?.message ?? "unbekannt") },
      { status: 500 }
    );
  }

  // Insert initial definition
  const { error: defError } = await supabase
    .from("term_definitions")
    .insert({
      term_id: newTerm.id,
      definition,
      example_sentence: exampleSentence,
      origin_context: originContext,
      submitted_by: user.id,
      upvotes: 0,
      downvotes: 0,
      cope_meter_sum: 0,
      cope_meter_count: 0,
    });

  if (defError) {
    console.error("Definition insert error:", defError);
    // Rollback: delete the term if definition insertion failed
    await supabase.from("glossary_terms").delete().eq("id", newTerm.id);
    return NextResponse.json(
      { error: "Fehler beim Erstellen der Definition: " + defError.message },
      { status: 500 }
    );
  }

  // Insert tags
  if (tags.length > 0) {
    const tagRows = tags.map((tag) => ({
      term_id: newTerm.id,
      tag,
    }));
    await supabase.from("term_tags").insert(tagRows);
  }

  // Log + notify admins about new submission
  await logModerationAction({
    action: "term_submitted",
    target_type: "term",
    target_id: newTerm.id,
    details: "Neuer Begriff eingereicht: " + term,
  });

  notifyAdmins({
    title: "Neuer Begriff eingereicht",
    description: "**" + term + "**\n\n" + definition.slice(0, 200) + (definition.length > 200 ? "..." : ""),
    color: 0x3b82f6,
    url: process.env.NEXT_PUBLIC_SITE_URL ? process.env.NEXT_PUBLIC_SITE_URL + "/admin" : undefined,
  }).catch(() => {});

  return NextResponse.json(newTerm, { status: 201 });
}
