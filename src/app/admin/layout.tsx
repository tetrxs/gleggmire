import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="py-10">
      {/* Page heading */}
      <h1
        className="text-2xl font-bold tracking-tight sm:text-3xl"
        style={{ color: "var(--color-text)" }}
      >
        Moderation
      </h1>
      <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
        Moderations- und Verwaltungspanel
      </p>

      <div className="mt-8">{children}</div>
    </div>
  );
}
