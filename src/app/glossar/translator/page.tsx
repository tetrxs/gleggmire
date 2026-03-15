import type { Metadata } from "next";
import { XpWindow } from "@/components/ui/xp-window";
import { FakeTranslator } from "@/components/troll/fake-translator";

export const metadata: Metadata = {
  title: "Glegg-Translator — gleggmire.net",
  description:
    "Uebersetze normales Deutsch in authentisches Gleggmire-Deutsch. Zertifiziert von der Gleggmire-Akademie fuer Sprachwissenschaften.",
};

export default function TranslatorPage() {
  return (
    <XpWindow title="&#x1F30D; Glegg-Translator v2.0 — uebersetzer.exe">
      <FakeTranslator />
    </XpWindow>
  );
}
