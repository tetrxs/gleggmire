import type { Metadata } from "next";
import { LeaderboardView } from "@/components/community/leaderboard-view";
import { MOCK_USERS } from "@/lib/mock-users";

export const metadata: Metadata = {
  title: "Leaderboard — gleggmire.net",
};

export default function LeaderboardPage() {
  // TODO: Replace mock data with Supabase query
  const users = MOCK_USERS;

  return <LeaderboardView users={users} />;
}
