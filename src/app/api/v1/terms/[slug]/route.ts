import { NextRequest, NextResponse } from "next/server";

// Mock data for development - will be replaced with Supabase queries
const MOCK_TERM_DETAILS: Record<string, object> = {
  geglaggmirt: {
    id: "1",
    slug: "geglaggmirt",
    term: "Geglaggmirt",
    phonetic: "/ge.glak.mirt/",
    word_type: "Verb (Partizip II)",
    status: "approved",
    created_at: "2025-01-15T12:00:00Z",
    verified_by_gleggmire: true,
    definitions: [
      {
        id: "d1",
        definition:
          "Zustand, in dem man von Gleggmire verbal zerstoert wurde. Absolute Hilflosigkeit nach einem rhetorischen Takedown.",
        example_sentence:
          "Der Chatter wurde live geglaggmirt und hat danach 3 Tage nicht mehr geschrieben.",
        upvotes: 42,
        downvotes: 3,
        cope_meter_avg: 8.5,
      },
    ],
    tags: ["Gleggmire-Original", "Verb", "Klassiker"],
    aliases: ["geglagged", "glaggmired"],
  },
  copium: {
    id: "2",
    slug: "copium",
    term: "Copium",
    phonetic: "/ko:.pi.um/",
    word_type: "Nomen",
    status: "approved",
    created_at: "2025-02-01T10:30:00Z",
    verified_by_gleggmire: false,
    definitions: [
      {
        id: "d2",
        definition:
          "Fiktive Substanz, die man inhaliert, wenn man mit der Realitaet nicht klarkommt.",
        example_sentence: "Chat ist wieder am Copium inhalieren.",
        upvotes: 35,
        downvotes: 2,
        cope_meter_avg: 9.2,
      },
    ],
    tags: ["Twitch-Kultur", "Emote"],
    aliases: ["cope"],
  },
  kekw: {
    id: "3",
    slug: "kekw",
    term: "KEKW",
    word_type: "Emote / Interjektion",
    status: "approved",
    created_at: "2025-02-10T08:15:00Z",
    verified_by_gleggmire: false,
    definitions: [
      {
        id: "d3",
        definition:
          "Emote fuer herzhaftes Lachen. Basiert auf dem spanischen Comedian El Risitas.",
        example_sentence: "KEKW er hat es wirklich gesagt",
        upvotes: 28,
        downvotes: 1,
        cope_meter_avg: 3.0,
      },
    ],
    tags: ["Emote", "Twitch-Kultur"],
    aliases: [],
  },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const term = MOCK_TERM_DETAILS[slug.toLowerCase()];

  if (!term) {
    return NextResponse.json(
      { error: "Term not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(term);
}
