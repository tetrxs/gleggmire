import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/community/profile-view";
import { getDefinitionsByUser, getUserGleggScore } from "@/lib/data/glossary";

export const metadata: Metadata = {
  title: "Mein Profil — gleggmire.net",
  description: "Dein persoenliches Profil auf gleggmire.net",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/api/auth/login");
  }

  const discordId =
    authUser.user_metadata?.provider_id ?? authUser.user_metadata?.sub;

  // Current Discord username & avatar from auth metadata (always up-to-date after login)
  const currentUsername =
    authUser.user_metadata?.custom_claims?.global_name ??
    authUser.user_metadata?.full_name ??
    authUser.user_metadata?.name ??
    "User";
  const currentAvatar = authUser.user_metadata?.avatar_url;

  // Fetch user record from our users table
  const { data: dbUser } = await supabase
    .from("users")
    .select("*")
    .eq("discord_id", discordId)
    .single();

  // Sync DB if Discord username or avatar changed
  if (
    dbUser &&
    (dbUser.username !== currentUsername || dbUser.avatar_url !== currentAvatar)
  ) {
    const serviceClient = await createServiceClient();
    await serviceClient
      .from("users")
      .update({ username: currentUsername, avatar_url: currentAvatar })
      .eq("discord_id", discordId);
  }

  // Fetch user's badges
  const { data: badges } = await supabase
    .from("badges")
    .select("badge_type")
    .eq("user_id", authUser.id);

  // Fetch stats and live score in parallel
  const userBadges = badges?.map((b) => b.badge_type) ?? [];
  const [
    { count: termsCreated },
    { count: commentsCount },
    userDefinitions,
    liveScore,
  ] = await Promise.all([
    supabase
      .from("glossary_terms")
      .select("id", { count: "exact", head: true })
      .eq("created_by", authUser.id),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", authUser.id),
    getDefinitionsByUser(authUser.id),
    getUserGleggScore(authUser.id),
  ]);

  const profileData = {
    username: currentUsername,
    avatar_url: currentAvatar ?? dbUser?.avatar_url,
    glegg_score: liveScore,
    is_admin: dbUser?.is_admin ?? false,
    is_moderator: dbUser?.is_moderator ?? false,
    is_gleggmire: dbUser?.is_gleggmire ?? false,
    notifications_enabled: dbUser?.notifications_enabled ?? true,
    joined_at: dbUser?.joined_at ?? authUser.created_at,
    badges: userBadges,
    stats: {
      termsCreated: termsCreated ?? 0,
      definitionsWritten: userDefinitions.length,
      comments: commentsCount ?? 0,
    },
  };

  return <ProfileView profile={profileData} />;
}
