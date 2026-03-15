"use client";

import { useEffect, useRef, useCallback } from "react";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const CHAOS_COLORS = [
  "var(--xp-blau-start)",
  "var(--xp-gruen)",
  "var(--glegg-orange)",
  "var(--xp-fehler-rot)",
  "var(--xp-blau-end)",
  "#FFD700",
  "#FF00FF",
  "#00FF00",
  "var(--xp-desktop-bg)",
  "var(--xp-silber-luna)",
];

const CHAOS_FONTS = ["Comic Sans MS", "Impact", "Papyrus"];

const CHAOS_STYLE_ID = "konami-chaos-styles";

export function KonamiCode() {
  const bufferRef = useRef<string[]>([]);
  const activeRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activateChaos = useCallback(() => {
    if (activeRef.current) return;
    activeRef.current = true;

    // Inject chaos stylesheet
    const style = document.createElement("style");
    style.id = CHAOS_STYLE_ID;
    style.textContent = `
      @keyframes konami-color-cycle {
        0%   { background-color: ${CHAOS_COLORS[0]} !important; }
        10%  { background-color: ${CHAOS_COLORS[1]} !important; }
        20%  { background-color: ${CHAOS_COLORS[2]} !important; }
        30%  { background-color: ${CHAOS_COLORS[3]} !important; }
        40%  { background-color: ${CHAOS_COLORS[4]} !important; }
        50%  { background-color: ${CHAOS_COLORS[5]} !important; }
        60%  { background-color: ${CHAOS_COLORS[6]} !important; }
        70%  { background-color: ${CHAOS_COLORS[7]} !important; }
        80%  { background-color: ${CHAOS_COLORS[8]} !important; }
        90%  { background-color: ${CHAOS_COLORS[9]} !important; }
        100% { background-color: ${CHAOS_COLORS[0]} !important; }
      }

      body.konami-chaos {
        animation: konami-color-cycle 2s linear infinite !important;
        transition: none !important;
      }

      body.konami-chaos * {
        transition: transform 0.3s ease !important;
      }

      body.konami-chaos .xp-window,
      body.konami-chaos .xp-window-outer,
      body.konami-chaos main > * {
        animation: konami-wobble 0.5s ease-in-out infinite alternate;
      }

      @keyframes konami-wobble {
        0%   { transform: rotate(-1.5deg); }
        100% { transform: rotate(1.5deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.classList.add("konami-chaos");

    // Randomly cycle fonts on text elements
    let fontTick = 0;
    intervalRef.current = setInterval(() => {
      const font = CHAOS_FONTS[fontTick % CHAOS_FONTS.length];
      document.body.style.fontFamily = `"${font}", cursive`;
      fontTick++;
    }, 400);

    // Revert after 10 seconds
    timeoutRef.current = setTimeout(() => {
      document.body.classList.remove("konami-chaos");
      document.body.style.fontFamily = "";
      const chaosStyle = document.getElementById(CHAOS_STYLE_ID);
      if (chaosStyle) chaosStyle.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
      activeRef.current = false;
    }, 10000);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      bufferRef.current.push(e.key.toLowerCase());

      // Keep only the last N keys
      if (bufferRef.current.length > KONAMI_SEQUENCE.length) {
        bufferRef.current = bufferRef.current.slice(-KONAMI_SEQUENCE.length);
      }

      const match = bufferRef.current.every(
        (key, i) =>
          key ===
          KONAMI_SEQUENCE[
            i + (bufferRef.current.length - KONAMI_SEQUENCE.length)
          ]?.toLowerCase()
      );

      if (
        match &&
        bufferRef.current.length === KONAMI_SEQUENCE.length
      ) {
        bufferRef.current = [];
        activateChaos();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activateChaos]);

  return null;
}
