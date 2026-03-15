/** Design system color constants for gleggmire.net */

export const COLORS = {
  light: {
    /** Off-white background */
    bg: "#FAFAF9",
    /** White surface (cards, modals) */
    surface: "#FFFFFF",
    /** Primary text */
    text: "#1A1A1A",
    /** Muted / secondary text */
    textMuted: "#6B7280",
    /** Border color */
    border: "#E5E5E5",
  },
  dark: {
    /** Near-black background */
    bg: "#0F0F0F",
    /** Dark surface (cards, modals) */
    surface: "#1A1A1A",
    /** Primary text */
    text: "#FAFAF9",
    /** Muted / secondary text */
    textMuted: "#9CA3AF",
    /** Border color */
    border: "#2A2A2A",
  },
  /** Glegg brand accent (same in both modes) */
  accent: "#E8593C",
  /** Accent hover state */
  accentHover: "#D14830",
  /** Semantic: success */
  success: "#22C55E",
  /** Semantic: warning */
  warning: "#F59E0B",
  /** Semantic: error / danger */
  error: "#EF4444",
} as const;

export type ColorMode = "light" | "dark";
