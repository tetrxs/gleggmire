import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — gleggmire.net",
  description:
    "Impressum gemaess Paragraph 5 DDG fuer gleggmire.net — Angaben zum Verantwortlichen des Gleggmire Community-Glossars.",
  alternates: {
    canonical: "https://gleggmire.net/impressum",
  },
  openGraph: {
    title: "Impressum — gleggmire.net",
    description:
      "Impressum gemaess Paragraph 5 DDG fuer gleggmire.net — Angaben zum Verantwortlichen.",
    url: "https://gleggmire.net/impressum",
  },
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
            Angaben gemaess &sect;5 DDG
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
          <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Eine schnelle elektronische Kontaktaufnahme ist ueber die oben genannte E-Mail-Adresse
            gewaehrleistet.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Haftung fuer Inhalte
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Die Inhalte dieser Seite werden mit groesster Sorgfalt erstellt. Fuer die
            Richtigkeit, Vollstaendigkeit und Aktualitaet der Inhalte koennen wir
            jedoch keine Gewaehr uebernehmen. Als Diensteanbieter sind wir gemaess &sect;7 Abs. 1 DDG
            fuer eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            Nach &sect;&sect;8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
            uebermittelte oder gespeicherte fremde Informationen zu ueberwachen.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Haftung fuer Links
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Unser Angebot enthaelt Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen
            Einfluss haben. Fuer die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
            oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung
            auf moegliche Rechtsverstoesse ueberprueft. Rechtswidrige Inhalte waren zum Zeitpunkt der
            Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
            jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden
            von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            Urheberrecht
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
            dem deutschen Urheberrecht. Die Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art
            der Verwertung ausserhalb der Grenzen des Urheberrechtes beduerfen der schriftlichen
            Zustimmung des jeweiligen Autors bzw. Erstellers. gleggmire.net ist ein inoffizielles
            Fan-Projekt und steht in keiner offiziellen Verbindung zum YouTuber Gleggmire.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            EU-Streitschlichtung
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Die Europaeische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              className="font-medium no-underline"
              style={{ color: "var(--color-accent)" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
