import type { Metadata } from "next";
import Link from "next/link";
import { getRecentEdits } from "@/lib/data/glossary";

export const metadata: Metadata = {
  title: "Änderungsprotokoll — gleggmire.net",
  description:
    "Öffentliches Änderungsprotokoll aller Bearbeitungen im Gleggmire-Glossar.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AenderungenPage() {
  const edits = await getRecentEdits();

  return (
    <div className="py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
        >
          Änderungsprotokoll
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
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
            color: "var(--color-text-muted)",
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
        {edits.map((edit) => (
          <div
            key={edit.id}
            className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 px-5 py-4 border-b last:border-b-0 hover:bg-[var(--color-bg)] transition-colors duration-150"
            style={{ borderColor: "var(--color-border)" }}
          >
            <span
              className="font-mono text-xs tabular-nums"
              style={{ color: "var(--color-text-muted)" }}
            >
              <span className="sm:hidden text-[10px] font-sans font-medium mr-1" style={{ color: "var(--color-text-muted)" }}>
                Datum:
              </span>
              {formatDate(edit.edited_at)}
            </span>
            <span className="text-sm">
              <span className="sm:hidden text-[10px] font-medium mr-1" style={{ color: "var(--color-text-muted)" }}>
                Begriff:
              </span>
              <Link
                href={`/glossar/${edit.glossary_terms?.slug ?? ""}`}
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                {edit.glossary_terms?.term ?? "Unbekannt"}
              </Link>
            </span>
            <span className="text-sm">
              <span className="sm:hidden text-[10px] font-medium mr-1" style={{ color: "var(--color-text-muted)" }}>
                Feld:
              </span>
              <span
                className="inline-block rounded-md px-2 py-0.5 text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
              >
                {edit.field_changed}
              </span>
            </span>
            <span className="text-sm">
              <span className="sm:hidden text-[10px] font-medium mr-1" style={{ color: "var(--color-text-muted)" }}>
                Bearbeiter:
              </span>
              {edit.edited_by.slice(0, 8)}...
            </span>
            <span className="text-sm italic" style={{ color: "var(--color-text-muted)" }}>
              <span className="sm:hidden text-[10px] font-medium mr-1 not-italic" style={{ color: "var(--color-text-muted)" }}>
                Begründung:
              </span>
              {edit.reason ?? "—"}
            </span>
          </div>
        ))}

        {edits.length === 0 && (
          <div className="px-5 py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
            Noch keine Änderungen vorhanden.
          </div>
        )}
      </div>
    </div>
  );
}
