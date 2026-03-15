"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";

interface RouletteTerm {
  id: string;
  term: string;
  slug: string;
}

const ITEM_WIDTH = 160;
const VISIBLE_COUNT = 7;
const VIEWPORT_WIDTH = ITEM_WIDTH * VISIBLE_COUNT;

export function RouletteModal() {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<RouletteTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<RouletteTerm | null>(null);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = async () => {
      setOpen(true);
      setSelectedTerm(null);
      if (terms.length === 0) {
        setLoading(true);
        try {
          const res = await fetch("/api/terms/for-matching");
          if (res.ok) {
            const data = await res.json();
            setTerms(data);
          }
        } catch {
          // continue with empty list
        } finally {
          setLoading(false);
        }
      }
    };
    window.addEventListener("open-roulette-modal", handler);
    return () => window.removeEventListener("open-roulette-modal", handler);
  }, [terms.length]);

  // Build a long repeated pool for infinite-feeling scroll
  const pool = useRef<RouletteTerm[]>([]);
  useEffect(() => {
    if (terms.length === 0) return;
    const repeated: RouletteTerm[] = [];
    while (repeated.length < 200) {
      // Shuffle each batch for variety
      const shuffled = [...terms].sort(() => Math.random() - 0.5);
      repeated.push(...shuffled);
    }
    pool.current = repeated;
  }, [terms]);

  const renderStrip = useCallback(() => {
    if (!stripRef.current || pool.current.length === 0) return;
    const offset = offsetRef.current;
    const centerX = VIEWPORT_WIDTH / 2;
    const totalWidth = pool.current.length * ITEM_WIDTH;

    // Wrap offset
    const wrappedOffset = ((offset % totalWidth) + totalWidth) % totalWidth;

    // Find which items are visible
    const startIdx = Math.floor((wrappedOffset - centerX) / ITEM_WIDTH);
    const endIdx = startIdx + VISIBLE_COUNT + 2;

    let html = "";
    for (let i = startIdx; i <= endIdx; i++) {
      const idx = ((i % pool.current.length) + pool.current.length) % pool.current.length;
      const term = pool.current[idx];
      const itemCenter = i * ITEM_WIDTH + ITEM_WIDTH / 2;
      const screenX = itemCenter - wrappedOffset;
      const distFromCenter = (screenX - centerX) / centerX;
      const absDist = Math.abs(distFromCenter);

      const scale = Math.max(0.45, 1 - absDist * 0.55);
      const opacity = Math.max(0.2, 1 - absDist * 0.7);

      html += `<div style="
        position:absolute;
        left:${screenX - ITEM_WIDTH / 2}px;
        top:50%;
        width:${ITEM_WIDTH}px;
        transform:translateY(-50%) scale(${scale});
        opacity:${opacity};
        text-align:center;
        font-family:var(--font-heading);
        font-weight:700;
        font-size:${scale > 0.85 ? "1.1rem" : "0.85rem"};
        color:var(--color-text);
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        padding:0.5rem;
        pointer-events:none;
        will-change:transform;
      ">${term.term}</div>`;
    }
    stripRef.current.innerHTML = html;
  }, []);

  const spin = useCallback(() => {
    if (spinning || pool.current.length === 0) return;
    setSpinning(true);
    setSelectedTerm(null);

    // Random starting velocity for variety
    velocityRef.current = 25 + Math.random() * 15;
    // Random initial offset so we don't always start at the same place
    offsetRef.current = Math.random() * pool.current.length * ITEM_WIDTH;

    const animate = () => {
      offsetRef.current += velocityRef.current;
      velocityRef.current *= 0.988;

      renderStrip();

      if (velocityRef.current > 0.3) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Snap to nearest item center
        const nearestIdx = Math.round(offsetRef.current / ITEM_WIDTH);
        offsetRef.current = nearestIdx * ITEM_WIDTH + ITEM_WIDTH / 2 - VIEWPORT_WIDTH / 2;

        // Small smooth snap animation
        const targetOffset = offsetRef.current;
        let snapFrame = 0;
        const snapAnimate = () => {
          snapFrame++;
          const currentOffset = offsetRef.current;
          const diff = targetOffset - currentOffset;
          offsetRef.current += diff * 0.3;
          renderStrip();
          if (Math.abs(diff) > 0.5 && snapFrame < 30) {
            rafRef.current = requestAnimationFrame(snapAnimate);
          } else {
            offsetRef.current = targetOffset;
            renderStrip();

            // Determine which term is at center
            const totalWidth = pool.current.length * ITEM_WIDTH;
            const wrappedOffset = ((targetOffset % totalWidth) + totalWidth) % totalWidth;
            const centerItemIdx = Math.round((wrappedOffset + VIEWPORT_WIDTH / 2 - ITEM_WIDTH / 2) / ITEM_WIDTH);
            const idx = ((centerItemIdx % pool.current.length) + pool.current.length) % pool.current.length;
            setSelectedTerm(pool.current[idx]);
            setSpinning(false);
          }
        };
        rafRef.current = requestAnimationFrame(snapAnimate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [spinning, renderStrip]);

  // Cleanup animation on unmount/close
  useEffect(() => {
    if (!open) {
      cancelAnimationFrame(rafRef.current);
      setSpinning(false);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [open]);

  // Initial render of strip when terms load
  useEffect(() => {
    if (open && pool.current.length > 0 && !spinning && !selectedTerm) {
      offsetRef.current = Math.random() * pool.current.length * ITEM_WIDTH;
      renderStrip();
    }
  }, [open, terms, spinning, selectedTerm, renderStrip]);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Glegg-Roulette"
      maxWidth="max-w-xl"
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Laden...
          </span>
        </div>
      ) : terms.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Noch keine Begriffe vorhanden.
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <p className="text-sm text-center" style={{ color: "var(--color-text-muted)" }}>
            Drueck auf Drehen und lass das Glueck entscheiden!
          </p>

          {/* Roulette viewport */}
          <div
            className="relative w-full overflow-hidden rounded-xl"
            style={{
              height: "100px",
              maxWidth: `${VIEWPORT_WIDTH}px`,
              backgroundColor: "var(--color-bg)",
              border: "2px solid var(--color-border)",
            }}
          >
            {/* Center indicator lines */}
            <div
              className="absolute top-0 bottom-0 z-10"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                width: `${ITEM_WIDTH}px`,
                borderLeft: "2px solid var(--color-accent)",
                borderRight: "2px solid var(--color-accent)",
                backgroundColor: "color-mix(in srgb, var(--color-accent) 8%, transparent)",
                pointerEvents: "none",
              }}
            />
            {/* Strip container */}
            <div
              ref={stripRef}
              className="absolute inset-0"
              style={{ willChange: "contents" }}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-3 w-full">
            {!selectedTerm ? (
              <button
                onClick={spin}
                disabled={spinning}
                className="btn-filled w-full max-w-xs text-sm"
                style={{ opacity: spinning ? 0.6 : 1 }}
              >
                {spinning ? "DREHT SICH..." : "DREHEN!"}
              </button>
            ) : (
              <>
                <div
                  className="text-center px-4 py-3 rounded-xl animate-roulette-glow"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                    color: "var(--color-text)",
                  }}
                >
                  {selectedTerm.term}
                </div>
                <div className="flex gap-3 w-full max-w-xs">
                  <Link
                    href={`/glossar/${selectedTerm.slug}`}
                    className="btn-filled flex-1 text-center text-sm no-underline"
                    onClick={() => setOpen(false)}
                  >
                    ZUM EINTRAG
                  </Link>
                  <button
                    onClick={spin}
                    className="btn-outlined flex-1 text-sm"
                  >
                    NOCHMAL
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
