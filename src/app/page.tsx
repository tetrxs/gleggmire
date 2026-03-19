import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getLatestTerms } from "@/lib/data/glossary";
import { OpenModalButton } from "@/components/ui/open-modal-button";
import { getTopUsers } from "@/lib/data/users";
import { LeaderboardView } from "@/components/community/leaderboard-view";
import { GlossaryCard } from "@/components/glossary/glossary-card";

export const metadata: Metadata = {
  title: "gleggmire.net — Das Community-Glossar fuer Gleggmire-Begriffe",
  description:
    "Das umfassende Community-Lexikon rund um den YouTuber Gleggmire. Begriffe, Definitionen, Insider und Slang — von der Community gesammelt, erklaert und bewertet.",
  alternates: {
    canonical: "https://gleggmire.net",
  },
  openGraph: {
    title: "gleggmire.net — Das Community-Glossar fuer Gleggmire-Begriffe",
    description:
      "Das umfassende Community-Lexikon rund um den YouTuber Gleggmire. Begriffe, Definitionen, Insider und Slang — von der Community gesammelt und erklaert.",
    url: "https://gleggmire.net",
    type: "website",
  },
};

const MARQUEE_FALLBACK =
  "GLEGGMIRE · GLOSSAR · COMMUNITY · DEFINITIONEN · LEADERBOARD · BADGES · ";




const HERO_DECORATIONS = [
  // Oben links – groß
  { src: "/images/elements/gleggmire_coin.png", className: "animate-float", style: { top: "2rem", left: "1%" }, width: 140, height: 140 },
  // Oben rechts – groß, weiter runter (weg von Navbar)
  { src: "/images/elements/gleggmire_wanted.png", className: "animate-tilt-rock", style: { top: "5rem", right: "2%" }, width: 160, height: 160 },
  // Mitte links – mittel
  { src: "/images/elements/gleggmire_warnining.png", className: "animate-float-slow", style: { top: "50%", left: "2%" }, width: 85, height: 85 },
  // Mitte rechts – klein (triangle)
  { src: "/images/elements/gleggmire_triangle.png", className: "animate-float-reverse", style: { top: "45%", right: "3%" }, width: 70, height: 70 },
  // Unten links – groß (card)
  { src: "/images/elements/gleggmire_card.png", className: "animate-float-slow", style: { bottom: "1rem", left: "5%" }, width: 120, height: 120 },
  // Unten rechts – mittel
  { src: "/images/elements/gleggmire_badge.png", className: "animate-float", style: { bottom: "2rem", right: "6%" }, width: 95, height: 95 },
] as const;

export default async function HomePage() {
  const [latestTerms, topUsers] = await Promise.all([
    getLatestTerms(8),
    getTopUsers(10),
  ]);

  const marqueeText = latestTerms.length > 0
    ? latestTerms.map((t) => t.term.toUpperCase()).join(" · ") + " · "
    : MARQUEE_FALLBACK;

  // JSON-LD: WebSite schema with SearchAction for Google Sitelinks Search Box
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "gleggmire.net",
    url: "https://gleggmire.net",
    description: "Das umfassende Community-Lexikon rund um den YouTuber Gleggmire.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://gleggmire.net/glossar?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // JSON-LD: Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "gleggmire.net",
    url: "https://gleggmire.net",
    description: "Inoffizielles Fan-Community-Projekt rund um den YouTuber Gleggmire.",
    email: "kontakt@gleggmire.net",
  };

  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
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
          <a
            href="#fan-disclaimer"
            className="no-underline"
            style={{ color: "var(--color-text-muted)", textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Inoffiziell
          </a>
          {" "}&mdash; von der Community, fuer die Community. Begriffe, Definitionen, Chaos und alles was
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
      {/* Divider: Wave – Hero (bg) → Marquee (text) */}
      <div style={{ marginLeft: "calc(50% - 50vw)", width: "100vw", lineHeight: 0, backgroundColor: "var(--color-text)" }}>
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "40px" }}>
          <path d="M0,0 C360,50 1080,50 1440,0 L1440,0 L0,0 Z" fill="var(--color-bg)" />
        </svg>
      </div>
      <section
        className="overflow-hidden whitespace-nowrap"
        style={{
          marginLeft: "calc(50% - 50vw)",
          width: "100vw",
          backgroundColor: "var(--color-text)",
          color: "var(--color-bg)",
        }}
      >
        <div className="animate-marquee flex w-max py-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-sm font-bold uppercase tracking-[0.2em]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {marqueeText}
            </span>
          ))}
        </div>
      </section>
      {/* Divider: Wave inverted – Marquee (text) → Glossar (surface) */}
      <div style={{ marginLeft: "calc(50% - 50vw)", width: "100vw", lineHeight: 0, backgroundColor: "var(--color-surface)" }}>
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "40px" }}>
          <path d="M0,50 C360,0 1080,0 1440,50 L1440,0 L0,0 Z" fill="var(--color-text)" />
        </svg>
      </div>

      {/* ============================
          3. GLOSSAR VORSCHAU – Stufe 1: surface
          ============================ */}
      <section
        style={{
          marginLeft: "calc(50% - 50vw)",
          width: "100vw",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight sm:text-3xl"
                style={{ color: "var(--color-text)" }}
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
              ALLE BEGRIFFE &rarr;
            </Link>
          </div>

          {latestTerms.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {latestTerms.map((term) => (
                <GlossaryCard
                  key={term.id}
                  term={term}
                  definitions={term.definitions}
                  tags={term.tags}
                  commentCount={term.commentCount}
                  creatorUsername={term.creatorUsername}
                  creatorAvatarUrl={term.creatorAvatarUrl}
                />
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

          <div className="mt-6 flex items-center gap-3">
            <OpenModalButton
              event="open-term-submit-modal"
              className="btn-outlined text-xs"
            >
              + DEINEN BEGRIFF HINZUFUEGEN
            </OpenModalButton>
          </div>
        </div>
      </section>

      {/* Divider: Diagonal slant – Glossar (surface) → Leaderboard (surface-alt) */}
      <div style={{ marginLeft: "calc(50% - 50vw)", width: "100vw", lineHeight: 0, backgroundColor: "var(--color-surface-alt)" }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "50px" }}>
          <polygon points="0,0 1440,60 1440,0" fill="var(--color-surface)" />
        </svg>
      </div>

      {/* ============================
          4. LEADERBOARD – Stufe 2: surface-alt
          ============================ */}
      <section
        style={{
          marginLeft: "calc(50% - 50vw)",
          width: "100vw",
          backgroundColor: "var(--color-surface-alt)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-6">
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: "var(--color-text)" }}
            >
              TOP GLEGGS
            </h2>
            <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Die aktivsten Community-Mitglieder
            </p>
          </div>

          <LeaderboardView users={topUsers} />
        </div>
      </section>

      {/* Divider: Zigzag teeth – Leaderboard (surface-alt) → Ueber uns (bg) */}
      <div style={{ marginLeft: "calc(50% - 50vw)", width: "100vw", lineHeight: 0, backgroundColor: "var(--color-bg)" }}>
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "30px" }}>
          <path d="M0,0 L60,40 L120,0 L180,40 L240,0 L300,40 L360,0 L420,40 L480,0 L540,40 L600,0 L660,40 L720,0 L780,40 L840,0 L900,40 L960,0 L1020,40 L1080,0 L1140,40 L1200,0 L1260,40 L1320,0 L1380,40 L1440,0 L1440,0 L0,0 Z" fill="var(--color-surface-alt)" />
        </svg>
      </div>

      {/* ============================
          5. UEBER UNS – Stufe 3: bg (Zyklus von vorne)
          ============================ */}
      <section
        style={{
          marginLeft: "calc(50% - 50vw)",
          width: "100vw",
          marginBottom: "-2rem",
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2
            className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl"
            style={{ color: "var(--color-text)" }}
          >
            Ueber uns
          </h2>
          <p
            className="mb-8 max-w-2xl text-sm leading-relaxed sm:text-base"
            style={{ color: "var(--color-text-muted)" }}
          >
            gleggmire.net ist ein interaktives Fan-Community-Projekt rund um den YouTuber
            Gleggmire. Wir dokumentieren, archivieren und feiern die Lore &mdash; von der
            Community, fuer die Community.
          </p>

          {/* Features */}
          <div className="mb-10 grid gap-4 sm:grid-cols-3">
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <span className="mb-2 block text-lg">&#128214;</span>
              <h3 className="mb-1 text-sm font-bold" style={{ color: "var(--color-text)" }}>
                Glossar
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Community-Begriffe im Urban-Dictionary-Style &mdash; einreichen, abstimmen, entdecken.
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <span className="mb-2 block text-lg">&#128221;</span>
              <h3 className="mb-1 text-sm font-bold" style={{ color: "var(--color-text)" }}>
                Definitionen
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Mehrere Definitionen pro Begriff &mdash; von der Community geschrieben und bewertet.
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <span className="mb-2 block text-lg">&#127942;</span>
              <h3 className="mb-1 text-sm font-bold" style={{ color: "var(--color-text)" }}>
                Leaderboard
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Glegg-Score, Badges und Ranglisten fuer die aktivsten Mitglieder.
              </p>
            </div>
          </div>

          {/* Glegg-Score Erklaerung */}
          <div
            className="mb-10 rounded-xl p-6"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="text-lg">&#11088;</span>
              <h3 className="text-base font-bold" style={{ color: "var(--color-text)" }}>
                Glegg-Score &mdash; So funktioniert&apos;s
              </h3>
            </div>
            <p
              className="mb-4 text-xs leading-relaxed sm:text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Dein Glegg-Score spiegelt deinen Beitrag zur Community wider. Er wird live aus
              deiner gesamten Aktivitaet berechnet &mdash; je mehr du beitraegst, desto hoeher
              steigst du im Leaderboard.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Basis-Punkte */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
                  Basis-Punkte
                </h4>
                <ul className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <li className="flex items-center justify-between">
                    <span>Begriff erstellen</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>+15</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Definition schreiben</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>+10</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Kommentar verfassen</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>+2</span>
                  </li>
                </ul>
              </div>

              {/* Bonus-Punkte */}
              <div className="rounded-lg p-4" style={{ backgroundColor: "var(--color-bg)", border: "1px solid var(--color-border)" }}>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
                  Bonus-Punkte
                </h4>
                <ul className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <li className="flex items-center justify-between">
                    <span>Pro Netto-Upvote auf Definition</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>+5</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Herkunft angeben (Video/Link)</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>+5</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Kommentar mit Anhang</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>+3</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Raenge */}
            <div className="mt-4">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
                Raenge
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Schleimbeutel", min: "0", color: "#71717a" },
                  { name: "Troll-Lehrling", min: "100", color: "#16a34a" },
                  { name: "Glegg-Geselle", min: "500", color: "#2563eb" },
                  { name: "Lore-Meister", min: "1.000", color: "#E8593C" },
                  { name: "Gleggmire-Legende", min: "5.000", color: "#DAA520" },
                ].map((tier) => (
                  <div
                    key={tier.name}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1"
                    style={{ backgroundColor: `${tier.color}15`, border: `1px solid ${tier.color}40` }}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="text-[11px] font-semibold" style={{ color: tier.color }}>
                      {tier.name}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                      ab {tier.min}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p
              className="mt-4 text-[11px] leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Downvotes auf deine Definitionen ziehen den Score wieder runter &mdash; Qualitaet zaehlt!
              Zusaetzlich gibt es Bonus-Punkte fuer freigeschaltete Badges (25&ndash;250 je nach Seltenheit).
            </p>
          </div>

          {/* Fan-Disclaimer Banner */}
          <div
            id="fan-disclaimer"
            className="flex items-start gap-4 rounded-xl p-5 scroll-mt-24"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-accent) 6%, var(--color-surface))",
              border: "1.5px solid color-mix(in srgb, var(--color-accent) 25%, var(--color-border))",
            }}
          >
            <span className="shrink-0 text-2xl" aria-hidden="true">&#10084;&#65039;</span>
            <div>
              <h3
                className="mb-1 text-sm font-bold"
                style={{ color: "var(--color-text)" }}
              >
                Reines Fan-Projekt &mdash; nicht offiziell
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                gleggmire.net ist ein inoffizielles Community-Projekt und steht in keiner
                Verbindung zu Gleggmire oder seinen offiziellen Kanaelen. Server, Domain,
                Entwicklung &mdash; alles wird privat finanziert und in unserer Freizeit
                betrieben. Ein reines Herzensprojekt, ohne Einnahmen oder kommerzielle
                Absichten. Bei Fragen oder Beschwerden erreichst du uns unter{" "}
                <a
                  href="mailto:kontakt@gleggmire.net"
                  className="font-semibold no-underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  kontakt@gleggmire.net
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
