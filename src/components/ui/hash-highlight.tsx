"use client";

import { useEffect } from "react";

/**
 * Detects URL hash on mount, scrolls to the element, and applies
 * a brief highlight animation (report-highlight class).
 */
export function HashHighlight() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Small delay so the DOM is fully rendered
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("report-highlight");
      const cleanup = setTimeout(() => el.classList.remove("report-highlight"), 2500);
      return () => clearTimeout(cleanup);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
