import type {
  GlossaryTerm,
  TermDefinition,
  TermAlias,
  TermTag,
} from "@/types/database";

export const MOCK_TAGS: TermTag[] = [
  { id: "t1", term_id: "1", tag: "Klassiker" },
  { id: "t2", term_id: "1", tag: "Insider" },
  { id: "t3", term_id: "2", tag: "Essen" },
  { id: "t4", term_id: "2", tag: "Klassiker" },
  { id: "t5", term_id: "3", tag: "Rauchen" },
  { id: "t6", term_id: "3", tag: "Lifestyle" },
  { id: "t7", term_id: "4", tag: "Slang" },
  { id: "t8", term_id: "4", tag: "Insider" },
  { id: "t9", term_id: "5", tag: "Slang" },
  { id: "t10", term_id: "5", tag: "Universell" },
  { id: "t11", term_id: "6", tag: "Insider" },
  { id: "t12", term_id: "6", tag: "Meme" },
];

export const MOCK_ALIASES: TermAlias[] = [
  { id: "a1", term_id: "1", alias: "geglaggmired" },
  { id: "a2", term_id: "1", alias: "glaggmired" },
  { id: "a3", term_id: "2", alias: "Kanackentasche" },
  { id: "a4", term_id: "3", alias: "Lungentorpedo" },
  { id: "a5", term_id: "4", alias: "Snentsch" },
  { id: "a6", term_id: "6", alias: "Glegg-Moment" },
];

export const MOCK_TERMS: GlossaryTerm[] = [
  {
    id: "1",
    slug: "geglaggmirt",
    term: "Geglaggmirt",
    phonetic: "/ɡəˈɡlɛkmɪʁt/",
    word_type: "Adjektiv",
    status: "approved",
    created_by: "user-1",
    created_at: "2025-08-12T14:30:00Z",
    updated_at: "2025-09-01T10:00:00Z",
    is_secret: false,
    verified_by_gleggmire: true,
  },
  {
    id: "2",
    slug: "kanackentasche",
    term: "Kanackentasche",
    phonetic: "/kaˈnakn̩ˌtaʃə/",
    word_type: "Substantiv",
    status: "approved",
    created_by: "user-2",
    created_at: "2025-09-05T18:20:00Z",
    updated_at: "2025-09-10T12:00:00Z",
    is_secret: false,
    verified_by_gleggmire: false,
  },
  {
    id: "3",
    slug: "lungen-torpedo",
    term: "Lungen-Torpedo",
    phonetic: "/ˈlʊŋən tɔʁˈpeːdo/",
    word_type: "Substantiv",
    status: "approved",
    created_by: "user-3",
    created_at: "2025-07-20T09:15:00Z",
    updated_at: "2025-08-15T16:00:00Z",
    is_secret: false,
    verified_by_gleggmire: true,
  },
  {
    id: "4",
    slug: "snench",
    term: "Snench",
    phonetic: "/snɛntʃ/",
    word_type: "Substantiv",
    status: "approved",
    created_by: "user-1",
    created_at: "2025-10-01T20:00:00Z",
    updated_at: "2025-10-05T08:30:00Z",
    is_secret: false,
    verified_by_gleggmire: false,
  },
  {
    id: "5",
    slug: "komplett",
    term: "Komplett",
    phonetic: "/kɔmˈplɛt/",
    word_type: "Adverb",
    status: "approved",
    created_by: "user-4",
    created_at: "2025-06-10T11:00:00Z",
    updated_at: "2025-06-15T14:00:00Z",
    is_secret: false,
    verified_by_gleggmire: true,
  },
  {
    id: "6",
    slug: "auf-glegg",
    term: "Auf Glegg",
    phonetic: "/aʊf ɡlɛk/",
    word_type: "Redewendung",
    status: "pending",
    created_by: "user-5",
    created_at: "2025-11-20T16:45:00Z",
    updated_at: "2025-11-20T16:45:00Z",
    is_secret: false,
    verified_by_gleggmire: false,
  },
];

export const MOCK_DEFINITIONS: TermDefinition[] = [
  {
    id: "d1",
    term_id: "1",
    definition:
      "Zustand, in dem jemand von Gleggmire so hart zerlegt wurde, dass kein Comeback mehr moeglich ist. Wird oft verwendet, wenn jemand in einem Argument oder einer Situation komplett auseinandergenommen wurde.",
    example_sentence: "Bruder, du wurdest gerade komplett geglaggmirt.",
    origin_context: "Entstand aus einem legendaeren Stream-Moment im Sommer 2024.",
    submitted_by: "user-1",
    upvotes: 42,
    downvotes: 3,
    cope_meter_sum: 120,
    cope_meter_count: 5,
  },
  {
    id: "d2",
    term_id: "2",
    definition:
      "Bezeichnung fuer einen Doener oder aehnliche Speisen im Fladenbrot. Von Gleggmire populaer gemacht als liebevolle Bezeichnung fuer sein Lieblingsessen.",
    example_sentence: "Ich geh mir jetzt ne Kanackentasche holen, willst du auch eine?",
    origin_context: "Wurde erstmals in einem IRL-Stream verwendet.",
    submitted_by: "user-2",
    upvotes: 38,
    downvotes: 7,
    cope_meter_sum: 280,
    cope_meter_count: 8,
  },
  {
    id: "d3",
    term_id: "3",
    definition:
      "Scherzhafter Ausdruck fuer eine Zigarette. Betont die zerstoererische Wirkung auf die Lunge mit einer dramatischen Metapher.",
    example_sentence: "Warte kurz, ich zuend mir noch nen Lungen-Torpedo an.",
    origin_context: "Gleggmire benutzt den Begriff regelmaessig waehrend seiner Raucherpausen im Stream.",
    submitted_by: "user-3",
    upvotes: 55,
    downvotes: 2,
    cope_meter_sum: 45,
    cope_meter_count: 3,
  },
  {
    id: "d4",
    term_id: "4",
    definition:
      "Ein Snench ist eine Person, die sich besonders peinlich oder unangenehm verhaelt. Kann sowohl liebevoll als auch beleidigend gemeint sein, je nach Kontext.",
    example_sentence: "Was bist du fuer ein Snench, alter?",
    submitted_by: "user-1",
    upvotes: 29,
    downvotes: 5,
    cope_meter_sum: 350,
    cope_meter_count: 10,
  },
  {
    id: "d5",
    term_id: "5",
    definition:
      "Verstaerkungswort, das in der Gleggmire-Community inflationaer verwendet wird. Ersetzt quasi jedes andere Adverb und drueckt hoechste Intensitaet aus.",
    example_sentence: "Das ist komplett verrueckt, Bruder.",
    origin_context: "Gleggmire verwendet 'komplett' in fast jedem zweiten Satz.",
    submitted_by: "user-4",
    upvotes: 61,
    downvotes: 1,
    cope_meter_sum: 30,
    cope_meter_count: 6,
  },
  {
    id: "d6",
    term_id: "6",
    definition:
      "Wenn etwas 'auf Glegg' passiert, bedeutet das, dass es auf eine besonders chaotische, unterhaltsame oder unerwartete Weise geschieht. Der Glegg-Weg ist immer der unkonventionelle.",
    example_sentence: "Wir machen das auf Glegg — ohne Plan, aber mit Vibes.",
    submitted_by: "user-5",
    upvotes: 15,
    downvotes: 2,
    cope_meter_sum: 180,
    cope_meter_count: 4,
  },
];

// Type used by submit-term-form for fuzzy matching
export interface ExistingTerm {
  id: string;
  term: string;
  slug: string;
  normalized: string;
  aliases: string[];
}

export const MOCK_EXISTING_TERMS: ExistingTerm[] = MOCK_TERMS.map((t) => ({
  id: t.id,
  term: t.term,
  slug: t.slug,
  normalized: t.term.toLowerCase(),
  aliases: (MOCK_ALIASES.filter((a) => a.term_id === t.id)).map((a) => a.alias),
}));

// Aliases for the [slug] detail page
export const glossaryTerms = MOCK_TERMS;
export const termDefinitions = MOCK_DEFINITIONS;
export const termAliases = MOCK_ALIASES;
export const termTags = MOCK_TAGS;
