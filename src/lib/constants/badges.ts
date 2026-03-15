// Badge definitions for the gleggmire.net community

export interface BadgeDefinition {
  type: string;
  name: string;
  emoji: string;
  description: string;
  condition: string;
}

export const BADGES: BadgeDefinition[] = [
  {
    type: "first_term",
    name: "Wortschmied",
    emoji: "\u2694\uFE0F",
    description: "Hat den ersten Begriff eingereicht",
    condition: "Submit your first glossary term",
  },
  {
    type: "term_master",
    name: "Lexikon-Lord",
    emoji: "\uD83D\uDCD6",
    description: "10 genehmigte Begriffe eingereicht",
    condition: "Have 10 terms approved",
  },
  {
    type: "first_clip",
    name: "Clip-Chimp",
    emoji: "\uD83C\uDFAC",
    description: "Hat den ersten Clip eingereicht",
    condition: "Submit your first clip",
  },
  {
    type: "clip_hoarder",
    name: "Clip-Hoarder",
    emoji: "\uD83D\uDCFC",
    description: "25 Clips eingereicht",
    condition: "Submit 25 clips",
  },
  {
    type: "first_definition",
    name: "Erklaerbar",
    emoji: "\uD83D\uDCA1",
    description: "Erste Definition geschrieben",
    condition: "Submit your first definition",
  },
  {
    type: "upvote_magnet",
    name: "Upvote-Magnet",
    emoji: "\u2B06\uFE0F",
    description: "100 Upvotes auf eigene Inhalte erhalten",
    condition: "Receive 100 total upvotes on your content",
  },
  {
    type: "commenter",
    name: "Kommentar-Krieger",
    emoji: "\uD83D\uDCAC",
    description: "50 Kommentare geschrieben",
    condition: "Post 50 comments",
  },
  {
    type: "troll_king",
    name: "Troll-Koenig",
    emoji: "\uD83D\uDC51",
    description: "Meister des gepflegten Trollens",
    condition: "Receive 50 reactions of any type on comments",
  },
  {
    type: "cope_lord",
    name: "Cope-Lord",
    emoji: "\uD83E\uDE96",
    description: "Der Cope ist stark in diesem",
    condition: "Receive 25 Cope reactions",
  },
  {
    type: "ratio_survivor",
    name: "Ratio-Ueberlebender",
    emoji: "\uD83D\uDC80",
    description: "Hat ein Ratio ueberlebt und trotzdem weitergemacht",
    condition: "Receive 10 Ratio reactions and still post",
  },
  {
    type: "glegg_verified",
    name: "Gleggmire-Verified",
    emoji: "\u2705",
    description: "Von Gleggmire persoenlich verifiziert",
    condition: "Have a term verified by Gleggmire",
  },
  {
    type: "veteran",
    name: "Urgestein",
    emoji: "\uD83E\uDEA8",
    description: "Seit ueber einem Jahr dabei",
    condition: "Be a member for over 1 year",
  },
  {
    type: "linker",
    name: "Verknuepfer",
    emoji: "\uD83D\uDD17",
    description: "10 Clip-Term-Verknuepfungen erstellt",
    condition: "Create 10 clip-term links",
  },
  {
    type: "high_score",
    name: "Glegg-Score-Legende",
    emoji: "\uD83C\uDFC6",
    description: "Glegg-Score ueber 1000",
    condition: "Reach a Glegg Score of 1000 or more",
  },
  {
    type: "anonymous_hero",
    name: "Anonymer Held",
    emoji: "\uD83E\uDD78",
    description: "25 anonyme Kommentare geschrieben",
    condition: "Post 25 anonymous comments",
  },
  {
    type: "kek_master",
    name: "Kek-Meister",
    emoji: "\uD83D\uDE02",
    description: "25 Kek-Reaktionen erhalten",
    condition: "Receive 25 Kek reactions",
  },
] as const;

export type BadgeType = (typeof BADGES)[number]["type"];

export function getBadgeByType(type: string): BadgeDefinition | undefined {
  return BADGES.find((badge) => badge.type === type);
}
