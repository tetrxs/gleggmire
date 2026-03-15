import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz — gleggmire.net",
  description:
    "Datenschutzerklaerung gemaess DSGVO fuer gleggmire.net – Informationen zur Datenverarbeitung.",
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1
        className="mb-6 text-xl font-bold uppercase tracking-wide sm:text-2xl"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text)",
          letterSpacing: "0.04em",
        }}
      >
        Datenschutz
      </h1>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
        {/* 1. Verantwortlicher */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            1. Verantwortlicher
          </h2>
          <p>
            Hans Vincent Trommer
            <br />
            c/o MDC Management#57
            <br />
            Welserstrasse 3, 87463 Dietmannsried, Deutschland
          </p>
          <p className="mt-1">
            E-Mail:{" "}
            <a href="mailto:kontakt@gleggmire.net" className="font-medium no-underline" style={{ color: "var(--color-accent)" }}>
              kontakt@gleggmire.net
            </a>
            {" "}&middot; Discord: <span className="font-semibold">tetrxs</span>
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 2. Ueberblick */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            2. Ueberblick der Verarbeitung
          </h2>
          <p>
            gleggmire.net ist ein inoffizielles Fan-Projekt. Wir verarbeiten personenbezogene Daten
            nur soweit dies fuer den Betrieb der Webseite und ihrer Funktionen erforderlich ist.
            Es findet <strong>kein Tracking, keine Werbung und kein Profiling</strong> statt.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 3. Rechtsgrundlagen */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            3. Rechtsgrundlagen
          </h2>
          <ul className="ml-4 list-disc space-y-2" style={{ color: "var(--color-text-muted)" }}>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong>{" "}
              Discord OAuth Login, Cookie-Consent fuer optionale Dienste.
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Art. 6 Abs. 1 lit. b DSGVO (Vertragsdurchfuehrung):</strong>{" "}
              Bereitstellung der Webseite und ihrer Funktionen.
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):</strong>{" "}
              IP-Logging bei Kommentaren, technisch notwendige Cookies/LocalStorage.
            </li>
          </ul>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 4. Hosting */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            4. Hosting &amp; Infrastruktur
          </h2>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)]" style={{ backgroundColor: "var(--color-bg)" }}>
                  <th className="px-3 py-2 font-semibold">Dienst</th>
                  <th className="px-3 py-2 font-semibold">Zweck</th>
                  <th className="px-3 py-2 font-semibold">Standort</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Railway</td>
                  <td className="px-3 py-2">Application Hosting</td>
                  <td className="px-3 py-2">Niederlande (EU)</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Supabase</td>
                  <td className="px-3 py-2">Datenbank &amp; Auth</td>
                  <td className="px-3 py-2">Frankfurt, DE (EU)</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Upstash Redis</td>
                  <td className="px-3 py-2">Rate-Limiting</td>
                  <td className="px-3 py-2">EU</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Alle Dienste verarbeiten Daten ausschliesslich innerhalb der EU.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 5. Schriftarten */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            5. Schriftarten
          </h2>
          <p>
            Wir verwenden <strong>Inter</strong> und <strong>Space Grotesk</strong> (Google Fonts),
            die <strong>lokal von unserem Server</strong> ausgeliefert werden.
            Es findet keine Verbindung zu Google-Servern statt.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 6. Discord OAuth */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            6. Discord OAuth (Anmeldung)
          </h2>
          <p>
            Die Anmeldung erfolgt freiwillig ueber Discord OAuth 2.0. Folgende Daten werden abgefragt:
          </p>
          <ul className="ml-4 mt-1 list-disc space-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <li>Discord User ID</li>
            <li>Username &amp; Display Name</li>
            <li>Avatar URL</li>
          </ul>
          <p className="mt-2">
            <strong>Die E-Mail-Adresse wird nicht angefragt und nicht gespeichert.</strong>{" "}
            Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 7. Embeds */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            7. YouTube &amp; Twitch Embeds
          </h2>
          <p>
            YouTube-Videos werden ueber <strong>youtube-nocookie.com</strong> eingebunden.
            Twitch-Clips ueber Twitch-Embeds. Erst beim aktiven Abspielen werden Daten
            an YouTube (Google) bzw. Twitch (Amazon) uebermittelt. Beide sind unter dem
            EU-US Data Privacy Framework zertifiziert.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 8. IP */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            8. IP-Adressen &amp; Logging
          </h2>
          <p>
            Bei anonymen Kommentaren wird die IP-Adresse fuer max. <strong>90 Tage</strong> gespeichert
            (Missbrauchspraevention). Server-Access-Logs werden fuer max. 14 Tage aufbewahrt.
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 9. Cookies */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            9. Cookies &amp; LocalStorage
          </h2>
          <p className="mb-3">
            <strong>Keine Tracking-Cookies, keine Analyse-Tools.</strong> Wir verwenden:
          </p>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)]" style={{ backgroundColor: "var(--color-bg)" }}>
                  <th className="px-3 py-2 font-semibold">Name/Zweck</th>
                  <th className="px-3 py-2 font-semibold">Typ</th>
                  <th className="px-3 py-2 font-semibold">Dauer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Supabase Auth Session</td>
                  <td className="px-3 py-2">Cookie</td>
                  <td className="px-3 py-2">7 Tage</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Cookie-Consent Praeferenz</td>
                  <td className="px-3 py-2">LocalStorage</td>
                  <td className="px-3 py-2">1 Jahr</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Theme-Praeferenz (Hell/Dunkel)</td>
                  <td className="px-3 py-2">LocalStorage</td>
                  <td className="px-3 py-2">Dauerhaft</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Stummschaltungsstatus</td>
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
          <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
            YouTube/Twitch-Embeds werden erst nach Einwilligung geladen (Cookie-Consent).
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 10. Loeschung */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            10. Nutzerdaten &amp; Loeschung
          </h2>
          <p>
            Du hast jederzeit das Recht auf Loeschung deiner Daten. Bei einer Loeschung werden:
          </p>
          <ul className="ml-4 mt-1 list-disc space-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <li>Accountdaten (Discord ID, Username, Avatar) vollstaendig geloescht</li>
            <li>Einreichungen und Kommentare anonymisiert</li>
            <li>IP-Logs geloescht</li>
          </ul>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 11. Speicherdauer */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            11. Speicherdauer
          </h2>
          <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border)]" style={{ backgroundColor: "var(--color-bg)" }}>
                  <th className="px-3 py-2 font-semibold">Datenart</th>
                  <th className="px-3 py-2 font-semibold">Speicherdauer</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Accountdaten</td>
                  <td className="px-3 py-2">Bis zur Loeschung</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">IP-Adressen (Kommentare)</td>
                  <td className="px-3 py-2">90 Tage</td>
                </tr>
                <tr className="border-b border-[var(--color-border)]">
                  <td className="px-3 py-2">Server-Access-Logs</td>
                  <td className="px-3 py-2">14 Tage</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Auth-Session</td>
                  <td className="px-3 py-2">7 Tage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 12. Rechte */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            12. Deine Rechte (Art. 15–21 DSGVO)
          </h2>
          <ul className="ml-4 list-disc space-y-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            <li><strong style={{ color: "var(--color-text)" }}>Auskunft</strong> (Art. 15) — Welche Daten ueber dich gespeichert sind</li>
            <li><strong style={{ color: "var(--color-text)" }}>Berichtigung</strong> (Art. 16) — Korrektur unrichtiger Daten</li>
            <li><strong style={{ color: "var(--color-text)" }}>Loeschung</strong> (Art. 17) — Loeschung deiner Daten</li>
            <li><strong style={{ color: "var(--color-text)" }}>Einschraenkung</strong> (Art. 18) — Einschraenkung der Verarbeitung</li>
            <li><strong style={{ color: "var(--color-text)" }}>Datenuebertragbarkeit</strong> (Art. 20) — Export deiner Daten</li>
            <li><strong style={{ color: "var(--color-text)" }}>Widerspruch</strong> (Art. 21) — Widerspruch gegen Verarbeitung</li>
          </ul>
          <p className="mt-2">
            Kontakt:{" "}
            <a href="mailto:kontakt@gleggmire.net" className="font-medium no-underline" style={{ color: "var(--color-accent)" }}>
              kontakt@gleggmire.net
            </a>
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 13. Beschwerderecht */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            13. Beschwerderecht
          </h2>
          <p>
            Zustaendige Aufsichtsbehoerde: Bayerisches Landesamt fuer Datenschutzaufsicht (BayLDA),
            Promenade 18, 91522 Ansbach &mdash;{" "}
            <a href="https://www.lda.bayern.de" className="font-medium no-underline" style={{ color: "var(--color-accent)" }} target="_blank" rel="noopener noreferrer">
              www.lda.bayern.de
            </a>
          </p>
        </section>

        <div style={{ borderTop: "1px solid var(--color-border)" }} />

        {/* 14. Aenderungen */}
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
            14. Aenderungen
          </h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklaerung bei Bedarf anzupassen.
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
            Stand: Maerz 2026
          </p>
        </section>
      </div>
    </main>
  );
}
