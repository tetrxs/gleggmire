import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthLevel } from "@/lib/utils/auth-check";
import { getAllUsers } from "@/lib/data/users";
import { getRecentModerationLog } from "@/lib/data/moderation-log";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Moderation — gleggmire.net",
  description: "Moderations- und Verwaltungspanel fuer gleggmire.net",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  const authLevel = await getAuthLevel();

  if (authLevel !== "admin" && authLevel !== "mod") {
    redirect("/");
  }

  const serviceClient = await createServiceClient();

  const [allUsers, moderationLog, { count: pendingReportsCount }] = await Promise.all([
    getAllUsers(),
    getRecentModerationLog(),
    serviceClient.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  return (
    <AdminDashboard
      allUsers={allUsers}
      moderationLog={moderationLog}
      pendingReportsCount={pendingReportsCount ?? 0}
      authLevel={authLevel}
    />
  );
}
