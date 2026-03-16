import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId || !botToken) {
    // If not configured, skip the check entirely
    return NextResponse.json({ member: true });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const discordId =
    user.user_metadata?.provider_id ?? user.user_metadata?.sub;

  if (!discordId) {
    return NextResponse.json({ member: true });
  }

  try {
    const res = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`,
      {
        headers: { Authorization: `Bot ${botToken}` },
      }
    );

    return NextResponse.json({ member: res.ok });
  } catch {
    // On error, assume member to avoid false alerts
    return NextResponse.json({ member: true });
  }
}
