import { GLEGG_SCORE_CONFIG, BADGE_SCORE_VALUES } from "@/lib/constants/admin";

// Interfaces for the pure calculation function

export interface ScoreableDefinition {
  status: "pending" | "approved" | "rejected";
  upvotes: number;
  downvotes: number;
  origin_context?: string | null;
}

export interface ScoreableComment {
  attachment_type?: string | null;
}

export interface GleggScoreInput {
  approvedTermCount: number;
  definitions: ScoreableDefinition[];
  comments: ScoreableComment[];
  badges: string[];
}

/**
 * Calculate a user's Glegg-Score from activity data.
 * Pure function — deterministic, no side effects.
 */
export function calculateGleggScore(input: GleggScoreInput): number {
  const { approvedTermCount, definitions, comments, badges } = input;
  let total = 0;

  // Base points for approved terms
  total += approvedTermCount * GLEGG_SCORE_CONFIG.termCreatedPoints;

  // Points from definitions (only approved ones)
  const approved = definitions.filter((d) => d.status === "approved");
  for (const def of approved) {
    // Base points for posting a definition
    total += GLEGG_SCORE_CONFIG.definitionPostedPoints;

    // Vote balance: net votes * multiplier (can be negative)
    const netVotes = def.upvotes - def.downvotes;
    total += netVotes * GLEGG_SCORE_CONFIG.definitionVoteMultiplier;

    // Bonus for providing origin context
    if (def.origin_context && def.origin_context.trim() !== "") {
      total += GLEGG_SCORE_CONFIG.definitionContextBonus;
    }
  }

  // Points from comments
  for (const comment of comments) {
    // Base points for posting a comment
    total += GLEGG_SCORE_CONFIG.commentPostedPoints;

    // Bonus for attaching media
    if (comment.attachment_type) {
      total += GLEGG_SCORE_CONFIG.commentAttachmentBonus;
    }
  }

  // Badge bonuses
  for (const badge of badges) {
    total += BADGE_SCORE_VALUES[badge] ?? 0;
  }

  return Math.max(0, Math.round(total));
}

/**
 * Compute score from pre-aggregated database components (used for batch leaderboard).
 */
export interface ScoreComponents {
  approved_term_count: number;
  approved_def_count: number;
  def_vote_sum: number;
  def_context_count: number;
  comment_count: number;
  comment_attachment_count: number;
}

export function computeScoreFromComponents(
  row: ScoreComponents,
  badges: string[],
): number {
  let total = 0;

  total += row.approved_term_count * GLEGG_SCORE_CONFIG.termCreatedPoints;
  total += row.approved_def_count * GLEGG_SCORE_CONFIG.definitionPostedPoints;
  total += row.def_vote_sum * GLEGG_SCORE_CONFIG.definitionVoteMultiplier;
  total += row.def_context_count * GLEGG_SCORE_CONFIG.definitionContextBonus;
  total += row.comment_count * GLEGG_SCORE_CONFIG.commentPostedPoints;
  total += row.comment_attachment_count * GLEGG_SCORE_CONFIG.commentAttachmentBonus;

  for (const badge of badges) {
    total += BADGE_SCORE_VALUES[badge] ?? 0;
  }

  return Math.max(0, Math.round(total));
}

// Tier system

interface GleggScoreTier {
  name: string;
  color: string;
}

const TIERS: { name: string; min: number; color: string }[] = [
  { name: "Schleimbeutel", min: 0, color: "#71717a" },
  { name: "Troll-Lehrling", min: 100, color: "#16a34a" },
  { name: "Glegg-Geselle", min: 500, color: "#2563eb" },
  { name: "Lore-Meister", min: 1000, color: "#E8593C" },
  { name: "Gleggmire-Legende", min: 5000, color: "#DAA520" },
];

export function getGleggScoreTier(score: number): GleggScoreTier {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (score >= t.min) tier = t;
  }
  return { name: tier.name, color: tier.color };
}
