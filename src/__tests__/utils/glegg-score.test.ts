/**
 * Unit tests for Glegg-Score calculation utilities.
 *
 * These are pure function tests -- no database or network required.
 * Run with: npx vitest run src/__tests__/utils/glegg-score.test.ts
 */

import { calculateGleggScore, computeScoreFromComponents, getGleggScoreTier } from "@/lib/utils/glegg-score";
import type { GleggScoreInput, ScoreableDefinition, ScoreableComment, ScoreComponents } from "@/lib/utils/glegg-score";
import { GLEGG_SCORE_CONFIG, BADGE_SCORE_VALUES } from "@/lib/constants/admin";

function makeDef(
  upvotes: number,
  downvotes: number,
  status: "approved" | "pending" | "rejected" = "approved",
  origin_context?: string | null,
): ScoreableDefinition {
  return { status, upvotes, downvotes, origin_context };
}

function makeComment(attachment_type?: string | null): ScoreableComment {
  return { attachment_type };
}

function makeInput(partial: Partial<GleggScoreInput> = {}): GleggScoreInput {
  return {
    approvedTermCount: 0,
    definitions: [],
    comments: [],
    badges: [],
    ...partial,
  };
}

// ---------------------------------------------------------------------------
// calculateGleggScore
// ---------------------------------------------------------------------------
describe("calculateGleggScore", () => {
  it("should return 0 for empty input", () => {
    expect(calculateGleggScore(makeInput())).toBe(0);
  });

  // --- Terms ---
  it("should award base points for approved terms", () => {
    const result = calculateGleggScore(makeInput({ approvedTermCount: 3 }));
    expect(result).toBe(3 * GLEGG_SCORE_CONFIG.termCreatedPoints);
  });

  // --- Definitions ---
  it("should award base points for approved definitions", () => {
    const defs = [makeDef(0, 0), makeDef(0, 0)];
    const result = calculateGleggScore(makeInput({ definitions: defs }));
    expect(result).toBe(2 * GLEGG_SCORE_CONFIG.definitionPostedPoints);
  });

  it("should ignore pending and rejected definitions", () => {
    const defs = [makeDef(10, 0, "pending"), makeDef(10, 0, "rejected")];
    expect(calculateGleggScore(makeInput({ definitions: defs }))).toBe(0);
  });

  it("should add positive vote balance", () => {
    // 5 up, 1 down => net 4, score = base + 4 * multiplier
    const defs = [makeDef(5, 1)];
    const expected =
      GLEGG_SCORE_CONFIG.definitionPostedPoints +
      4 * GLEGG_SCORE_CONFIG.definitionVoteMultiplier;
    expect(calculateGleggScore(makeInput({ definitions: defs }))).toBe(expected);
  });

  it("should subtract negative vote balance", () => {
    // 1 up, 5 down => net -4, score = base + (-4) * multiplier
    const defs = [makeDef(1, 5)];
    const raw =
      GLEGG_SCORE_CONFIG.definitionPostedPoints +
      (-4) * GLEGG_SCORE_CONFIG.definitionVoteMultiplier;
    // Floor at 0
    expect(calculateGleggScore(makeInput({ definitions: defs }))).toBe(Math.max(0, raw));
  });

  it("should award bonus for definition with origin_context", () => {
    const defs = [makeDef(0, 0, "approved", "https://youtube.com/watch?v=abc")];
    const expected =
      GLEGG_SCORE_CONFIG.definitionPostedPoints +
      GLEGG_SCORE_CONFIG.definitionContextBonus;
    expect(calculateGleggScore(makeInput({ definitions: defs }))).toBe(expected);
  });

  it("should not award origin bonus for null or empty context", () => {
    const defs = [
      makeDef(0, 0, "approved", null),
      makeDef(0, 0, "approved", ""),
      makeDef(0, 0, "approved", "   "),
    ];
    // 3 defs, base only, no context bonus
    const expected = 3 * GLEGG_SCORE_CONFIG.definitionPostedPoints;
    expect(calculateGleggScore(makeInput({ definitions: defs }))).toBe(expected);
  });

  // --- Comments ---
  it("should award base points for comments", () => {
    const comments = [makeComment(), makeComment(), makeComment()];
    const result = calculateGleggScore(makeInput({ comments }));
    expect(result).toBe(3 * GLEGG_SCORE_CONFIG.commentPostedPoints);
  });

  it("should award bonus for comments with attachments", () => {
    const comments = [makeComment("youtube"), makeComment("image")];
    const expected =
      2 * GLEGG_SCORE_CONFIG.commentPostedPoints +
      2 * GLEGG_SCORE_CONFIG.commentAttachmentBonus;
    expect(calculateGleggScore(makeInput({ comments }))).toBe(expected);
  });

  it("should not award attachment bonus for null attachment_type", () => {
    const comments = [makeComment(null), makeComment(undefined)];
    const expected = 2 * GLEGG_SCORE_CONFIG.commentPostedPoints;
    expect(calculateGleggScore(makeInput({ comments }))).toBe(expected);
  });

  // --- Badges ---
  it("should award badge bonus points", () => {
    const badges = ["first_term", "veteran"];
    const expected =
      (BADGE_SCORE_VALUES["first_term"] ?? 0) +
      (BADGE_SCORE_VALUES["veteran"] ?? 0);
    expect(calculateGleggScore(makeInput({ badges }))).toBe(expected);
  });

  it("should ignore unknown badge types", () => {
    const badges = ["nonexistent_badge"];
    expect(calculateGleggScore(makeInput({ badges }))).toBe(0);
  });

  // --- Combined ---
  it("should combine all score sources correctly", () => {
    const input: GleggScoreInput = {
      approvedTermCount: 2,
      definitions: [
        makeDef(3, 1, "approved", "https://youtube.com/watch?v=x"),
        makeDef(0, 0, "approved"),
        makeDef(5, 0, "pending"), // ignored
      ],
      comments: [
        makeComment("image"),
        makeComment(null),
      ],
      badges: ["first_term"],
    };

    const expected =
      // Terms: 2 * 15 = 30
      2 * GLEGG_SCORE_CONFIG.termCreatedPoints +
      // Def 1: base 10 + net 2 * 5 + context 5 = 25
      GLEGG_SCORE_CONFIG.definitionPostedPoints +
      2 * GLEGG_SCORE_CONFIG.definitionVoteMultiplier +
      GLEGG_SCORE_CONFIG.definitionContextBonus +
      // Def 2: base 10
      GLEGG_SCORE_CONFIG.definitionPostedPoints +
      // Comment 1: base 2 + attachment 3 = 5
      GLEGG_SCORE_CONFIG.commentPostedPoints +
      GLEGG_SCORE_CONFIG.commentAttachmentBonus +
      // Comment 2: base 2
      GLEGG_SCORE_CONFIG.commentPostedPoints +
      // Badge: first_term = 25
      BADGE_SCORE_VALUES["first_term"];

    expect(calculateGleggScore(input)).toBe(expected);
  });

  // --- Floor ---
  it("should clamp score to minimum 0", () => {
    // Heavily downvoted definition
    const defs = [makeDef(0, 100)];
    const result = calculateGleggScore(makeInput({ definitions: defs }));
    expect(result).toBe(0);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  // --- Integer ---
  it("should always return an integer", () => {
    const inputs = [
      makeInput(),
      makeInput({ approvedTermCount: 7, definitions: [makeDef(3, 1)], comments: [makeComment("gif")] }),
      makeInput({ badges: ["first_term", "veteran", "glegg_verified"] }),
    ];
    for (const input of inputs) {
      expect(Number.isInteger(calculateGleggScore(input))).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// computeScoreFromComponents
// ---------------------------------------------------------------------------
describe("computeScoreFromComponents", () => {
  function makeComponents(partial: Partial<ScoreComponents> = {}): ScoreComponents {
    return {
      approved_term_count: 0,
      approved_def_count: 0,
      def_vote_sum: 0,
      def_context_count: 0,
      comment_count: 0,
      comment_attachment_count: 0,
      ...partial,
    };
  }

  it("should return 0 for empty components and no badges", () => {
    expect(computeScoreFromComponents(makeComponents(), [])).toBe(0);
  });

  it("should compute the same as calculateGleggScore for equivalent input", () => {
    const components = makeComponents({
      approved_term_count: 3,
      approved_def_count: 2,
      def_vote_sum: 10,
      def_context_count: 1,
      comment_count: 5,
      comment_attachment_count: 2,
    });
    const badges = ["first_term"];

    const expected =
      3 * GLEGG_SCORE_CONFIG.termCreatedPoints +
      2 * GLEGG_SCORE_CONFIG.definitionPostedPoints +
      10 * GLEGG_SCORE_CONFIG.definitionVoteMultiplier +
      1 * GLEGG_SCORE_CONFIG.definitionContextBonus +
      5 * GLEGG_SCORE_CONFIG.commentPostedPoints +
      2 * GLEGG_SCORE_CONFIG.commentAttachmentBonus +
      BADGE_SCORE_VALUES["first_term"];

    expect(computeScoreFromComponents(components, badges)).toBe(expected);
  });

  it("should clamp to 0 for negative sums", () => {
    const components = makeComponents({ def_vote_sum: -1000 });
    expect(computeScoreFromComponents(components, [])).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getGleggScoreTier
// ---------------------------------------------------------------------------
describe("getGleggScoreTier", () => {
  it("should return 'Schleimbeutel' for score 0", () => {
    const tier = getGleggScoreTier(0);
    expect(tier.name).toBe("Schleimbeutel");
    expect(tier.color).toBe("#71717a");
  });

  it("should return 'Schleimbeutel' for negative score", () => {
    const tier = getGleggScoreTier(-50);
    expect(tier.name).toBe("Schleimbeutel");
  });

  it("should return 'Troll-Lehrling' at score 100", () => {
    const tier = getGleggScoreTier(100);
    expect(tier.name).toBe("Troll-Lehrling");
    expect(tier.color).toBe("#16a34a");
  });

  it("should return 'Troll-Lehrling' at score 499", () => {
    const tier = getGleggScoreTier(499);
    expect(tier.name).toBe("Troll-Lehrling");
  });

  it("should return 'Glegg-Geselle' at score 500", () => {
    const tier = getGleggScoreTier(500);
    expect(tier.name).toBe("Glegg-Geselle");
    expect(tier.color).toBe("#2563eb");
  });

  it("should return 'Glegg-Geselle' at score 999", () => {
    const tier = getGleggScoreTier(999);
    expect(tier.name).toBe("Glegg-Geselle");
  });

  it("should return 'Lore-Meister' at score 1000", () => {
    const tier = getGleggScoreTier(1000);
    expect(tier.name).toBe("Lore-Meister");
    expect(tier.color).toBe("#E8593C");
  });

  it("should return 'Lore-Meister' at score 4999", () => {
    const tier = getGleggScoreTier(4999);
    expect(tier.name).toBe("Lore-Meister");
  });

  it("should return 'Gleggmire-Legende' at score 5000", () => {
    const tier = getGleggScoreTier(5000);
    expect(tier.name).toBe("Gleggmire-Legende");
    expect(tier.color).toBe("#DAA520");
  });

  it("should return 'Gleggmire-Legende' for very high score", () => {
    const tier = getGleggScoreTier(999999);
    expect(tier.name).toBe("Gleggmire-Legende");
  });

  it("should return 'Schleimbeutel' at score 99 (just below Troll-Lehrling)", () => {
    const tier = getGleggScoreTier(99);
    expect(tier.name).toBe("Schleimbeutel");
  });

  it("should always return name and color properties", () => {
    for (const score of [-100, 0, 50, 100, 500, 1000, 5000, 10000]) {
      const tier = getGleggScoreTier(score);
      expect(tier).toHaveProperty("name");
      expect(tier).toHaveProperty("color");
      expect(typeof tier.name).toBe("string");
      expect(typeof tier.color).toBe("string");
    }
  });
});
