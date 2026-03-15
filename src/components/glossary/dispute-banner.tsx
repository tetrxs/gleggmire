"use client";

interface DisputeBannerProps {
  status: string;
  disputeInfo?: string;
}

export function DisputeBanner({ status, disputeInfo }: DisputeBannerProps) {
  if (status !== "disputed") return null;

  return (
    <div
      className="xp-raised-strong animate-pulse px-4 py-2 text-center font-bold text-white"
      style={{
        backgroundColor: "var(--xp-fehler-rot)",
        fontSize: "14px",
        letterSpacing: "2px",
      }}
    >
      [BESTRITTEN]
      {disputeInfo && (
        <span
          className="ml-2 font-normal"
          style={{ fontSize: "11px", letterSpacing: "normal" }}
        >
          — {disputeInfo}
        </span>
      )}
    </div>
  );
}
