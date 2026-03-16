// Admin configuration and Glegg Score config

export const ADMIN_DISCORD_IDS: string[] = ["303835609762627586", "777251093884436491", "228533888572588032"];

export function isAdmin(discordId: string): boolean {
  return ADMIN_DISCORD_IDS.includes(discordId);
}

export const GLEGG_SCORE_CONFIG = {
  termCreatedPoints: 15,
  definitionPostedPoints: 10,
  commentPostedPoints: 2,
  definitionVoteMultiplier: 5,
  definitionContextBonus: 5,
  commentAttachmentBonus: 3,
} as const;

// Points awarded per badge type
// Rare/hard badges give more, easy ones give less
export const BADGE_SCORE_VALUES: Record<string, number> = {
  // Easy — first-time achievements
  first_term: 25,
  first_definition: 25,

  // Medium — requires some activity
  commenter: 50,
  anonymous_hero: 50,
  upvote_magnet: 75,

  // Hard — requires dedication
  term_master: 100,
  definition_master: 100,
  cope_lord: 75,
  kek_master: 75,
  ratio_survivor: 100,
  troll_king: 100,

  // Prestige — rare / time-based
  veteran: 150,
  glegg_verified: 250,
  high_score: 200,
} as const;
