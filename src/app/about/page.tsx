import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ueber gleggmire.net — about",
  description:
    "Ueber gleggmire.net – ein interaktives Fan-Community-Projekt fuer den YouTuber Gleggmire.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Ueber gleggmire.net</h1>

      <div className="card p-6 space-y-6 text-sm text-[var(--color-text)]">
        {/* Projektbeschreibung */}
        <section>
          <h2 className="text-base font-semibold mb-2">Was ist gleggmire.net?</h2>
          <p className="leading-relaxed">
            gleggmire.net ist eine interaktive Fan-Community-Plattform fuer den YouTuber Gleggmire. Die Seite bietet ein von der Community gepflegtes Glossar, Clip-Einreichungen, Leaderboards und mehr.
          </p>
        </section>

        {/* Fan-Disclaimer */}
        <section className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 dark:border-zinc-700">
          <h2 className="text-base font-semibold mb-2">Fan-Disclaimer</h2>
          <p className="leading-relaxed text-[var(--color-muted)]">
            Diese Seite ist ein inoffizielles Fan-Projekt der Gleggmire-Community und steht in keiner Verbindung zu Gleggmire oder dessen offiziellen Kanaelen. Alle Inhalte wurden von der Community erstellt und gepflegt. Das Glossar erhebt keinen Anspruch auf Vollstaendigkeit oder Richtigkeit. Bei Problemen, Beschwerden oder Fragen bitte direkt ueber Discord melden:{" "}
            <span className="font-bold text-[var(--color-text)]">tetrxs</span>
          </p>
        </section>

        {/* Community-Philosophie */}
        <section>
          <h2 className="text-base font-semibold mb-2">Community-Philosophie</h2>
          <p className="leading-relaxed">
            gleggmire.net lebt von der Community und fuer die Community. Jeder kann Inhalte einreichen, Begriffe vorschlagen und die Plattform mitgestalten. Wir setzen auf Transparenz, Respekt und den gemeinsamen Spass an der Sache. Die Seite ist nicht-kommerziell und wird ehrenamtlich betrieben.
          </p>
        </section>

        {/* Kontakt */}
        <section>
          <h2 className="text-base font-semibold mb-2">Kontakt</h2>
          <p className="leading-relaxed">
            E-Mail:{" "}
            <a href="mailto:kontakt@gleggmire.net" className="text-[#E8593C] underline hover:no-underline">
              kontakt@gleggmire.net
            </a>
            <br />
            Discord: <span className="font-bold">tetrxs</span>
          </p>
        </section>
      </div>
    </main>
  );
}
