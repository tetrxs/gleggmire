import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Änderungsprotokoll — gleggmire.net",
  description:
    "Öffentliches Änderungsprotokoll aller Bearbeitungen im Gleggmire-Glossar.",
};

// Mock edit history data
const MOCK_EDITS = [
  {
    id: "1",
    term: "Gegläggmirt",
    slug: "geglaggmirt",
    field: "definition",
    user: "TrollMeister42",
    reason: "Weil ich es kann",
    date: "2026-03-14T18:30:00Z",
  },
  {
    id: "2",
    term: "Kanackentasche",
    slug: "kanackentasche",
    field: "example_sentence",
    user: "SchleimExperte",
    reason: "Besseres Beispiel gefunden",
    date: "2026-03-13T14:20:00Z",
  },
  {
    id: "3",
    term: "Snench",
    slug: "snench",
    field: "tags",
    user: "GleggFan99",
    reason: "Tag 'Klassiker' hinzugefügt",
    date: "2026-03-12T09:15:00Z",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AenderungenPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Änderungsprotokoll
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
          Alle Bearbeitungen an Glossar-Einträgen werden hier öffentlich
          protokolliert — Wikipedia-Style.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-xl border"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        {/* Table header */}
        <div
          className="hidden sm:grid sm:grid-cols-5 gap-4 px-5 py-3 text-xs font-medium border-b"
          style={{
            color: "var(--color-muted)",
            borderColor: "var(--color-border)",
          }}
        >
          <span>Datum</span>
          <span>Begriff</span>
          <span>Feld</span>
          <span>Bearbeiter</span>
          <span>Begründung</span>
        </div>

        {/* Table rows */}
        {MOCK_EDITS.map((edit) => (
          <div
            key={edit.id}
            className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 px-5 py-4 border-b last:border-b-0 hover:bg-[var(--color-bg)] transition-colors duration-150"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span
              className="font-mono text-xs tabular-nums"
              style={{ color: "var(--color-muted)" }}
            >
              <span className="sm:hidden text-[10px] font-sans font-medium mr-1" style={{ color: "var(--color-muted)" }}>
                Datum:
              </span>
              {formatDate(edit.date)}
            </span>
            <span className="text-sm">
              <span className="sm:hidden text-[10px] font-medium mr-1" style={{ color: "var(--color-muted)" }}>
                Begriff:
              </span>
              <Link
                href={`/glossar/${edit.slug}`}
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                {edit.term}
              </Link>
            </span>
            <span className="text-sm">
              <span className="sm:hidden text-[10px] font-medium mr-1" style={{ color: "var(--color-muted)" }}>
                Feld:
              </span>
              <span
                className="inline-block rounded-md px-2 py-0.5 text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--color-border)",
                  color: "var(--color-muted)",
                }}
              >
                {edit.field}
              </span>
            </span>
            <span className="text-sm">
              <span className="sm:hidden text-[10px] font-medium mr-1" style={{ color: "var(--color-muted)" }}>
                Bearbeiter:
              </span>
              {edit.user}
            </span>
            <span className="text-sm italic" style={{ color: "var(--color-muted)" }}>
              <span className="sm:hidden text-[10px] font-medium mr-1 not-italic" style={{ color: "var(--color-muted)" }}>
                Begründung:
              </span>
              {edit.reason}
            </span>
          </div>
        ))}
      </div>

      <p
        className="mt-6 text-center text-xs"
        style={{ color: "var(--color-muted)" }}
      >
        Weitere Einträge werden geladen sobald die Datenbank verbunden ist.
      </p>
    </main>
  );
}
