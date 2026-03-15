"use client";

interface GleggScoreDisplayProps {
  score: number;
}

interface Tier {
  name: string;
  min: number;
  max: number;
  color: string;
}

const TIERS: Tier[] = [
  { name: "Schleimbeutel", min: 0, max: 99, color: "var(--xp-border-dark)" },
  { name: "Troll-Lehrling", min: 100, max: 499, color: "var(--xp-gruen)" },
  { name: "Glegg-Geselle", min: 500, max: 999, color: "var(--xp-blau-start)" },
  { name: "Lore-Meister", min: 1000, max: 4999, color: "var(--glegg-orange)" },
  {
    name: "Gleggmire-Legende",
    min: 5000,
    max: Infinity,
    color: "#DAA520",
  },
];

function getTier(score: number): Tier {
  return TIERS.find((t) => score >= t.min && score <= t.max) ?? TIERS[0];
}

function getProgress(score: number, tier: Tier): number {
  if (tier.max === Infinity) return 100;
  const range = tier.max - tier.min + 1;
  const progress = score - tier.min;
  return Math.min(100, Math.round((progress / range) * 100));
}

function getNextTier(tier: Tier): Tier | null {
  const idx = TIERS.indexOf(tier);
  if (idx === TIERS.length - 1) return null;
  return TIERS[idx + 1];
}

export function GleggScoreDisplay({ score }: GleggScoreDisplayProps) {
  const tier = getTier(score);
  const progress = getProgress(score, tier);
  const nextTier = getNextTier(tier);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span
          className="xp-text-label font-bold"
          style={{ color: tier.color }}
        >
          {tier.name}
        </span>
        <span
          className="xp-text-label font-bold"
          style={{ color: tier.color }}
        >
          {score.toLocaleString("de-DE")}
        </span>
      </div>

      {/* XP-style progress bar */}
      <div
        className="xp-inset h-4 overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: `repeating-linear-gradient(
              90deg,
              ${tier.color} 0px,
              ${tier.color} 8px,
              transparent 8px,
              transparent 10px
            )`,
          }}
        />
      </div>

      {nextTier && (
        <span
          className="xp-text-label"
          style={{ color: "var(--xp-border-dark)", fontSize: "10px" }}
        >
          Naechster Rang: {nextTier.name} ({nextTier.min.toLocaleString("de-DE")} Punkte)
        </span>
      )}
      {!nextTier && (
        <span
          className="xp-text-label font-bold"
          style={{ color: "#DAA520", fontSize: "10px" }}
        >
          Hoechster Rang erreicht!
        </span>
      )}
    </div>
  );
}
