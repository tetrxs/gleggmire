import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitRateLimit, checkRateLimit } from "@/lib/rate-limit";
import { checkBanned } from "@/lib/utils/ban-check";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
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

  const { slug } = await params;

  // Check term exists
  const { data: term, error: termError } = await supabase
    .from("glossary_terms")
    .select("id")
    .eq("slug", slug.toLowerCase())
    .single();

  if (termError || !term) {
    return NextResponse.json({ error: "Term not found" }, { status: 404 });
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const definition = (typeof body.definition === "string" ? body.definition : "").trim();
  const exampleSentence = (typeof body.example_sentence === "string" ? body.example_sentence : "").trim();
  const originContext = (typeof body.origin_context === "string" ? body.origin_context : "").trim() || null;

  if (!definition) {
    return NextResponse.json(
      { error: "Definition ist erforderlich" },
      { status: 400 }
    );
  }
  if (definition.length > 5000) {
    return NextResponse.json(
      { error: "Definition ist zu lang (max. 5000 Zeichen)" },
      { status: 400 }
    );
  }
  if (!exampleSentence) {
    return NextResponse.json(
      { error: "Beispielsatz ist erforderlich" },
      { status: 400 }
    );
  }

  // Insert definition with pending status
  const { data: newDef, error: insertError } = await supabase
    .from("term_definitions")
    .insert({
      term_id: term.id,
      definition,
      example_sentence: exampleSentence,
      origin_context: originContext,
      submitted_by: user.id,
      upvotes: 0,
      downvotes: 0,
      cope_meter_sum: 0,
      cope_meter_count: 0,
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to submit definition" },
      { status: 500 }
    );
  }

  return NextResponse.json(newDef, { status: 201 });
}
