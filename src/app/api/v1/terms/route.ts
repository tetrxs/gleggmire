import { NextRequest, NextResponse } from "next/server";

// Mock data for development - will be replaced with Supabase queries
const MOCK_TERMS = [
  {
    id: "1",
    slug: "geglaggmirt",
    term: "Geglaggmirt",
    phonetic: "/ge.glak.mirt/",
    word_type: "Verb (Partizip II)",
    status: "approved" as const,
    created_at: "2025-01-15T12:00:00Z",
    verified_by_gleggmire: true,
  },
  {
    id: "2",
    slug: "copium",
    term: "Copium",
    phonetic: "/ko:.pi.um/",
    word_type: "Nomen",
    status: "approved" as const,
    created_at: "2025-02-01T10:30:00Z",
    verified_by_gleggmire: false,
  },
  {
    id: "3",
    slug: "kekw",
    term: "KEKW",
    word_type: "Emote / Interjektion",
    status: "approved" as const,
    created_at: "2025-02-10T08:15:00Z",
    verified_by_gleggmire: false,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const search = searchParams.get("search")?.toLowerCase();

  let filtered = MOCK_TERMS;

  if (search) {
    filtered = MOCK_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(search) ||
        t.slug.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const terms = filtered.slice(start, start + limit);

  return NextResponse.json({
    terms,
    total,
    page,
    limit,
  });
}
