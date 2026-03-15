"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthButton } from "@/components/auth/auth-button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="w-full"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "2px solid var(--color-text)",
      }}
    >
      <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4">
        {/* Left: Logo Image */}
        <div className="flex items-center">
          <Link href="/" className="no-underline">
            <span
              className="text-4xl font-bold"
              style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}
            >
              G<span style={{ color: "var(--color-accent)" }}>G</span>.
            </span>
          </Link>
        </div>

        {/* Right: Actions (hidden on mobile) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/zufall"
            className="flex h-8 w-8 items-center justify-center rounded-full no-underline transition-colors"
            title="Zufaelliger Eintrag"
            style={{
              color: "var(--color-text)",
              border: "1.5px solid var(--color-text)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-text)";
              e.currentTarget.style.color = "var(--color-bg)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--color-text)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="3" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </Link>
          <ThemeToggle />
          <div className="ml-1">
            <AuthButton />
          </div>
        </div>

        {/* Mobile: Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu oeffnen"
            style={{ color: "var(--color-text)" }}
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-out menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{ borderTop: mobileMenuOpen ? "2px solid var(--color-text)" : "none" }}
      >
        <div className="px-4 py-4">
          <nav className="flex flex-col gap-0">
            {[
              { href: "/glossar", label: "GLOSSAR" },
              { href: "/einreichen", label: "EINREICHEN" },
              { href: "/leaderboard", label: "LEADERBOARD" },
              { href: "/zufall", label: "ZUFALL" },
              { href: "/about", label: "ABOUT" },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`py-2 text-sm font-medium uppercase no-underline transition-colors${isActive ? " sketch-underline" : ""}`}
                  style={{
                    color: isActive ? "var(--color-accent)" : "var(--color-text)",
                    letterSpacing: "0.08em",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--color-accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = isActive ? "var(--color-accent)" : "var(--color-text)")
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex items-center gap-2">
            <div>
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
