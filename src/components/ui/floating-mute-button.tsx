"use client";

import { useYouTubeMute } from "@/lib/youtube-mute-context";

export function FloatingMuteButton() {
  const { globalMuted, toggleGlobalMute } = useYouTubeMute();

  return (
    <button
      onClick={toggleGlobalMute}
      className="fixed bottom-32 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all md:bottom-[72px]"
      style={{
        backgroundColor: globalMuted ? "var(--color-text)" : "#E8593C",
        color: globalMuted ? "var(--color-bg)" : "white",
        border: "2px solid var(--color-border)",
      }}
      aria-label={globalMuted ? "Ton einschalten" : "Ton ausschalten"}
      title={globalMuted ? "Ton einschalten" : "Ton ausschalten"}
    >
      {globalMuted ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
