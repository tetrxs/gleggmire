import type { Metadata } from "next";
import { ClipArchive } from "@/components/clips/clip-archive";
import { MOCK_CLIPS } from "@/lib/mock-clips";

export const metadata: Metadata = {
  title: "Clip-Archiv — gleggmire.net",
};

export default function ClipsPage() {
  // TODO: Replace mock data with Supabase query
  const clips = MOCK_CLIPS;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1
        className="text-3xl font-bold tracking-tight text-[var(--color-text)] mb-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        Clip-Archiv
      </h1>
      <p className="text-sm text-[var(--color-muted)] mb-8">
        Alle Community-Clips an einem Ort.
      </p>
      <ClipArchive clips={clips} />
    </main>
  );
}
