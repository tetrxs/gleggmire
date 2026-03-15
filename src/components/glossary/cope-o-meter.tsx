"use client";

interface CopeOMeterProps {
  sum: number;
  count: number;
}

export function CopeOMeter({ sum, count }: CopeOMeterProps) {
  if (count === 0) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium" style={{ color: "var(--color-muted)" }}>
          Cope-O-Meter
        </span>
        <div
          className="h-2 w-full rounded-full"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          <div className="h-full w-0 rounded-full" />
        </div>
        <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>
          Noch keine Bewertungen
        </span>
      </div>
    );
  }

  const average = Math.round(sum / count);
  const clamped = Math.min(100, Math.max(0, average));

  let barColor: string;
  let label: string;
  if (clamped <= 30) {
    barColor = "#22C55E";
    label = "Basiert";
  } else if (clamped <= 70) {
    barColor = "#EAB308";
    label = "Cope";
  } else {
    barColor = "#EF4444";
    label = "Max Cope";
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium" style={{ color: "var(--color-muted)" }}>
          Cope-O-Meter
        </span>
        <span className="text-[10px] tabular-nums" style={{ color: "var(--color-muted)" }}>
          {clamped}% &mdash; {label}
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
}
