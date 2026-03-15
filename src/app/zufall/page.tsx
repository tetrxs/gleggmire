import type { Metadata } from "next";
import { RandomTermView } from "@/components/glossary/random-term-view";

export const metadata: Metadata = {
  title: "Zufälliger Begriff — gleggmire.net",
  description: "Glegg-Roulette: Entdecke einen zufälligen Gleggmire-Begriff!",
};

export default function ZufallPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <RandomTermView />
    </div>
  );
}
