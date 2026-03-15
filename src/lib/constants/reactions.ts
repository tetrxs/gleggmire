// Community reaction types for comments

import type { ReactionType } from "@/types/database";

export interface ReactionDefinition {
  type: ReactionType;
  label: string;
  emoji: string;
  description: string;
}

export const REACTIONS: ReactionDefinition[] = [
  {
    type: "W",
    label: "W",
    emoji: "\uD83C\uDFC6",
    description: "Win - Ehrenmann-Moment",
  },
  {
    type: "L",
    label: "L",
    emoji: "\uD83D\uDCA9",
    description: "L - Peinlicher Moment",
  },
  {
    type: "Ratio",
    label: "Ratio",
    emoji: "\uD83D\uDCC9",
    description: "Ratio - Gegenargument staerker",
  },
  {
    type: "Cope",
    label: "Cope",
    emoji: "\uD83E\uDE96",
    description: "Cope - Harter Cope-Moment",
  },
  {
    type: "Seethe",
    label: "Seethe",
    emoji: "\uD83D\uDE24",
    description: "Seethe - Salzig und wuetend",
  },
  {
    type: "Geglaggmirt",
    label: "Geglaeggmirt",
    emoji: "\uD83E\uDD21",
    description: "Geglaeggmirt - Peak Gleggmire Moment",
  },
  {
    type: "Kek",
    label: "Kek",
    emoji: "\uD83D\uDE02",
    description: "Kek - Unironisch lustig",
  },
] as const;

export const REACTION_TYPES: ReactionType[] = REACTIONS.map((r) => r.type);

export function getReactionByType(
  type: ReactionType
): ReactionDefinition | undefined {
  return REACTIONS.find((r) => r.type === type);
}
