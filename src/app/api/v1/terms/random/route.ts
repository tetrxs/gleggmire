import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Fetch a batch of approved, non-secret term IDs and pick one at random
  const { data: terms, error } = await supabase
    .from("glossary_terms")
    .select("id")
    .eq("status", "approved")
    .eq("is_secret", false)
    .limit(100);

  if (error || !terms || terms.length === 0) {
    return NextResponse.json(
      { error: "No terms available" },
      { status: 404 }
    );
  }

  const randomTerm = terms[Math.floor(Math.random() * terms.length)];

  // Fetch the full term plus related data
  const [termResult, definitionsResult, tagsResult, aliasesResult] = await Promise.all([
    supabase
      .from("glossary_terms")
      .select("*")
      .eq("id", randomTerm.id)
      .single(),
    supabase
      .from("term_definitions")
      .select("*")
      .eq("term_id", randomTerm.id),
    supabase
      .from("term_tags")
      .select("*")
      .eq("term_id", randomTerm.id),
    supabase
      .from("term_aliases")
      .select("*")
      .eq("term_id", randomTerm.id),
  ]);

  if (termResult.error || !termResult.data) {
    return NextResponse.json(
      { error: "Failed to fetch term details" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ...termResult.data,
    definitions: definitionsResult.data ?? [],
    tags: tagsResult.data ?? [],
    aliases: aliasesResult.data ?? [],
  });
}
