import Image from "next/image";
import Link from "next/link";
import { getLatestTerms } from "@/lib/data/glossary";
import { OpenModalButton } from "@/components/ui/open-modal-button";
import type { TermWithPreview } from "@/lib/data/glossary";

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
  { src: "/images/elements/gleggmire_coin.png", className: "animate-float", style: { top: "2rem", left: "1%" }, width: 160, height: 160 },
  { src: "/images/elements/gleggmire_wanted.png", className: "animate-tilt-rock", style: { top: "6rem", right: "1%" }, width: 190, height: 190 },
  { src: "/images/elements/gleggmire_triangle.png", className: "animate-float-slow", style: { bottom: "2rem", left: "2%" }, width: 150, height: 150 },
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
          5. FAN-DISCLAIMER INFO BOX
          ============================ */}
      <section className="mx-auto w-full max-w-4xl px-4 py-10">
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "2px solid var(--color-border)",
          }}
        >
          <h3
            className="mb-2 text-base font-bold tracking-tight"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-text)" }}
          >
            Reines Fan-Projekt mit Herz &#10084;&#65039;
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            gleggmire.net ist ein{" "}
            <strong style={{ color: "var(--color-text)" }}>inoffizielles Community-Projekt</strong>{" "}
            und hat nichts mit Gleggmire oder seinen offiziellen Kanaelen zu tun. Bei Fragen:{" "}
            <a
              href="mailto:kontakt@gleggmire.net"
              className="font-semibold no-underline"
              style={{ color: "var(--color-accent)" }}
            >
              kontakt@gleggmire.net
            </a>
          </p>
        </div>
      </section>

    </div>
  );
}
