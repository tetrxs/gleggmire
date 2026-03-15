"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      {/* Marquee ticker */}
      <div
        className="mt-auto w-full overflow-hidden"
        style={{
          backgroundColor: "var(--color-text)",
          color: "var(--color-bg)",
          borderTop: "2px solid var(--color-text)",
          borderBottom: "2px solid var(--color-text)",
        }}
      >
        <div className="flex py-3">
          <div
            className="flex shrink-0 animate-marquee items-center gap-0 whitespace-nowrap"
            style={{ fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-sm font-bold uppercase tracking-wider">
                &nbsp;&nbsp;GLEGGMIRE&nbsp;&middot;&nbsp;GLOSSAR&nbsp;&middot;&nbsp;COMMUNITY&nbsp;&middot;&nbsp;CLIPS&nbsp;&middot;&nbsp;DEFINITIONEN&nbsp;&middot;
              </span>
            ))}
          </div>
          <div
            className="flex shrink-0 animate-marquee items-center gap-0 whitespace-nowrap"
            aria-hidden="true"
            style={{ fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="text-sm font-bold uppercase tracking-wider">
                &nbsp;&nbsp;GLEGGMIRE&nbsp;&middot;&nbsp;GLOSSAR&nbsp;&middot;&nbsp;COMMUNITY&nbsp;&middot;&nbsp;CLIPS&nbsp;&middot;&nbsp;DEFINITIONEN&nbsp;&middot;
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer
        className="w-full"
        style={{
          backgroundColor: "var(--color-surface)",
          borderTop: "none",
        }}
      >
        {/* Big playful text */}
        <div
          className="flex items-center justify-center py-8"
          style={{ borderBottom: "2px solid var(--color-border)" }}
        >
          <span
            className="text-center text-4xl font-bold uppercase tracking-tight sm:text-5xl md:text-6xl"
            style={{
              fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            GLEGG ON<span style={{ color: "var(--color-accent)" }}>.</span>
          </span>
        </div>

        {/* Main footer content – 3 columns */}
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Left: Logo Image + short description */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="no-underline">
              <Image
                src="/images/gleggmire_title.png"
                alt="GLEGGMIRE.NET"
                width={280}
                height={70}
                className="h-[70px] w-auto"
              />
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              Das Community-Glossar fuer alles rund um Gleggmire.
              Von Fans, fuer Fans.
            </p>
          </div>

          {/* Middle: Navigation */}
          <div>
            <h3
              className="mb-3 text-xs font-bold uppercase"
              style={{ color: "var(--color-text)", letterSpacing: "0.12em" }}
            >
              NAVIGATION
            </h3>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { href: "/glossar", label: "GLOSSAR" },
                { href: "/leaderboard", label: "LEADERBOARD" },
                { href: "/zufall", label: "ZUFALL" },
                { href: "/about", label: "ABOUT" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-medium uppercase no-underline transition-colors"
                  style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.color = "var(--color-accent)")
                  }
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                    (e.currentTarget.style.color = "var(--color-text-muted)")
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: YouTube + Twitch */}
          <div>
            <h3
              className="mb-3 text-xs font-bold uppercase"
              style={{ color: "var(--color-text)", letterSpacing: "0.12em" }}
            >
              GLEGGMIRE FOLGEN
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.youtube.com/@Gleggmire"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-2 no-underline transition-colors"
                style={{
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <div>
                  <span className="block text-xs font-bold uppercase">YouTube</span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>@Gleggmire</span>
                </div>
              </a>
              <a
                href="https://www.twitch.tv/gleggmire"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg p-2 no-underline transition-colors"
                style={{
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.borderColor = "#9146FF";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#9146FF" aria-hidden="true">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                </svg>
                <div>
                  <span className="block text-xs font-bold uppercase">Twitch</span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>gleggmire</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Suggestion promo strip */}
        <div
          className="flex items-center justify-between gap-4 px-6 py-4 sm:gap-8"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            <span className="font-semibold" style={{ color: "var(--color-text)" }}>
              Hast du eine Idee fuer die Seite?
            </span>{" "}
            Neue Features, Verbesserungen, Wuensche &mdash; wir lesen alles.
          </p>
          <button
            className="shrink-0 text-xs font-bold uppercase transition-colors"
            style={{ color: "var(--color-accent)", letterSpacing: "0.08em", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("open-suggestion-modal"));
              }
            }}
          >
            VORSCHLAGEN →
          </button>
        </div>

        {/* Bottom strip */}
        <div
          className="px-6 py-3"
          style={{
            backgroundColor: "var(--color-bg)",
            borderTop: "2px solid var(--color-text)",
          }}
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-1 sm:flex-row">
            <span
              className="text-xs font-medium uppercase"
              style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
            >
              &copy; 2026 GLEGGMIRE.NET
            </span>
            <div className="flex gap-4">
              <Link
                href="/impressum"
                className="text-xs font-medium uppercase no-underline transition-colors"
                style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--color-accent)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                IMPRESSUM
              </Link>
              <Link
                href="/datenschutz"
                className="text-xs font-medium uppercase no-underline transition-colors"
                style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--color-accent)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                DATENSCHUTZ
              </Link>
              <button
                className="text-xs font-medium uppercase transition-colors"
                style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.color = "var(--color-accent)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("open-cookie-settings"));
                  }
                }}
              >
                COOKIE-EINSTELLUNGEN
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
