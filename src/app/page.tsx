import Link from "next/link";

const MARQUEE_TEXT =
  "GEGLÄGGMIRT · KOMPLETT · SNENCH · LUNGEN-TORPEDO · KANACKENTASCHE · AUF GLEGG · ";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ============================
          1. HERO SECTION
          ============================ */}
      <section className="flex flex-col items-center justify-center gap-8 px-4 py-24 text-center animate-fade-in">
        <h1
          className="font-bold uppercase leading-[0.95] tracking-tighter"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
            fontSize: "clamp(3rem, 10vw, 7rem)",
          }}
        >
          DAS{" "}
          <span className="pill" style={{ verticalAlign: "baseline" }}>
            GLOSSAR
          </span>{" "}
          DER
          <br />
          GLEGGMIRE
          <br />
          <span className="pill-accent" style={{ verticalAlign: "baseline" }}>
            COMMUNITY
          </span>
        </h1>

        <p
          className="max-w-md text-base uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)" }}
        >
          Das kollektive Nachschlagewerk &mdash; von der Community, fuer die
          Community.
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
          2. MARQUEE / TICKER STRIP
          ============================ */}
      <section
        className="overflow-hidden whitespace-nowrap"
        style={{
          backgroundColor: "var(--color-text)",
          color: "var(--color-bg)",
          borderTop: "2px solid var(--color-border)",
          borderBottom: "2px solid var(--color-border)",
        }}
      >
        <div className="animate-marquee flex w-max py-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
          3. STATS ROW
          ============================ */}
      <section className="flex flex-col items-center gap-2 py-20 animate-slide-up">
        <div
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-center"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
          }}
        >
          <div>
            <span
              className="block font-bold"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              79+
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Begriffe
            </span>
          </div>
          <span
            className="hidden text-4xl font-light sm:block"
            style={{ color: "var(--color-border)" }}
          >
            &middot;
          </span>
          <div>
            <span
              className="block font-bold"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              18
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Clips
            </span>
          </div>
          <span
            className="hidden text-4xl font-light sm:block"
            style={{ color: "var(--color-border)" }}
          >
            &middot;
          </span>
          <div>
            <span
              className="block font-bold"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              97
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Definitionen
            </span>
          </div>
        </div>
      </section>

      {/* ============================
          4. FEATURE CARDS
          ============================ */}
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 pb-20 md:grid-cols-2 lg:grid-cols-3 animate-slide-up">
        {/* Begriff des Tages */}
        <div className="card p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--color-accent)" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <h3
              className="text-xl font-bold uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
              }}
            >
              Begriff des Tages
            </h3>
          </div>
          <div className="flex flex-1 items-center justify-center py-10">
            <p
              className="text-center text-sm italic"
              style={{ color: "var(--color-text-muted)" }}
            >
              Hier erscheint bald der taegliche Featured-Begriff...
            </p>
          </div>
        </div>

        {/* Top Clips */}
        <div className="card p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--color-accent)" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </span>
            <h3
              className="text-xl font-bold uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
              }}
            >
              Top Clips
            </h3>
          </div>
          <div className="flex flex-1 items-center justify-center py-10">
            <p
              className="text-center text-sm italic"
              style={{ color: "var(--color-text-muted)" }}
            >
              Die beliebtesten Clips der Woche...
            </p>
          </div>
        </div>

        {/* Aktivitaets-Feed */}
        <div className="card p-8 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span style={{ color: "var(--color-accent)" }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </span>
            <h3
              className="text-xl font-bold uppercase tracking-tight"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-text)",
              }}
            >
              Aktivitaets-Feed
            </h3>
          </div>
          <div className="flex flex-1 items-center justify-center py-10">
            <p
              className="text-center text-sm italic"
              style={{ color: "var(--color-text-muted)" }}
            >
              Letzte Community-Aktivitaeten...
            </p>
          </div>
        </div>
      </section>

      {/* ============================
          5. BOTTOM CTA
          ============================ */}
      <section
        className="flex flex-col items-center gap-8 px-4 py-24 text-center"
        style={{
          borderTop: "2px solid var(--color-border)",
        }}
      >
        <h2
          className="font-bold uppercase leading-[0.95] tracking-tighter"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-text)",
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
          }}
        >
          WERDE TEIL DER{" "}
          <span className="pill-accent" style={{ verticalAlign: "baseline" }}>
            COMMUNITY
          </span>
        </h2>
        <Link href="/glossar/einreichen" className="btn-outlined no-underline">
          BEGRIFF EINREICHEN
        </Link>
      </section>
    </div>
  );
}
