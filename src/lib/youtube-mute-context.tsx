"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface YouTubeMuteContextValue {
  globalMuted: boolean;
  toggleGlobalMute: () => void;
}

const YouTubeMuteContext = createContext<YouTubeMuteContextValue>({
  globalMuted: true,
  toggleGlobalMute: () => {},
});

export function YouTubeMuteProvider({ children }: { children: React.ReactNode }) {
  const [globalMuted, setGlobalMuted] = useState(true);
  const toggleGlobalMute = useCallback(() => setGlobalMuted((m) => !m), []);

  return (
    <YouTubeMuteContext.Provider value={{ globalMuted, toggleGlobalMute }}>
      {children}
    </YouTubeMuteContext.Provider>
  );
}

export function useYouTubeMute() {
  return useContext(YouTubeMuteContext);
}
