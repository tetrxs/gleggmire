"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <>
      <footer
        className="w-full"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Top: Branding + Social */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Left: GLEGG ON. + description */}
            <div className="flex flex-col gap-2">
              <Link href="/" className="no-underline">
                <span
                  className="text-3xl font-bold uppercase tracking-tight sm:text-4xl"
                  style={{
                    fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
                    color: "var(--color-text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  GLEGG ON<span style={{ color: "var(--color-accent)" }}>.</span>
                </span>
              </Link>
              <p className="max-w-xs text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Das Community-Glossar fuer alles rund um Gleggmire. Von Fans, fuer Fans.
              </p>
            </div>

            {/* Right: Social links */}
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-bold uppercase"
                style={{ color: "var(--color-text)", letterSpacing: "0.08em" }}
              >
                Folge Gleggmire
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.youtube.com/@Gleggmire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium no-underline transition-colors"
                  style={{ border: "1.5px solid var(--color-border)", color: "var(--color-text)" }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = "#FF0000";
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, #FF0000 8%, transparent)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  @Gleggmire
                </a>
                <a
                  href="https://www.twitch.tv/gleggmire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium no-underline transition-colors"
                  style={{ border: "1.5px solid var(--color-border)", color: "var(--color-text)" }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = "#9146FF";
                    e.currentTarget.style.backgroundColor = "color-mix(in srgb, #9146FF 8%, transparent)";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#9146FF" aria-hidden="true">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
                  </svg>
                  @gleggmire
                </a>
              </div>
            </div>
          </div>

          {/* Suggestion CTA */}
          <div
            className="mt-8 flex flex-col items-start gap-2 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1.5px solid var(--color-border)",
            }}
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
              VORSCHLAGEN &rarr;
            </button>
          </div>
        </div>

        {/* Bottom bar */}
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
