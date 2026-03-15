"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/glossar", label: "Glossar", icon: "\uD83D\uDCD6" },
  { href: "/clips", label: "Clips", icon: "\uD83C\uDFAC" },
  { href: "/einreichen", label: "Einreichen", icon: "\u270F\uFE0F" },
  { href: "/leaderboard", label: "Profil", icon: "\uD83D\uDC64" },
] as const;

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background: "linear-gradient(180deg, #3168B0 0%, #1F3B73 100%)",
        borderTop: "2px solid #0A246A",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-white no-underline transition-colors ${
              isActive ? "bg-white/15" : "hover:bg-white/10"
            }`}
          >
            <span className="text-[18px] leading-none">{item.icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
