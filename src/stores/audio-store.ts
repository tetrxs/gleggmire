"use client";

import { create } from "zustand";

interface AudioState {
  isMuted: boolean;
  isFirstVisit: boolean;
  toggleMute: () => void;
  initFromStorage: () => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isMuted: true,
  isFirstVisit: true,

  toggleMute: () =>
    set((state) => {
      const newMuted = !state.isMuted;
      if (typeof window !== "undefined") {
        localStorage.setItem("glegg_muted", JSON.stringify(newMuted));
        localStorage.setItem("glegg_first_visit", "false");
      }
      return { isMuted: newMuted, isFirstVisit: false };
    }),

  initFromStorage: () => {
    if (typeof window === "undefined") return;

    const firstVisit = localStorage.getItem("glegg_first_visit");
    if (firstVisit === null) {
      // First visit: always muted
      localStorage.setItem("glegg_first_visit", "true");
      set({ isMuted: true, isFirstVisit: true });
      return;
    }

    const stored = localStorage.getItem("glegg_muted");
    set({
      isMuted: stored ? JSON.parse(stored) : true,
      isFirstVisit: false,
    });
  },
}));
