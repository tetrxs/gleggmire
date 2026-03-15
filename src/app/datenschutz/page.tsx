import type { Metadata } from "next";
import { XpWindow } from "@/components/ui/xp-window";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — gleggmire.net",
  description:
    "Datenschutzerklärung gemäß DSGVO für gleggmire.net – Informationen zur Datenverarbeitung.",
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <XpWindow title="🔒 Datenschutzerklärung — DSGVO">
        <div className="space-y-6 xp-text-body">
          {/* Verantwortlicher */}
          <section>
            <h2 className="xp-text-heading mb-2">1. Verantwortlicher</h2>
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
            <p className="mt-1">
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

          {/* Hosting & Infrastruktur */}
          <section>
            <h2 className="xp-text-heading mb-2">
              2. Hosting &amp; Infrastruktur
            </h2>
            <p className="mb-2">
              Für den Betrieb dieser Seite werden folgende Dienste eingesetzt:
            </p>
            <div className="xp-inset overflow-x-auto bg-white/50 p-2">
              <table className="w-full text-left xp-text-label">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="px-2 py-1 font-bold">Dienst</th>
                    <th className="px-2 py-1 font-bold">Zweck</th>
                    <th className="px-2 py-1 font-bold">Standort</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="px-2 py-1">Railway</td>
                    <td className="px-2 py-1">Application Hosting</td>
                    <td className="px-2 py-1">Niederlande (EU)</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="px-2 py-1">Supabase</td>
                    <td className="px-2 py-1">Datenbank &amp; Auth</td>
                    <td className="px-2 py-1">EU</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1">Upstash Redis</td>
                    <td className="px-2 py-1">Rate-Limiting &amp; Cache</td>
                    <td className="px-2 py-1">EU</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Discord OAuth */}
          <section>
            <h2 className="xp-text-heading mb-2">3. Discord OAuth</h2>
            <p>
              Die Anmeldung erfolgt über Discord OAuth. Dabei werden folgende
              Daten von Discord übermittelt:
            </p>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li>Discord User ID</li>
              <li>Username</li>
              <li>Avatar URL</li>
            </ul>
            <p className="mt-2 font-bold">
              Die E-Mail-Adresse wird nicht gespeichert.
            </p>
          </section>

          {/* IP-Adressen & Logging */}
          <section>
            <h2 className="xp-text-heading mb-2">
              4. IP-Adressen &amp; Logging
            </h2>
            <p>
              Bei anonymen Kommentaren wird die IP-Adresse für maximal 90 Tage
              gespeichert. Diese ist ausschließlich für den Administrator
              einsehbar und dient der Missbrauchsprävention.
            </p>
          </section>

          {/* YouTube & Twitch Embeds */}
          <section>
            <h2 className="xp-text-heading mb-2">
              5. YouTube &amp; Twitch Embeds
            </h2>
            <p>
              YouTube-Videos werden über{" "}
              <span className="font-bold">youtube-nocookie.com</span>{" "}
              eingebunden, um Tracking zu minimieren. Erst beim Abspielen werden
              Daten an YouTube/Google übermittelt.
            </p>
            <p className="mt-2">
              Twitch-Embeds können eigene Tracking-Mechanismen enthalten. Beim
              Laden eines Twitch-Embeds werden Daten an Twitch/Amazon
              übermittelt.
            </p>
          </section>

          {/* Cookies & LocalStorage */}
          <section>
            <h2 className="xp-text-heading mb-2">
              6. Cookies &amp; LocalStorage
            </h2>
            <p>
              Es werden <span className="font-bold">keine Tracking-Cookies</span>{" "}
              eingesetzt. Folgende Daten werden lokal im Browser gespeichert:
            </p>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li>Stummschaltungsstatus (Mute)</li>
              <li>Hintergrundauswahl</li>
              <li>Entwürfe bei Einreichungen (Drafts)</li>
              <li>Authentifizierungs-Session</li>
            </ul>
          </section>

          {/* Nutzerdaten & Löschung */}
          <section>
            <h2 className="xp-text-heading mb-2">
              7. Nutzerdaten &amp; Löschung
            </h2>
            <p>
              Du hast jederzeit das Recht auf Löschung deiner Daten. Kontaktiere
              uns hierfür per E-Mail oder Discord.
            </p>
            <p className="mt-2">Bei einer Löschung werden:</p>
            <ul className="ml-4 mt-1 list-disc space-y-1">
              <li>
                Accountdaten (Discord ID, Username, Avatar) vollständig gelöscht
              </li>
              <li>
                Einreichungen und Kommentare anonymisiert (Autorenzuordnung wird
                entfernt)
              </li>
            </ul>
          </section>

          {/* Speicherdauer */}
          <section>
            <h2 className="xp-text-heading mb-2">8. Speicherdauer</h2>
            <div className="xp-inset overflow-x-auto bg-white/50 p-2">
              <table className="w-full text-left xp-text-label">
                <thead>
                  <tr className="border-b border-gray-400">
                    <th className="px-2 py-1 font-bold">Datenart</th>
                    <th className="px-2 py-1 font-bold">Speicherdauer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="px-2 py-1">Accountdaten</td>
                    <td className="px-2 py-1">Bis zur Löschung</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="px-2 py-1">IP-Adressen</td>
                    <td className="px-2 py-1">90 Tage</td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="px-2 py-1">Sessions</td>
                    <td className="px-2 py-1">7 Tage</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-1">Entwürfe (Drafts)</td>
                    <td className="px-2 py-1">24 Stunden</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </XpWindow>
    </main>
  );
}
