// Admin configuration and Glegg Score point values

export const ADMIN_DISCORD_IDS: string[] = ["303835609762627586"];

export function isAdmin(discordId: string): boolean {
  return ADMIN_DISCORD_IDS.includes(discordId);
}

export const GLEGG_SCORE_VALUES = {
  // Positive actions
  termSubmitted: 10,
  termApproved: 25,
  definitionSubmitted: 5,
  definitionUpvoted: 2,
  clipSubmitted: 10,
  clipUpvoted: 2,
  clipTermLinked: 5,
  commentUpvoted: 1,
  reactionReceived: 1,
  badgeEarned: 15,
  verifiedByGleggmire: 100,

  // Negative actions
  definitionDownvoted: -1,
  commentDownvoted: -1,
  termDisputed: -5,
  bannedPenalty: -50,
} as const;

export type GleggScoreAction = keyof typeof GLEGG_SCORE_VALUES;
