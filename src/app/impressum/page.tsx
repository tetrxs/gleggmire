import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — gleggmire.net",
  description:
    "Impressum gemaess Paragraph 5 TMG fuer gleggmire.net – Angaben zum Verantwortlichen.",
};

export default function ImpressumPage() {
  return (
    <div className="py-10">
      <h1
        className="mb-6 text-xl font-bold uppercase tracking-wide sm:text-2xl"
        style={{
          color: "var(--color-text)",
          letterSpacing: "0.04em",
        }}
      >
        Impressum
      </h1>

      <div className="space-y-6 text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Angaben gemaess &sect;5 TMG
          </h2>
          <p>
            Hans Vincent Trommer
            <br />
            c/o MDC Management#57
            <br />
            Welserstrasse 3
            <br />
            87463 Dietmannsried
            <br />
            Deutschland
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Kontakt
          </h2>
          <p>
            E-Mail:{" "}
            <a
              href="mailto:kontakt@gleggmire.net"
              className="font-medium no-underline"
              style={{ color: "var(--color-accent)" }}
            >
              kontakt@gleggmire.net
            </a>
            <br />
            Discord: <span className="font-semibold">tetrxs</span>
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Haftungsausschluss
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Die Inhalte dieser Seite werden mit groesster Sorgfalt erstellt. Fuer die
            Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte koennen wir
            jedoch keine Gewaehr uebernehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
