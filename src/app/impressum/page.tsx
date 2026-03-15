import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — gleggmire.net",
  description:
    "Impressum gemaess Paragraph 5 TMG fuer gleggmire.net – Angaben zum Verantwortlichen.",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Impressum</h1>

      <div className="card p-6 space-y-6 text-sm text-[var(--color-text)]">
        <section>
          <h2 className="text-base font-semibold mb-2">Angaben gemaess Paragraph 5 TMG</h2>
          <p className="leading-relaxed">
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

        <section>
          <h2 className="text-base font-semibold mb-2">Kontakt</h2>
          <p className="leading-relaxed">
            E-Mail:{" "}
            <a
              href="mailto:kontakt@gleggmire.net"
              className="text-[#E8593C] underline hover:no-underline"
            >
              kontakt@gleggmire.net
            </a>
            <br />
            Discord: <span className="font-bold">tetrxs</span>
          </p>
        </section>

        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 dark:border-zinc-700">
          <p className="text-xs text-[var(--color-muted)]">
            Hinweis: Dies ist ein privates, nicht-kommerzielles Fan-Projekt.
          </p>
        </section>
      </div>
    </main>
  );
}
