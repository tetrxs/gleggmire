"use client";

interface DisputeBannerProps {
  status: string;
  disputeInfo?: string;
}

export function DisputeBanner({ status, disputeInfo }: DisputeBannerProps) {
  if (status !== "disputed") return null;

  return (
    <div className="overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-5 py-3 shadow-md">
      <div className="flex items-center justify-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="text-sm font-bold tracking-wide text-white">
          BESTRITTEN
        </span>
        {disputeInfo && (
          <span className="text-xs font-normal text-white/80">
            — {disputeInfo}
          </span>
        )}
      </div>
    </div>
  );
}
