import Link from "next/link";
import { SketchArrow } from "@/components/ui/sketch-elements";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 pt-12 text-center animate-fade-in">
        <h1
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
          }}
        >
          gleggmire
        </h1>
        <p
          className="max-w-lg text-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          Das kollektive Glossar der Gleggmire-Community
        </p>

        <div className="flex items-center gap-3">
          <SketchArrow
            className="hidden -rotate-12 sm:block"
            direction="right"
            color="var(--color-accent)"
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/glossar"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white no-underline transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
              }}
            >
              Glossar entdecken
            </Link>
            <Link
              href="/zufall"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold no-underline transition-colors"
              style={{
                backgroundColor: "var(--color-surface)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              Zufaelliger Begriff
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <p
          className="mt-4 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          42 Begriffe &middot; 18 Clips &middot; 97 Definitionen
        </p>
      </section>

      {/* 3-column feature cards */}
      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
        {/* Begriff des Tages */}
        <div className="card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
              style={{ color: "var(--color-accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <h2
              className="text-base font-semibold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
              }}
            >
              Begriff des Tages
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center py-8">
            <p
              className="text-center text-sm italic"
              style={{ color: "var(--color-text-muted)" }}
            >
              Hier erscheint bald der taegliche Featured-Begriff...
            </p>
          </div>
        </div>

        {/* Top Clips */}
        <div className="card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
              style={{ color: "var(--color-accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            <h2
              className="text-base font-semibold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
              }}
            >
              Top Clips
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center py-8">
            <p
              className="text-center text-sm italic"
              style={{ color: "var(--color-text-muted)" }}
            >
              Die beliebtesten Clips der Woche...
            </p>
          </div>
        </div>

        {/* Aktivitaets-Feed */}
        <div className="card p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
              style={{ color: "var(--color-accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </span>
            <h2
              className="text-base font-semibold"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
              }}
            >
              Aktivitaets-Feed
            </h2>
          </div>
          <div className="flex flex-1 items-center justify-center py-8">
            <p
              className="text-center text-sm italic"
              style={{ color: "var(--color-text-muted)" }}
            >
              Letzte Community-Aktivitaeten...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
