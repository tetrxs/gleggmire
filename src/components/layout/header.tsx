"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthButton } from "@/components/auth/auth-button";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-surface) 80%, transparent)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-baseline gap-0.5 no-underline">
            <span
              className="text-xl font-bold tracking-tight"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "var(--color-text)",
              }}
            >
              gleggmire
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--color-accent)" }}
            >
              .net
            </span>
          </Link>
          <span
            className="hidden text-xs sm:inline-block"
            style={{ color: "var(--color-text-muted)" }}
          >
            Inoffizielles Fanprojekt
          </span>
        </div>

        {/* Center: Search (hidden on mobile) */}
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--color-text-muted)" }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Glossar durchsuchen..."
              className="w-full rounded-full py-2 pl-10 pr-4 text-sm transition-colors focus:outline-none"
              style={{
                backgroundColor: "var(--color-border)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              aria-label="Globale Suche"
            />
          </div>
        </div>

        {/* Right: Actions (hidden on mobile) */}
        <div className="hidden items-center gap-1 md:flex">
          <ThemeToggle />
          <Link
            href="/zufall"
            className="flex h-9 w-9 items-center justify-center rounded-lg no-underline transition-colors hover:bg-[var(--color-border)]"
            title="Zufaelliger Eintrag"
            style={{ color: "var(--color-text-muted)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="3" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="16" cy="16" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </Link>
          <div className="ml-2">
            <AuthButton />
          </div>
        </div>

        {/* Mobile: Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-border)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu oeffnen"
            style={{ color: "var(--color-text)" }}
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        style={{ borderTop: mobileMenuOpen ? "1px solid var(--color-border)" : "none" }}
      >
        <div className="px-4 py-4">
          {/* Mobile search */}
          <div className="relative mb-4">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--color-text-muted)" }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Glossar durchsuchen..."
              className="w-full rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none"
              style={{
                backgroundColor: "var(--color-border)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
              }}
              aria-label="Globale Suche"
            />
          </div>

          <nav className="flex flex-col gap-1">
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
                className="rounded-lg px-3 py-2 text-sm no-underline transition-colors"
                style={{ color: "var(--color-text)" }}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-border)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex items-center gap-2">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
