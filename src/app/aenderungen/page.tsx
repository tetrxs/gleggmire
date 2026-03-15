import type { Metadata } from "next";
import { XpWindow } from "@/components/ui/xp-window";

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
    <div className="max-w-4xl mx-auto">
      <XpWindow title="📜 Änderungsprotokoll — changelog.exe">
        <div className="space-y-2">
          <p className="xp-text-body mb-4">
            Alle Bearbeitungen an Glossar-Einträgen werden hier öffentlich
            protokolliert — Wikipedia-Style.
          </p>

          <div className="xp-inset p-2">
            <table className="w-full" style={{ fontSize: "13px" }}>
              <thead>
                <tr
                  className="text-left"
                  style={{
                    borderBottom: "1px solid #808080",
                    fontSize: "11px",
                  }}
                >
                  <th className="py-1 px-2">Datum</th>
                  <th className="py-1 px-2">Begriff</th>
                  <th className="py-1 px-2">Feld</th>
                  <th className="py-1 px-2">Bearbeiter</th>
                  <th className="py-1 px-2">Begründung</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_EDITS.map((edit) => (
                  <tr
                    key={edit.id}
                    style={{ borderBottom: "1px solid #D4D0C8" }}
                  >
                    <td
                      className="py-2 px-2"
                      style={{ fontFamily: "Courier New, monospace" }}
                    >
                      {formatDate(edit.date)}
                    </td>
                    <td className="py-2 px-2">
                      <a
                        href={`/glossar/${edit.slug}`}
                        className="underline"
                        style={{ color: "var(--xp-blue-start)" }}
                      >
                        {edit.term}
                      </a>
                    </td>
                    <td className="py-2 px-2">
                      <span
                        className="px-1"
                        style={{
                          background: "#ECE9D8",
                          border: "1px solid #808080",
                          fontSize: "11px",
                        }}
                      >
                        {edit.field}
                      </span>
                    </td>
                    <td className="py-2 px-2">{edit.user}</td>
                    <td className="py-2 px-2 italic text-gray-600">
                      {edit.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="text-center pt-4"
            style={{ fontSize: "11px", color: "#808080" }}
          >
            Weitere Einträge werden geladen sobald die Datenbank verbunden ist.
          </p>
        </div>
      </XpWindow>
    </div>
  );
}
