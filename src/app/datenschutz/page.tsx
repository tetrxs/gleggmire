import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklaerung — gleggmire.net",
  description:
    "Datenschutzerklaerung gemaess DSGVO fuer gleggmire.net – Informationen zur Datenverarbeitung.",
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-6">Datenschutzerklaerung</h1>

      <div className="card p-6 space-y-8 text-sm text-[var(--color-text)]">
        {/* Verantwortlicher */}
        <section>
          <h2 className="text-base font-semibold mb-2">1. Verantwortlicher</h2>
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
          <p className="mt-2 leading-relaxed">
            E-Mail:{" "}
            <a href="mailto:kontakt@gleggmire.net" className="text-[#E8593C] underline hover:no-underline">
              kontakt@gleggmire.net
            </a>
            <br />
            Discord: <span className="font-bold">tetrxs</span>
          </p>
        </section>

        {/* Hosting & Infrastruktur */}
        <section>
          <h2 className="text-base font-semibold mb-2">2. Hosting &amp; Infrastruktur</h2>
          <p className="mb-3">Fuer den Betrieb dieser Seite werden folgende Dienste eingesetzt:</p>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] dark:border-zinc-700">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] dark:border-zinc-700">
                  <th className="px-3 py-2 font-semibold">Dienst</th>
                  <th className="px-3 py-2 font-semibold">Zweck</th>
                  <th className="px-3 py-2 font-semibold">Standort</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Railway</td>
                  <td className="px-3 py-2">Application Hosting</td>
                  <td className="px-3 py-2">Niederlande (EU)</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Supabase</td>
                  <td className="px-3 py-2">Datenbank &amp; Auth</td>
                  <td className="px-3 py-2">EU</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Upstash Redis</td>
                  <td className="px-3 py-2">Rate-Limiting &amp; Cache</td>
                  <td className="px-3 py-2">EU</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Discord OAuth */}
        <section>
          <h2 className="text-base font-semibold mb-2">3. Discord OAuth</h2>
          <p className="leading-relaxed">
            Die Anmeldung erfolgt ueber Discord OAuth. Dabei werden folgende Daten von Discord uebermittelt:
          </p>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-[var(--color-muted)]">
            <li>Discord User ID</li>
            <li>Username</li>
            <li>Avatar URL</li>
          </ul>
          <p className="mt-2 font-bold">Die E-Mail-Adresse wird nicht gespeichert.</p>
        </section>

        {/* IP-Adressen & Logging */}
        <section>
          <h2 className="text-base font-semibold mb-2">4. IP-Adressen &amp; Logging</h2>
          <p className="leading-relaxed">
            Bei anonymen Kommentaren wird die IP-Adresse fuer maximal 90 Tage gespeichert. Diese ist ausschliesslich fuer den Administrator einsehbar und dient der Missbrauchspraevention.
          </p>
        </section>

        {/* YouTube & Twitch Embeds */}
        <section>
          <h2 className="text-base font-semibold mb-2">5. YouTube &amp; Twitch Embeds</h2>
          <p className="leading-relaxed">
            YouTube-Videos werden ueber <span className="font-bold">youtube-nocookie.com</span> eingebunden, um Tracking zu minimieren. Erst beim Abspielen werden Daten an YouTube/Google uebermittelt.
          </p>
          <p className="mt-2 leading-relaxed">
            Twitch-Embeds koennen eigene Tracking-Mechanismen enthalten. Beim Laden eines Twitch-Embeds werden Daten an Twitch/Amazon uebermittelt.
          </p>
        </section>

        {/* Cookies & LocalStorage */}
        <section>
          <h2 className="text-base font-semibold mb-2">6. Cookies &amp; LocalStorage</h2>
          <p className="leading-relaxed">
            Es werden <span className="font-bold">keine Tracking-Cookies</span> eingesetzt. Folgende Daten werden lokal im Browser gespeichert:
          </p>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-[var(--color-muted)]">
            <li>Stummschaltungsstatus (Mute)</li>
            <li>Hintergrundauswahl</li>
            <li>Entwuerfe bei Einreichungen (Drafts)</li>
            <li>Authentifizierungs-Session</li>
          </ul>
        </section>

        {/* Nutzerdaten & Loeschung */}
        <section>
          <h2 className="text-base font-semibold mb-2">7. Nutzerdaten &amp; Loeschung</h2>
          <p className="leading-relaxed">
            Du hast jederzeit das Recht auf Loeschung deiner Daten. Kontaktiere uns hierfuer per E-Mail oder Discord.
          </p>
          <p className="mt-2">Bei einer Loeschung werden:</p>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-[var(--color-muted)]">
            <li>Accountdaten (Discord ID, Username, Avatar) vollstaendig geloescht</li>
            <li>Einreichungen und Kommentare anonymisiert (Autorenzuordnung wird entfernt)</li>
          </ul>
        </section>

        {/* Speicherdauer */}
        <section>
          <h2 className="text-base font-semibold mb-2">8. Speicherdauer</h2>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] dark:border-zinc-700">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] dark:border-zinc-700">
                  <th className="px-3 py-2 font-semibold">Datenart</th>
                  <th className="px-3 py-2 font-semibold">Speicherdauer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Accountdaten</td>
                  <td className="px-3 py-2">Bis zur Loeschung</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">IP-Adressen</td>
                  <td className="px-3 py-2">90 Tage</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Sessions</td>
                  <td className="px-3 py-2">7 Tage</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Entwuerfe (Drafts)</td>
                  <td className="px-3 py-2">24 Stunden</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
