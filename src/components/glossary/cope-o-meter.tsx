"use client";

interface CopeOMeterProps {
  sum: number;
  count: number;
}

export function CopeOMeter({ sum, count }: CopeOMeterProps) {
  if (count === 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className="xp-text-label font-bold">Cope-O-Meter</span>
        <div
          className="xp-inset px-2 py-1"
          style={{ backgroundColor: "#F1EFE2" }}
        >
          <span
            className="text-[10px] italic"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Noch keine Bewertungen
          </span>
        </div>
      </div>
    );
  }

  const average = Math.round(sum / count);
  const clamped = Math.min(100, Math.max(0, average));

  let barColor: string;
  let label: string;
  if (clamped <= 30) {
    barColor = "var(--xp-gruen)";
    label = "Basiert";
  } else if (clamped <= 70) {
    barColor = "#D4A017";
    label = "Cope";
  } else {
    barColor = "var(--xp-fehler-rot)";
    label = "Max Cope";
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="xp-text-label font-bold">Cope-O-Meter</span>
        <span className="text-[10px]" style={{ color: "var(--xp-border-dark)" }}>
          {clamped}% &mdash; {label}
        </span>
      </div>
      <div
        className="xp-inset h-[14px] overflow-hidden"
        style={{ backgroundColor: "#F1EFE2" }}
      >
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${clamped}%`,
            backgroundColor: barColor,
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
          }}
        />
      </div>
    </div>
  );
}
