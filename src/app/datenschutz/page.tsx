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
        {/* 1. Verantwortlicher */}
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

        {/* 2. Ueberblick */}
        <section>
          <h2 className="text-base font-semibold mb-2">2. Ueberblick der Verarbeitung</h2>
          <p className="leading-relaxed">
            gleggmire.net ist ein inoffizielles Fan-Projekt. Wir verarbeiten personenbezogene Daten
            nur soweit dies fuer den Betrieb der Webseite und ihrer Funktionen erforderlich ist.
            Es findet <span className="font-bold">kein Tracking, keine Werbung und kein Profiling</span> statt.
          </p>
        </section>

        {/* 3. Rechtsgrundlagen */}
        <section>
          <h2 className="text-base font-semibold mb-2">3. Rechtsgrundlagen</h2>
          <p className="leading-relaxed mb-2">
            Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage folgender Rechtsgrundlagen:
          </p>
          <ul className="ml-4 list-disc space-y-2 text-[var(--color-text-muted)]">
            <li>
              <span className="font-semibold text-[var(--color-text)]">Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</span>{" "}
              Discord OAuth Login — du entscheidest aktiv, dich anzumelden.
            </li>
            <li>
              <span className="font-semibold text-[var(--color-text)]">Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchfuehrung):</span>{" "}
              Bereitstellung der Webseite und ihrer Funktionen (Glossar, Kommentare, Einreichungen).
            </li>
            <li>
              <span className="font-semibold text-[var(--color-text)]">Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):</span>{" "}
              IP-Logging bei Kommentaren zur Missbrauchspraevention, technisch notwendige Cookies/LocalStorage.
            </li>
          </ul>
        </section>

        {/* 4. Hosting & Infrastruktur */}
        <section>
          <h2 className="text-base font-semibold mb-2">4. Hosting &amp; Infrastruktur</h2>
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
                  <td className="px-3 py-2">Frankfurt, Deutschland (EU)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Upstash Redis</td>
                  <td className="px-3 py-2">Rate-Limiting &amp; Cache</td>
                  <td className="px-3 py-2">EU</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
            Alle Dienste verarbeiten Daten ausschliesslich innerhalb der EU. Es findet keine Datenuebermittlung
            in Drittlaender statt (mit Ausnahme von YouTube/Twitch-Embeds, siehe Abschnitt 7).
          </p>
        </section>

        {/* 5. Schriftarten */}
        <section>
          <h2 className="text-base font-semibold mb-2">5. Schriftarten</h2>
          <p className="leading-relaxed">
            Diese Webseite verwendet die Schriftarten <span className="font-bold">Inter</span> und{" "}
            <span className="font-bold">Space Grotesk</span> (Google Fonts).
            Die Schriftarten werden <span className="font-bold">lokal von unserem eigenen Server</span> ausgeliefert
            (Self-Hosting). Es findet <span className="font-bold">keine Verbindung zu Google-Servern</span> statt
            und es werden keine Daten an Google uebermittelt.
          </p>
        </section>

        {/* 6. Discord OAuth */}
        <section>
          <h2 className="text-base font-semibold mb-2">6. Discord OAuth (Anmeldung)</h2>
          <p className="leading-relaxed">
            Die Anmeldung erfolgt freiwillig ueber Discord OAuth 2.0. Dabei wirst du zu Discord weitergeleitet
            und entscheidest dort, ob du gleggmire.net Zugriff auf folgende Daten gewaehrst:
          </p>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-[var(--color-text-muted)]">
            <li>Discord User ID (eindeutige Kennung)</li>
            <li>Username &amp; Display Name</li>
            <li>Avatar URL</li>
          </ul>
          <p className="mt-2 leading-relaxed">
            <span className="font-bold">Die E-Mail-Adresse wird nicht angefragt und nicht gespeichert.</span>{" "}
            Du kannst deinen Account jederzeit loeschen lassen (siehe Abschnitt 10).
          </p>
          <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch aktiven Login).
          </p>
        </section>

        {/* 7. YouTube & Twitch Embeds */}
        <section>
          <h2 className="text-base font-semibold mb-2">7. YouTube &amp; Twitch Embeds</h2>
          <p className="leading-relaxed">
            YouTube-Videos werden ueber <span className="font-bold">youtube-nocookie.com</span> eingebunden
            (erweiterter Datenschutzmodus). Erst beim aktiven Abspielen eines Videos werden Daten an
            YouTube (Google Ireland Limited) uebermittelt, darunter IP-Adresse und Geraeteinformationen.
          </p>
          <p className="mt-2 leading-relaxed">
            Twitch-Clips werden ueber Twitch-Embeds eingebunden. Beim Laden eines Twitch-Embeds werden
            Daten an Twitch (Amazon) uebermittelt.
          </p>
          <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
            Bei beiden Diensten kann eine Datenuebermittlung in die USA stattfinden. Google und Amazon
            sind unter dem EU-US Data Privacy Framework zertifiziert.
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Darstellung von Inhalten).
          </p>
        </section>

        {/* 8. IP-Adressen & Logging */}
        <section>
          <h2 className="text-base font-semibold mb-2">8. IP-Adressen &amp; Logging</h2>
          <p className="leading-relaxed">
            Bei anonymen Kommentaren wird die IP-Adresse fuer maximal <span className="font-bold">90 Tage</span> gespeichert.
            Diese ist ausschliesslich fuer den Administrator einsehbar und dient der Missbrauchspraevention
            (z.B. Spam, Beleidigungen).
          </p>
          <p className="mt-2 leading-relaxed">
            Server-Access-Logs (IP-Adresse, Zeitstempel, aufgerufene URL) werden durch den Hosting-Anbieter
            fuer maximal 14 Tage gespeichert.
          </p>
          <p className="mt-2 leading-relaxed text-[var(--color-text-muted)]">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an Sicherheit und Missbrauchsschutz).
          </p>
        </section>

        {/* 9. Cookies & LocalStorage */}
        <section>
          <h2 className="text-base font-semibold mb-2">9. Cookies &amp; LocalStorage</h2>
          <p className="leading-relaxed">
            Es werden <span className="font-bold">keine Tracking-Cookies und keine Analyse-Tools</span> eingesetzt.
            Wir verwenden ausschliesslich technisch notwendige Cookies und LocalStorage:
          </p>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] dark:border-zinc-700 mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)] dark:border-zinc-700">
                  <th className="px-3 py-2 font-semibold">Name/Zweck</th>
                  <th className="px-3 py-2 font-semibold">Typ</th>
                  <th className="px-3 py-2 font-semibold">Dauer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Supabase Auth Session</td>
                  <td className="px-3 py-2">Cookie</td>
                  <td className="px-3 py-2">7 Tage</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Theme-Praeferenz (Hell/Dunkel)</td>
                  <td className="px-3 py-2">LocalStorage</td>
                  <td className="px-3 py-2">Dauerhaft</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Stummschaltungsstatus</td>
                  <td className="px-3 py-2">LocalStorage</td>
                  <td className="px-3 py-2">Dauerhaft</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Hintergrundauswahl</td>
                  <td className="px-3 py-2">LocalStorage</td>
                  <td className="px-3 py-2">Dauerhaft</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Entwuerfe bei Einreichungen</td>
                  <td className="px-3 py-2">LocalStorage</td>
                  <td className="px-3 py-2">24 Stunden</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 leading-relaxed text-[var(--color-text-muted)]">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an technischer Funktionalitaet).
            Ein Cookie-Banner ist nicht erforderlich, da keine optionalen Cookies eingesetzt werden.
          </p>
        </section>

        {/* 10. Nutzerdaten & Loeschung */}
        <section>
          <h2 className="text-base font-semibold mb-2">10. Nutzerdaten &amp; Loeschung</h2>
          <p className="leading-relaxed">
            Du hast jederzeit das Recht auf Loeschung deiner Daten. Kontaktiere uns hierfuer per E-Mail
            oder Discord.
          </p>
          <p className="mt-2">Bei einer Loeschung werden:</p>
          <ul className="ml-4 mt-2 list-disc space-y-1 text-[var(--color-text-muted)]">
            <li>Accountdaten (Discord ID, Username, Avatar) vollstaendig geloescht</li>
            <li>Einreichungen und Kommentare anonymisiert (Autorenzuordnung wird entfernt)</li>
            <li>IP-Logs, die deinem Account zugeordnet sind, geloescht</li>
          </ul>
        </section>

        {/* 11. Speicherdauer */}
        <section>
          <h2 className="text-base font-semibold mb-2">11. Speicherdauer</h2>
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
                  <td className="px-3 py-2">IP-Adressen (Kommentare)</td>
                  <td className="px-3 py-2">90 Tage</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Server-Access-Logs</td>
                  <td className="px-3 py-2">14 Tage</td>
                </tr>
                <tr className="border-b border-[var(--color-border)] dark:border-zinc-700">
                  <td className="px-3 py-2">Auth-Session</td>
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

        {/* 12. Deine Rechte */}
        <section>
          <h2 className="text-base font-semibold mb-2">12. Deine Rechte (Art. 15–21 DSGVO)</h2>
          <p className="leading-relaxed mb-2">
            Du hast gegenueber uns folgende Rechte bezueglich deiner personenbezogenen Daten:
          </p>
          <ul className="ml-4 list-disc space-y-1 text-[var(--color-text-muted)]">
            <li><span className="text-[var(--color-text)]">Auskunftsrecht</span> (Art. 15 DSGVO) — Welche Daten ueber dich gespeichert sind</li>
            <li><span className="text-[var(--color-text)]">Berichtigungsrecht</span> (Art. 16 DSGVO) — Korrektur unrichtiger Daten</li>
            <li><span className="text-[var(--color-text)]">Loeschungsrecht</span> (Art. 17 DSGVO) — Loeschung deiner Daten</li>
            <li><span className="text-[var(--color-text)]">Einschraenkungsrecht</span> (Art. 18 DSGVO) — Einschraenkung der Verarbeitung</li>
            <li><span className="text-[var(--color-text)]">Datenuebertragbarkeit</span> (Art. 20 DSGVO) — Export deiner Daten</li>
            <li><span className="text-[var(--color-text)]">Widerspruchsrecht</span> (Art. 21 DSGVO) — Widerspruch gegen Verarbeitung</li>
          </ul>
          <p className="mt-3 leading-relaxed">
            Zur Ausuebung deiner Rechte kannst du uns jederzeit per E-Mail ({" "}
            <a href="mailto:kontakt@gleggmire.net" className="text-[#E8593C] underline hover:no-underline">
              kontakt@gleggmire.net
            </a>
            ) oder Discord kontaktieren.
          </p>
        </section>

        {/* 13. Beschwerderecht */}
        <section>
          <h2 className="text-base font-semibold mb-2">13. Beschwerderecht bei einer Aufsichtsbehoerde</h2>
          <p className="leading-relaxed">
            Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehoerde zu beschweren,
            wenn du der Ansicht bist, dass die Verarbeitung deiner Daten gegen die DSGVO verstoesst.
            Die fuer uns zustaendige Aufsichtsbehoerde ist:
          </p>
          <p className="mt-2 leading-relaxed">
            Bayerisches Landesamt fuer Datenschutzaufsicht (BayLDA)
            <br />
            Promenade 18, 91522 Ansbach
            <br />
            <a href="https://www.lda.bayern.de" className="text-[#E8593C] underline hover:no-underline" target="_blank" rel="noopener noreferrer">
              www.lda.bayern.de
            </a>
          </p>
        </section>

        {/* 14. Aenderungen */}
        <section>
          <h2 className="text-base font-semibold mb-2">14. Aenderungen dieser Datenschutzerklaerung</h2>
          <p className="leading-relaxed">
            Wir behalten uns vor, diese Datenschutzerklaerung anzupassen, um sie an geaenderte
            Rechtslagen oder technische Aenderungen anzupassen. Die aktuelle Version gilt ab dem Zeitpunkt
            der Veroeffentlichung auf dieser Seite.
          </p>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Stand: Maerz 2026
          </p>
        </section>
      </div>
    </main>
  );
}
