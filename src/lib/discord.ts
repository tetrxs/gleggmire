import { createServiceClient } from "@/lib/supabase/server";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_API = "https://discord.com/api/v10";

interface DiscordEmbed {
  title: string;
  description: string;
  color?: number;
  url?: string;
  footer?: string;
}

/**
 * Send a DM to a Discord user using the Bot token.
 * Requires bot and user to share a server, OR the user authorized
 * with dm_channels.messages.write scope.
 */
async function sendDMWithBot(
  discordId: string,
  embed: DiscordEmbed,
): Promise<boolean> {
  if (!DISCORD_BOT_TOKEN) return false;

  try {
    const dmRes = await fetch(DISCORD_API + "/users/@me/channels", {
      method: "POST",
      headers: {
        Authorization: "Bot " + DISCORD_BOT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient_id: discordId }),
    });

    if (!dmRes.ok) {
      console.error("Discord DM channel error:", dmRes.status);
      return false;
    }

    const dm = await dmRes.json();

    const msgRes = await fetch(DISCORD_API + "/channels/" + dm.id + "/messages", {
      method: "POST",
      headers: {
        Authorization: "Bot " + DISCORD_BOT_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [{
          title: embed.title,
          description: embed.description,
          color: embed.color ?? 0xe8593c,
          url: embed.url,
          footer: { text: embed.footer ?? "gleggmire.net" },
          timestamp: new Date().toISOString(),
        }],
      }),
    });

    if (!msgRes.ok) {
      console.error("Discord send error:", msgRes.status);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Discord DM failed:", err);
    return false;
  }
}

/**
 * Send a notification DM to a user by their Supabase user ID.
 * Looks up their Discord ID from the users table and sends via Bot.
 */
export async function notifyUser(
  userId: string,
  embed: DiscordEmbed,
): Promise<boolean> {
  try {
    const supabase = await createServiceClient();
    const { data: user } = await supabase
      .from("users")
      .select("discord_id")
      .eq("id", userId)
      .maybeSingle();

    if (!user?.discord_id) return false;

    return sendDMWithBot(user.discord_id, embed);
  } catch {
    return false;
  }
}

/**
 * Send a notification DM to a user by their Discord ID directly.
 */
export async function notifyDiscordUser(
  discordId: string,
  embed: DiscordEmbed,
): Promise<boolean> {
  return sendDMWithBot(discordId, embed);
}

/**
 * Notify all admins about something (e.g., new term submission).
 */
export async function notifyAdmins(embed: DiscordEmbed): Promise<void> {
  const { ADMIN_DISCORD_IDS } = await import("@/lib/constants/admin");
  const results = await Promise.allSettled(
    ADMIN_DISCORD_IDS.map((id) => sendDMWithBot(id, embed))
  );
  const sent = results.filter((r) => r.status === "fulfilled" && r.value).length;
  if (sent === 0 && ADMIN_DISCORD_IDS.length > 0) {
    console.warn("Discord: Konnte keine Admin-Benachrichtigung senden. Bot muss auf einem gemeinsamen Server mit den Admins sein.");
  }
}
