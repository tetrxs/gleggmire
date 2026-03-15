import { NextResponse } from "next/server";

// Mock data for development - will be replaced with Supabase queries
const MOCK_TERMS = [
  {
    id: "1",
    slug: "geglaggmirt",
    term: "Geglaggmirt",
    phonetic: "/ge.glak.mirt/",
    word_type: "Verb (Partizip II)",
    status: "approved",
    verified_by_gleggmire: true,
    definitions: [
      {
        id: "d1",
        definition:
          "Zustand, in dem man von Gleggmire verbal zerstoert wurde.",
        example_sentence:
          "Der Chatter wurde live geglaggmirt.",
        upvotes: 42,
        downvotes: 3,
        cope_meter_avg: 8.5,
      },
    ],
    tags: ["Gleggmire-Original", "Verb"],
    aliases: ["geglagged"],
  },
  {
    id: "2",
    slug: "copium",
    term: "Copium",
    phonetic: "/ko:.pi.um/",
    word_type: "Nomen",
    status: "approved",
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
    tags: ["Twitch-Kultur"],
    aliases: ["cope"],
  },
  {
    id: "3",
    slug: "kekw",
    term: "KEKW",
    word_type: "Emote / Interjektion",
    status: "approved",
    verified_by_gleggmire: false,
    definitions: [
      {
        id: "d3",
        definition:
          "Emote fuer herzhaftes Lachen.",
        example_sentence: "KEKW er hat es wirklich gesagt",
        upvotes: 28,
        downvotes: 1,
        cope_meter_avg: 3.0,
      },
    ],
    tags: ["Emote", "Twitch-Kultur"],
    aliases: [],
  },
];

export async function GET() {
  const randomIndex = Math.floor(Math.random() * MOCK_TERMS.length);
  const term = MOCK_TERMS[randomIndex];

  return NextResponse.json(term);
}
