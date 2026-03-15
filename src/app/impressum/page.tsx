import type { Metadata } from "next";
import { XpWindow } from "@/components/ui/xp-window";

export const metadata: Metadata = {
  title: "Impressum — gleggmire.net",
  description:
    "Impressum gemäß §5 TMG für gleggmire.net – Angaben zum Verantwortlichen.",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <XpWindow title="⚖️ Impressum — §5 TMG">
        <div className="space-y-4 xp-text-body">
          <section>
            <h2 className="xp-text-heading mb-2">Angaben gemäß §5 TMG</h2>
            <p>
              Hans Vincent Trommer
              <br />
              c/o MDC Management#57
              <br />
              Welserstraße 3
              <br />
              87463 Dietmannsried
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="xp-text-heading mb-2">Kontakt</h2>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:kontakt@gleggmire.net"
                className="underline"
                style={{ color: "var(--xp-blau-start)" }}
              >
                kontakt@gleggmire.net
              </a>
              <br />
              Discord: <span className="font-bold">tetrxs</span>
            </p>
          </section>

          <section className="xp-inset bg-white/50 p-3">
            <p className="xp-text-label">
              Hinweis: Dies ist ein privates, nicht-kommerzielles Fan-Projekt.
            </p>
          </section>
        </div>
      </XpWindow>
    </main>
  );
}
