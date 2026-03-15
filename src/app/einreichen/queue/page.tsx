import type { Metadata } from "next";
import { PublicQueue } from "@/components/admin/public-queue";

export const metadata: Metadata = {
  title: "Moderations-Queue — gleggmire.net",
  description:
    "Sieh dir ausstehende Einreichungen an und stimme ab. 10 Upvotes = automatisch freigeschaltet!",
};

export default function QueuePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PublicQueue />
    </div>
  );
}
