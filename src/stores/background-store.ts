"use client";

import { create } from "zustand";

export type BackgroundOption =
  | "default"
  | "bliss"
  | "gta-sky"
  | "tiled";

interface BackgroundState {
  background: BackgroundOption;
  setBackground: (bg: BackgroundOption) => void;
  initFromStorage: () => void;
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  background: "default",

  setBackground: (bg) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("glegg_background", bg);
    }
    set({ background: bg });
  },

  initFromStorage: () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("glegg_background") as BackgroundOption;
    if (stored) {
      set({ background: stored });
    }
  },
}));
