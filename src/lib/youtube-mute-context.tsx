"use client";

import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "glegg_yt_muted";

interface YouTubeMuteContextValue {
  globalMuted: boolean;
  toggleGlobalMute: () => void;
}

const YouTubeMuteContext = createContext<YouTubeMuteContextValue>({
  globalMuted: true,
  toggleGlobalMute: () => {},
});

function readStoredMute(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "false") return false;
    return true;
  } catch {
    return true;
  }
}

export function YouTubeMuteProvider({ children }: { children: React.ReactNode }) {
  const [globalMuted, setGlobalMuted] = useState(readStoredMute);
  const toggleGlobalMute = useCallback(() => {
    setGlobalMuted((m) => {
      const next = !m;
      try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <YouTubeMuteContext.Provider value={{ globalMuted, toggleGlobalMute }}>
      {children}
    </YouTubeMuteContext.Provider>
  );
}

export function useYouTubeMute() {
  return useContext(YouTubeMuteContext);
}
