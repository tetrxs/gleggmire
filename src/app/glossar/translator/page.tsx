import type { Metadata } from "next";
import { FakeTranslator } from "@/components/troll/fake-translator";

export const metadata: Metadata = {
  title: "Glegg-Translator — gleggmire.net",
  description:
    "Übersetze normales Deutsch in authentisches Gleggmire-Deutsch. Zertifiziert von der Gleggmire-Akademie für Sprachwissenschaften.",
};

export default function TranslatorPage() {
  return (
    <div className="py-10">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
        >
          Glegg-Translator
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Übersetze normales Deutsch in authentisches Gleggmire-Deutsch.
          Zertifiziert von der Gleggmire-Akademie für Sprachwissenschaften.
        </p>
      </div>

      <div
        className="rounded-xl border p-6"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
        }}
      >
        <FakeTranslator />
      </div>
    </div>
  );
}
