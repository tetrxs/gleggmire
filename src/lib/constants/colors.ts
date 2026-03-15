/** Windows XP "Luna" color constants for gleggmire.net */

export const XP_COLORS = {
  /** XP-Blau gradient start */
  blauStart: "#1F4ECC",
  /** XP-Blau gradient end */
  blauEnd: "#3A92D8",
  /** XP-Gruen (Start button style) */
  gruen: "#3A9E3A",
  /** XP-Silber / Luna chrome */
  silberLuna: "#D4D0C8",
  /** Glegg brand orange */
  gleggOrange: "#E8593C",
  /** XP error red */
  fehlerRot: "#CC0000",
  /** XP Luna body / window background */
  lunaBody: "#ECE9D8",
  /** Desktop background blue */
  desktopBg: "#3A6EA5",
  /** Default text */
  text: "#000000",

  /** 3D border colors */
  borderLight: "#FFFFFF",
  borderDark: "#808080",
  borderDarker: "#404040",

  /** Title bar active gradient */
  titlebarActiveStart: "#0A246A",
  titlebarActiveEnd: "#3A6EA5",

  /** Title bar inactive gradient */
  titlebarInactiveStart: "#7A96DF",
  titlebarInactiveEnd: "#A6CAF0",

  /** Close button */
  btnCloseBg: "#C75050",
  btnCloseHover: "#E04343",
} as const;

export type XpColorKey = keyof typeof XP_COLORS;
