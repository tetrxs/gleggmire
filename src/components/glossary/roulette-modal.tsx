"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";

interface RouletteTerm {
  id: string;
  term: string;
  slug: string;
}

// Layout constants
const ITEM_WIDTH = 130;
const VIEWPORT_WIDTH = 420;
const HALF_VIEWPORT = VIEWPORT_WIDTH / 2;
const FRICTION = 0.993;
const STOP_THRESHOLD = 0.15;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function RouletteModal() {
  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState<RouletteTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<RouletteTerm | null>(null);
  const [offset, setOffset] = useState(0);

  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const poolRef = useRef<RouletteTerm[]>([]);
  const hasFetched = useRef(false);

  // Listen for the custom event to open the modal
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setSelectedTerm(null);

      if (!hasFetched.current) {
        hasFetched.current = true;
        setLoading(true);
        fetch("/api/terms/for-matching")
          .then((res) => (res.ok ? res.json() : []))
          .then((data: RouletteTerm[]) => {
            setTerms(data);
          })
          .catch(() => {
            // keep empty list
          })
          .finally(() => setLoading(false));
      }
    };
    window.addEventListener("open-roulette-modal", handler);
    return () => window.removeEventListener("open-roulette-modal", handler);
  }, []);

  // Build repeated pool whenever terms change
  useEffect(() => {
    if (terms.length === 0) {
      poolRef.current = [];
      return;
    }
    const repeated: RouletteTerm[] = [];
    // Build at least 300 items so we have plenty of runway
    while (repeated.length < 300) {
      repeated.push(...shuffle(terms));
    }
    poolRef.current = repeated;
    // Set initial offset to somewhere in the middle
    const startOffset = Math.floor(repeated.length / 2) * ITEM_WIDTH;
    offsetRef.current = startOffset;
    setOffset(startOffset);
  }, [terms]);

  // Given an offset, compute the index of the term at the center of the viewport
  const getCenterIndex = useCallback((currentOffset: number): number => {
    const pool = poolRef.current;
    if (pool.length === 0) return 0;
    const totalWidth = pool.length * ITEM_WIDTH;
    // The center of the viewport corresponds to this position in the strip:
    const centerPos = currentOffset + HALF_VIEWPORT;
    // Which item index is at this position?
    const rawIndex = Math.floor(centerPos / ITEM_WIDTH);
    // Wrap around
    return ((rawIndex % pool.length) + pool.length) % pool.length;
  }, []);

  // Animation loop using requestAnimationFrame
  const animate = useCallback(() => {
    offsetRef.current += velocityRef.current;
    velocityRef.current *= FRICTION;

    if (Math.abs(velocityRef.current) < STOP_THRESHOLD) {
      // Snap to nearest term center
      const centerPos = offsetRef.current + HALF_VIEWPORT;
      const nearestIndex = Math.round(centerPos / ITEM_WIDTH);
      const snappedOffset = nearestIndex * ITEM_WIDTH - HALF_VIEWPORT + ITEM_WIDTH / 2;

      // Small smooth snap
      const snapTo = (target: number, step: number) => {
        const diff = target - offsetRef.current;
        if (Math.abs(diff) < 0.5 || step > 20) {
          offsetRef.current = target;
          setOffset(target);
          // Determine selected term
          const idx = getCenterIndex(target);
          setSelectedTerm(poolRef.current[idx] || null);
          setSpinning(false);
          return;
        }
        offsetRef.current += diff * 0.25;
        setOffset(offsetRef.current);
        rafRef.current = requestAnimationFrame(() => snapTo(target, step + 1));
      };
      snapTo(snappedOffset, 0);
      return;
    }

    setOffset(offsetRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [getCenterIndex]);

  const spin = useCallback(() => {
    if (spinning || poolRef.current.length === 0) return;
    setSpinning(true);
    setSelectedTerm(null);
    // Random velocity: always scroll to the right (positive offset increase)
    velocityRef.current = 20 + Math.random() * 18;
    rafRef.current = requestAnimationFrame(animate);
  }, [spinning, animate]);

  // Cleanup animation on close or unmount
  useEffect(() => {
    if (!open) {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [open]);

  // Compute visible items for rendering
  const visibleItems: {
    term: RouletteTerm;
    x: number;
    scale: number;
    opacity: number;
  }[] = [];

  if (poolRef.current.length > 0) {
    const pool = poolRef.current;
    const totalWidth = pool.length * ITEM_WIDTH;

    // We need to figure out which items fall within the viewport
    // The viewport shows offset..offset+VIEWPORT_WIDTH
    // Each item i occupies [i*ITEM_WIDTH, (i+1)*ITEM_WIDTH]
    const startItem = Math.floor(offset / ITEM_WIDTH) - 1;
    const endItem = Math.ceil((offset + VIEWPORT_WIDTH) / ITEM_WIDTH) + 1;

    for (let i = startItem; i <= endItem; i++) {
      const wrappedIdx = ((i % pool.length) + pool.length) % pool.length;
      const itemCenterX = i * ITEM_WIDTH + ITEM_WIDTH / 2;
      // Position relative to viewport
      const screenX = itemCenterX - offset;
      // Distance from viewport center (normalized 0..1)
      const distFromCenter = Math.abs(screenX - HALF_VIEWPORT) / HALF_VIEWPORT;
      const scale = clamp(1.3 - distFromCenter * 0.8, 0.5, 1.3);
      const opacity = clamp(1.1 - distFromCenter * 0.9, 0.2, 1);

      visibleItems.push({
        term: pool[wrappedIdx],
        x: screenX,
        scale,
        opacity,
      });
    }
  }

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
      ) : terms.length === 0 && !loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            Noch keine Begriffe vorhanden.
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <p
            className="text-sm text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            Drueck auf Drehen und lass das Glueck entscheiden!
          </p>

          {/* Roulette viewport */}
          <div
            className="relative overflow-hidden rounded-xl mx-auto"
            style={{
              width: `${VIEWPORT_WIDTH}px`,
              maxWidth: "100%",
              height: "100px",
              backgroundColor: "var(--color-bg)",
              border: "2px solid var(--color-border)",
            }}
          >
            {/* Center highlight zone */}
            <div
              className="absolute top-0 bottom-0 z-10 pointer-events-none"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                width: `${ITEM_WIDTH}px`,
                borderLeft: "2px solid var(--color-accent)",
                borderRight: "2px solid var(--color-accent)",
                backgroundColor: "color-mix(in srgb, var(--color-accent) 8%, transparent)",
              }}
            />

            {/* Gradient fade edges */}
            <div
              className="absolute top-0 bottom-0 left-0 z-20 pointer-events-none"
              style={{
                width: "60px",
                background: "linear-gradient(to right, var(--color-bg), transparent)",
              }}
            />
            <div
              className="absolute top-0 bottom-0 right-0 z-20 pointer-events-none"
              style={{
                width: "60px",
                background: "linear-gradient(to left, var(--color-bg), transparent)",
              }}
            />

            {/* Term items rendered via React state */}
            {visibleItems.map((item, i) => (
              <div
                key={i}
                className="absolute top-1/2 flex items-center justify-center"
                style={{
                  left: `${item.x}px`,
                  width: `${ITEM_WIDTH}px`,
                  transform: `translate(-50%, -50%) scale(${item.scale})`,
                  opacity: item.opacity,
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: item.scale > 1.0 ? "1.1rem" : "0.85rem",
                  color: "var(--color-text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  padding: "0.5rem 0.25rem",
                  pointerEvents: "none",
                  willChange: "transform, opacity",
                }}
              >
                {item.term.term}
              </div>
            ))}
          </div>

          {/* Controls & Result */}
          <div className="flex flex-col items-center gap-4 w-full">
            {selectedTerm ? (
              <>
                <div
                  className="text-center px-6 py-3 rounded-xl animate-roulette-glow"
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
                  <button onClick={spin} className="btn-outlined flex-1 text-sm">
                    NOCHMAL
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={spin}
                disabled={spinning}
                className="btn-filled w-full max-w-xs text-sm"
                style={{ opacity: spinning ? 0.6 : 1 }}
              >
                {spinning ? "DREHT SICH..." : "DREHEN!"}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
