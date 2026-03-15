import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="xp-raised mt-auto w-full"
      style={{ backgroundColor: "var(--xp-luna-body)" }}
    >
      {/* Main footer content */}
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Left: Logo + Tagline + Disclaimer */}
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-[16px] font-bold">gleggmire.net</span>
            <p className="mt-1 text-[11px]" style={{ color: "var(--xp-border-dark)" }}>
              Das inoffizielle Gleggmire-Glossar &amp; Clip-Archiv
            </p>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: "var(--xp-border-dark)" }}>
            Dieses Projekt ist ein unabhaengiges Fan-Projekt und steht in keiner offiziellen
            Verbindung zu Gleggmire. Alle Inhalte werden von der Community erstellt und
            kuratiert.
          </p>
        </div>

        {/* Middle: Navigation */}
        <div>
          <h3
            className="mb-3 text-[12px] font-bold uppercase tracking-wider"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Navigation
          </h3>
          <nav className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {[
              { href: "/glossar", label: "Glossar" },
              { href: "/clips", label: "Clips" },
              { href: "/einreichen", label: "Einreichen" },
              { href: "/leaderboard", label: "Leaderboard" },
              { href: "/zufall", label: "Zufall" },
              { href: "/about", label: "About" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[12px] no-underline hover:underline"
                style={{ color: "var(--xp-blau-start)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Contact */}
        <div>
          <h3
            className="mb-3 text-[12px] font-bold uppercase tracking-wider"
            style={{ color: "var(--xp-border-dark)" }}
          >
            Kontakt
          </h3>
          <div className="flex flex-col gap-2 text-[12px]">
            <div className="flex items-center gap-2">
              <span>Discord:</span>
              <span className="font-bold">tetrxs</span>
            </div>
            <a
              href="https://www.youtube.com/@Gleggmire"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline hover:underline"
              style={{ color: "var(--xp-blau-start)" }}
            >
              YouTube: @Gleggmire
            </a>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        className="xp-inset px-6 py-2"
        style={{ backgroundColor: "var(--xp-silber-luna)" }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 sm:flex-row">
          <span className="text-[10px]" style={{ color: "var(--xp-border-dark)" }}>
            &copy; 2026 gleggmire.net
          </span>
          <div className="flex gap-4">
            <Link
              href="/impressum"
              className="text-[10px] no-underline hover:underline"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="text-[10px] no-underline hover:underline"
              style={{ color: "var(--xp-border-dark)" }}
            >
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
