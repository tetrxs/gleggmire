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
  { name: "Schleimbeutel", min: 0, max: 99, color: "#71717a" },
  { name: "Troll-Lehrling", min: 100, max: 499, color: "#16a34a" },
  { name: "Glegg-Geselle", min: 500, max: 999, color: "#2563eb" },
  { name: "Lore-Meister", min: 1000, max: 4999, color: "#E8593C" },
  { name: "Gleggmire-Legende", min: 5000, max: Infinity, color: "#DAA520" },
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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: tier.color }}>
          {tier.name}
        </span>
        <span className="text-sm font-bold" style={{ color: tier.color }}>
          {score.toLocaleString("de-DE")}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-border)] dark:bg-zinc-700">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: tier.color,
          }}
        />
      </div>

      {nextTier && (
        <span className="text-xs text-[var(--color-muted)]">
          Naechster Rang: {nextTier.name} ({nextTier.min.toLocaleString("de-DE")} Punkte)
        </span>
      )}
      {!nextTier && (
        <span className="text-xs font-bold" style={{ color: "#DAA520" }}>
          Hoechster Rang erreicht!
        </span>
      )}
    </div>
  );
}
