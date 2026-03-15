import type { ReactNode } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: "~" },
  { href: "/admin#queue", label: "Moderations-Queue", icon: ">" },
  { href: "/admin#users", label: "Nutzerverwaltung", icon: ">" },
  { href: "/admin#log", label: "Moderations-Log", icon: ">" },
  { href: "/admin#news", label: "Breaking News", icon: ">" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Admin Warning Banner */}
      <div className="xp-window-outer">
        <div
          className="flex items-center gap-3 px-4 py-2"
          style={{
            background:
              "linear-gradient(180deg, #CC0000 0%, #990000 100%)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: "12px",
            borderRadius: "8px 8px 4px 4px",
            border: "2px solid #660000",
            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="14" fill="#CC0000" />
            <circle cx="16" cy="16" r="12" fill="#FF3333" />
            <path
              d="M10 10L22 22M22 10L10 22"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span>
            Zugang nur fuer Admins — Unautorisierter Zugriff wird
            protokolliert!
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full shrink-0 md:w-56">
          <div className="xp-window-outer">
            <div
              className="xp-titlebar"
              style={{
                background:
                  "linear-gradient(180deg, #0A246A 0%, #3A6EA5 100%)",
              }}
            >
              <span className="truncate">Admin-Navigation</span>
            </div>
            <div className="xp-window p-2">
              <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="xp-button block text-left"
                    style={{ fontSize: "11px", padding: "4px 8px" }}
                  >
                    <span className="mr-1 font-mono text-[10px] text-[var(--xp-border-dark)]">
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
                <hr
                  className="my-1"
                  style={{ borderColor: "var(--xp-border-dark)" }}
                />
                <Link
                  href="/"
                  className="xp-button block text-left"
                  style={{ fontSize: "11px", padding: "4px 8px" }}
                >
                  <span className="mr-1 font-mono text-[10px] text-[var(--xp-border-dark)]">
                    {"<"}
                  </span>
                  Zurueck zur Seite
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
