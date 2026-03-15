"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "linear-gradient(180deg, #1F4ECC 0%, #3A92D8 100%)",
        borderBottom: "2px solid #0A246A",
      }}
    >
      <div className="mx-auto flex h-[38px] max-w-7xl items-center justify-between px-3">
        {/* Left: Logo + Badge */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-white no-underline"
          >
            <span className="text-[15px] font-bold tracking-wide drop-shadow-[1px_1px_1px_rgba(0,0,0,0.4)]">
              gleggmire.net
            </span>
            <span
              className="hidden rounded-sm px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white sm:inline-block"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              Inoffizielles Fanprojekt
            </span>
          </Link>
        </div>

        {/* Center: Search (hidden on mobile) */}
        <div className="hidden flex-1 justify-center px-8 md:flex">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Glossar durchsuchen..."
              className="xp-inset w-full bg-white px-3 py-1 text-[12px] text-black placeholder:text-gray-500 focus:outline-none"
              aria-label="Globale Suche"
            />
            <button
              className="absolute right-0 top-0 flex h-full items-center px-2 text-[12px] text-gray-600 hover:text-black"
              aria-label="Suchen"
            >
              &#128269;
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/zufall"
            className="xp-button flex items-center gap-1 text-[11px] no-underline"
            title="Zufaelliger Eintrag"
          >
            &#127922; Zufall
          </Link>
          <button className="xp-button text-[11px]">
            &#128100; Login
          </button>
        </div>

        {/* Mobile: Hamburger */}
        <button
          className="flex h-7 w-7 items-center justify-center rounded text-white md:hidden"
          style={{ background: "rgba(255,255,255,0.15)" }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu oeffnen"
        >
          <span className="text-[16px] leading-none">
            {mobileMenuOpen ? "\u2715" : "\u2630"}
          </span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          className="border-t border-[#0A246A] px-4 py-3 md:hidden"
          style={{ background: "linear-gradient(180deg, #2B5FB5 0%, #1F4ECC 100%)" }}
        >
          {/* Mobile search */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Glossar durchsuchen..."
              className="xp-inset w-full bg-white px-3 py-1.5 text-[12px] text-black placeholder:text-gray-500 focus:outline-none"
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
                className="rounded px-3 py-1.5 text-[12px] text-white no-underline hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex gap-2">
            <Link
              href="/zufall"
              className="xp-button flex-1 text-center text-[11px] no-underline"
              onClick={() => setMobileMenuOpen(false)}
            >
              &#127922; Zufall
            </Link>
            <button className="xp-button flex-1 text-[11px]">
              &#128100; Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
