import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { apiRateLimit, checkRateLimit } from "@/lib/rate-limit";

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
    query = query.ilike("term", `%${search}%`);
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
