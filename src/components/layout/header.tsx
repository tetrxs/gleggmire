"use client";

import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthButton } from "@/components/auth/auth-button";

export default function Header() {
  return (
    <header
      className="w-full"
      style={{
        backgroundColor: "var(--color-bg)",
        borderBottom: "2px solid var(--color-text)",
      }}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4">
        {/* Left: Logo + Name */}
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image
            src="/images/favicon.png"
            alt="gleggmire.net"
            width={40}
            height={40}
            className="block"
          />
          <span
            className="hidden text-xl font-bold uppercase tracking-tight sm:block"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-accent)" }}
          >
            GLEGGMIRE.NET
          </span>
        </Link>

        {/* Right: Theme + Auth */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
