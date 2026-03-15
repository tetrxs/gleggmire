import Image from "next/image";
import Link from "next/link";
import { getLatestTerms } from "@/lib/data/glossary";
import { OpenModalButton } from "@/components/ui/open-modal-button";
import type { TermWithPreview } from "@/lib/data/glossary";
import { MOCK_USERS } from "@/lib/mock-users";

const MARQUEE_TEXT =
  "GEGLÄGGMIRT · KOMPLETT · SNENCH · LUNGEN-TORPEDO · KANACKENTASCHE · AUF GLEGG · ";

function TermPreviewCard({ term }: { term: TermWithPreview }) {
  const def = term.definitions[0];
  const tags = term.tags.slice(0, 3);

  return (
    <Link
      href={`/glossar/${term.slug}`}
      className="card-hover flex flex-col gap-3 p-5 no-underline"
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-lg font-bold leading-tight"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
        >
          {term.term}
        </span>
        {tags.length > 0 && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
              color: "var(--color-accent)",
            }}
          >
            {tags[0].tag}
          </span>
        )}
      </div>
      {def && (
        <p
          className="line-clamp-2 text-xs leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {def.definition}
        </p>
      )}
    </Link>
  );
}


const HERO_DECORATIONS = [
  // Oben links – groß
  { src: "/images/elements/gleggmire_coin.png", className: "animate-float", style: { top: "2rem", left: "1%" }, width: 140, height: 140 },
  // Oben rechts – groß, weiter runter (weg von Navbar)
  { src: "/images/elements/gleggmire_wanted.png", className: "animate-tilt-rock", style: { top: "5rem", right: "2%" }, width: 160, height: 160 },
  // Mitte links – mittel
  { src: "/images/elements/gleggmire_warnining.png", className: "animate-float-slow", style: { top: "50%", left: "2%" }, width: 85, height: 85 },
  // Mitte rechts – klein (card)
  { src: "/images/elements/gleggmire_card.png", className: "animate-float-reverse", style: { top: "45%", right: "3%" }, width: 70, height: 70 },
  // Unten links – groß
  { src: "/images/elements/gleggmire_triangle.png", className: "animate-float-slow", style: { bottom: "1rem", left: "5%" }, width: 120, height: 120 },
  // Unten rechts – mittel
  { src: "/images/elements/gleggmire_badge.png", className: "animate-float", style: { bottom: "2rem", right: "6%" }, width: 95, height: 95 },
] as const;

export default async function HomePage() {
  const latestTerms = await getLatestTerms(8);

  return (
    <div className="flex flex-col">
      {/* ============================
          1. HERO SECTION
          ============================ */}
      <section className="relative flex flex-col items-center justify-center gap-6 px-4 pb-16 pt-20 text-center animate-fade-in">
        {/* Decorative floating images – desktop only */}
        {HERO_DECORATIONS.map((img) => (
          <Image
            key={img.src}
            src={img.src}
            alt=""
            width={img.width}
            height={img.height}
            className={`hidden lg:block absolute select-none pointer-events-none ${img.className}`}
            style={{ ...img.style, filter: "drop-shadow(4px 6px 16px rgba(0,0,0,0.35))" }}
            aria-hidden="true"
          />
        ))}

        <h1
          className="leading-[1.1]"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
            fontSize: "clamp(2.5rem, 9vw, 6.5rem)",
          }}
        >
          <span className="block">Das Glossar</span>
          <span className="block">
            der{" "}
            <span className="sketch-underline" style={{ color: "var(--color-accent)" }}>
              Gleggmire
            </span>
          </span>
          <span className="block">
            Community
            <span style={{ color: "var(--color-accent)" }}>.</span>
          </span>
        </h1>

        <p
          className="max-w-lg text-sm tracking-wide sm:text-base"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
        >
          Von der Community, fuer die Community &mdash; Begriffe, Clips, Chaos und alles was
          dazugehoert.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link href="/glossar" className="btn-filled no-underline">
            GLOSSAR ENTDECKEN
          </Link>
          <Link href="/zufall" className="btn-outlined no-underline">
            ZUFÄLLIGER BEGRIFF
          </Link>
        </div>
      </section>

      {/* ============================
          2. MARQUEE / TICKER – full bleed
          ============================ */}
      <section
        className="overflow-hidden whitespace-nowrap"
        style={{
          marginLeft: "calc(50% - 50vw)",
          width: "100vw",
          backgroundColor: "var(--color-text)",
          color: "var(--color-bg)",
          borderTop: "2px solid var(--color-border)",
          borderBottom: "2px solid var(--color-border)",
        }}
      >
        <div className="animate-marquee flex w-max py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-sm font-bold uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {MARQUEE_TEXT}
            </span>
          ))}
        </div>
      </section>

      {/* ============================
          3. GLOSSAR VORSCHAU
          ============================ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        {/* Section header */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
            >
              Neu im Glossar
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Die zuletzt hinzugefuegten Begriffe der Community
            </p>
          </div>
          <Link
            href="/glossar"
            className="shrink-0 text-xs font-bold uppercase no-underline transition-colors"
            style={{ color: "var(--color-accent)", letterSpacing: "0.08em" }}
          >
            ALLE BEGRIFFE →
          </Link>
        </div>

        {/* Term preview grid – 2 rows */}
        {latestTerms.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestTerms.map((term) => (
              <TermPreviewCard key={term.id} term={term} />
            ))}
          </div>
        ) : (
          <div
            className="flex h-32 items-center justify-center rounded-2xl text-sm"
            style={{ border: "2px dashed var(--color-border)", color: "var(--color-text-muted)" }}
          >
            Noch keine Begriffe vorhanden.
          </div>
        )}

        {/* CTA to add own term + roulette */}
        <div className="mt-6 flex items-center gap-3">
          <OpenModalButton
            event="open-term-submit-modal"
            className="btn-outlined text-xs"
          >
            + DEINEN BEGRIFF HINZUFÜGEN
          </OpenModalButton>
          <OpenModalButton
            event="open-roulette-modal"
            className="btn-outlined text-xs"
          >
            GLEGG-ROULETTE
          </OpenModalButton>
        </div>
      </section>


      {/* ============================
          4. LEADERBOARD PREVIEW
          ============================ */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="mb-6">
          <h2
            className="text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            TOP GLEGGS
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Die aktivsten Community-Mitglieder
          </p>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "2px solid var(--color-border)" }}
        >
          {[...MOCK_USERS]
            .sort((a, b) => b.glegg_score - a.glegg_score)
            .slice(0, 5)
            .map((user, index) => {
              const rank = index + 1;
              const rankColor =
                rank === 1
                  ? "#D4AF37"
                  : rank === 2
                    ? "#A8A8A8"
                    : rank === 3
                      ? "#CD7F32"
                      : "var(--color-text-muted)";

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-5 py-3"
                  style={{
                    borderBottom: index < 4 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-bold"
                      style={{ color: rankColor, fontFamily: "var(--font-heading)", minWidth: "1.5rem" }}
                    >
                      {rank}.
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {user.username}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {user.glegg_score.toLocaleString("de-DE")} pts
                  </span>
                </div>
              );
            })}
        </div>

        <div className="mt-4">
          <Link
            href="/leaderboard"
            className="text-xs font-bold uppercase no-underline transition-colors"
            style={{ color: "var(--color-accent)", letterSpacing: "0.08em" }}
          >
            VOLLES LEADERBOARD &rarr;
          </Link>
        </div>
      </section>

      {/* ============================
          5. ABOUT / COMMUNITY SECTION
          ============================ */}
      <section
        className="mx-auto w-full px-4 py-14"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-4xl">
          <h2
            className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            UEBER UNS
          </h2>

          <p
            className="mb-6 text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--color-text-muted)" }}
          >
            gleggmire.net ist ein interaktives Fan-Community-Projekt. Wir dokumentieren,
            archivieren und feiern alles rund um den YouTuber Gleggmire &mdash; von der
            Community, fuer die Community.
          </p>

          {/* Fan-disclaimer info box */}
          <div
            className="mb-6 rounded-2xl p-5"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "2px solid var(--color-border)",
            }}
          >
            <h3
              className="mb-2 text-base font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
            >
              Reines Fan-Projekt mit Herz
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              gleggmire.net ist ein{" "}
              <strong style={{ color: "var(--color-text)" }}>inoffizielles Community-Projekt</strong>{" "}
              und hat nichts mit Gleggmire oder seinen offiziellen Kanaelen zu tun.
            </p>
          </div>

          {/* Social links and contact */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <a
              href="https://www.youtube.com/@Gleggmire"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold no-underline transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              <svg
                className="mr-1 inline-block h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
              </svg>
              YouTube
            </a>
            <a
              href="https://www.twitch.tv/gleggmire"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold no-underline transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              <svg
                className="mr-1 inline-block h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M11.6 11.2V6.4h-1.6v4.8h1.6Zm4.4 0V6.4H14v4.8h2ZM4.8 0 0 4.8v14.4h6.4V24l4.8-4.8h3.8L24 10.4V0H4.8Zm17.6 9.6-3.8 3.8h-3.8L11.4 17v-3.6H6.4V1.6h16v8Z" />
              </svg>
              Twitch
            </a>
            <span style={{ color: "var(--color-border)" }}>|</span>
            <a
              href="mailto:kontakt@gleggmire.net"
              className="font-semibold no-underline"
              style={{ color: "var(--color-accent)" }}
            >
              kontakt@gleggmire.net
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
