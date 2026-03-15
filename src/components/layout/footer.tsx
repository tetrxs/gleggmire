"use client";

import Link from "next/link";
import { VisitCounter } from "@/components/troll/visit-counter";
import { SketchDivider } from "@/components/ui/sketch-elements";

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
            style={{
              fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
            }}
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
            style={{
              fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
            }}
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
          style={{
            borderBottom: "2px solid var(--color-border)",
          }}
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

        {/* Main footer content */}
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Left: Logo + Disclaimer */}
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-0">
              <span
                className="text-lg font-bold uppercase tracking-tight"
                style={{
                  fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
                  color: "var(--color-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                GLEGGMIRE
              </span>
              <span
                className="text-sm font-bold uppercase"
                style={{ color: "var(--color-accent)" }}
              >
                .NET
              </span>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Dieses Projekt ist ein unabhaengiges Fan-Projekt und steht in keiner
              offiziellen Verbindung zu Gleggmire. Alle Inhalte werden von der
              Community erstellt und kuratiert.
            </p>
          </div>

          {/* Middle: Navigation */}
          <div>
            <h3
              className="mb-3 text-xs font-bold uppercase"
              style={{
                color: "var(--color-text)",
                letterSpacing: "0.12em",
              }}
            >
              NAVIGATION
            </h3>
            <nav className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { href: "/glossar", label: "GLOSSAR" },
                { href: "/clips", label: "CLIPS" },
                { href: "/einreichen", label: "EINREICHEN" },
                { href: "/leaderboard", label: "LEADERBOARD" },
                { href: "/zufall", label: "ZUFALL" },
                { href: "/about", label: "ABOUT" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-medium uppercase no-underline transition-colors"
                  style={{
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.06em",
                  }}
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

          {/* Right: Contact */}
          <div>
            <h3
              className="mb-3 text-xs font-bold uppercase"
              style={{
                color: "var(--color-text)",
                letterSpacing: "0.12em",
              }}
            >
              KONTAKT
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <div
                className="flex items-center gap-2"
                style={{ color: "var(--color-text-muted)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                </svg>
                <span className="text-xs font-medium uppercase" style={{ letterSpacing: "0.04em" }}>tetrxs</span>
              </div>
              <a
                href="https://www.youtube.com/@Gleggmire"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm no-underline transition-colors"
                style={{ color: "var(--color-text-muted)" }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--color-accent)")
                }
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span className="text-xs font-medium uppercase" style={{ letterSpacing: "0.04em" }}>@Gleggmire</span>
              </a>
            </div>
          </div>
        </div>

        {/* Visitor Counter */}
        <div
          className="flex justify-center py-4"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <VisitCounter />
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
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
