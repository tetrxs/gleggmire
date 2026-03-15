import type { Metadata } from "next";
import { RandomTermView } from "@/components/glossary/random-term-view";

export const metadata: Metadata = {
  title: "Zufälliger Begriff — gleggmire.net",
  description: "Glegg-Roulette: Entdecke einen zufälligen Gleggmire-Begriff!",
};

export default function ZufallPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <RandomTermView />
    </main>
  );
}
