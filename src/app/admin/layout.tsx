import type { ReactNode } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin#queue", label: "Moderations-Queue" },
  { href: "/admin#users", label: "Nutzerverwaltung" },
  { href: "/admin#log", label: "Moderations-Log" },
  { href: "/admin#news", label: "Breaking News" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Admin Warning Banner */}
      <div className="flex items-center gap-3 rounded-xl bg-red-600 px-4 py-3 text-white shadow-sm">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span className="text-sm font-semibold">
          Zugang nur fuer Admins — Unautorisierter Zugriff wird protokolliert!
        </span>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full shrink-0 md:w-56">
          <div className="card p-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Admin-Navigation
            </p>
            <nav className="flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-[var(--color-text)] no-underline transition-colors hover:bg-[var(--color-border)] dark:hover:bg-zinc-700"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-1 border-[var(--color-border)] dark:border-zinc-700" />
              <Link
                href="/"
                className="block rounded-md px-3 py-2 text-sm text-[var(--color-muted)] no-underline transition-colors hover:bg-[var(--color-border)] hover:text-[var(--color-text)] dark:hover:bg-zinc-700"
              >
                Zurueck zur Seite
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
