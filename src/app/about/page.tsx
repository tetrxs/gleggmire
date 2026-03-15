import type { Metadata } from "next";
import { XpWindow } from "@/components/ui/xp-window";

export const metadata: Metadata = {
  title: "Über gleggmire.net — about",
  description:
    "Über gleggmire.net – ein interaktives Fan-Community-Projekt für den YouTuber Gleggmire.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <XpWindow title="ℹ️ Über gleggmire.net — about.exe">
        <div className="space-y-6 xp-text-body">
          {/* Projektbeschreibung */}
          <section>
            <h2 className="xp-text-heading mb-2">Was ist gleggmire.net?</h2>
            <p>
              gleggmire.net ist eine interaktive Fan-Community-Plattform für den
              YouTuber Gleggmire. Die Seite bietet ein von der Community
              gepflegtes Glossar, Clip-Einreichungen, Leaderboards und mehr –
              alles im nostalgischen Windows-XP-Design.
            </p>
          </section>

          {/* Fan-Disclaimer */}
          <section className="xp-inset bg-white/50 p-3">
            <h2 className="xp-text-heading mb-2">Fan-Disclaimer</h2>
            <p>
              Diese Seite ist ein inoffizielles Fan-Projekt der
              Gleggmire-Community und steht in keiner Verbindung zu Gleggmire
              oder dessen offiziellen Kanälen. Alle Inhalte wurden von der
              Community erstellt und gepflegt. Das Glossar erhebt keinen
              Anspruch auf Vollständigkeit oder Richtigkeit. Bei Problemen,
              Beschwerden oder Fragen bitte direkt über Discord melden:{" "}
              <span className="font-bold">tetrxs</span>
            </p>
          </section>

          {/* Community-Philosophie */}
          <section>
            <h2 className="xp-text-heading mb-2">Community-Philosophie</h2>
            <p>
              gleggmire.net lebt von der Community und für die Community. Jeder
              kann Inhalte einreichen, Begriffe vorschlagen und die Plattform
              mitgestalten. Wir setzen auf Transparenz, Respekt und den
              gemeinsamen Spaß an der Sache. Die Seite ist nicht-kommerziell und
              wird ehrenamtlich betrieben.
            </p>
          </section>

          {/* Kontakt */}
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
        </div>
      </XpWindow>
    </main>
  );
}
