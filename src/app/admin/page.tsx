import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin-Panel — gleggmire.net",
  description: "Administrations- und Moderationspanel fuer gleggmire.net",
};

// TODO: Real auth check will be added when Supabase is connected
export default function AdminPage() {
  return <AdminDashboard />;
}
