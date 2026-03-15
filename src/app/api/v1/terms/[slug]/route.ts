import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await checkRateLimit(apiRateLimit, ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { slug } = await params;
  const supabase = await createClient();

  const { data: term, error } = await supabase
    .from("glossary_terms")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .single();

  if (error || !term) {
    return NextResponse.json(
      { error: "Term not found" },
      { status: 404 }
    );
  }

  const [definitionsResult, tagsResult, aliasesResult] = await Promise.all([
    supabase
      .from("term_definitions")
      .select("*")
      .eq("term_id", term.id),
    supabase
      .from("term_tags")
      .select("*")
      .eq("term_id", term.id),
    supabase
      .from("term_aliases")
      .select("*")
      .eq("term_id", term.id),
  ]);

  return NextResponse.json({
    ...term,
    definitions: definitionsResult.data ?? [],
    tags: tagsResult.data ?? [],
    aliases: aliasesResult.data ?? [],
  });
}
