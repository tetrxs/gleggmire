import type { Metadata } from "next";
import { XpWindow } from "@/components/ui/xp-window";
import { ClipArchive } from "@/components/clips/clip-archive";
import { MOCK_CLIPS } from "@/lib/mock-clips";

export const metadata: Metadata = {
  title: "Clip-Archiv — gleggmire.net",
};

export default function ClipsPage() {
  // TODO: Replace mock data with Supabase query
  const clips = MOCK_CLIPS;

  return (
    <XpWindow title="🎬 Clip-Archiv — clips.exe">
      <ClipArchive clips={clips} />
    </XpWindow>
  );
}
