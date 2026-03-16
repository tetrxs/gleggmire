import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { createClient } from "@supabase/supabase-js";

let started = false;

export function startDiscordBot() {
  if (started) return;
  started = true;

  const token = process.env.DISCORD_BOT_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!token || !supabaseUrl || !supabaseKey) {
    console.warn("Discord bot: missing env vars, skipping");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  let terms: string[] = [];
  let currentIndex = 0;

  async function fetchTerms() {
    const { data, error } = await supabase
      .from("glossary_terms")
      .select("term")
      .eq("is_secret", false)
      .order("term", { ascending: true });

    if (error) {
      console.error("Discord bot: failed to fetch terms:", error.message);
      return;
    }

    if (data && data.length > 0) {
      terms = data.map((t: { term: string }) => t.term);
      for (let i = terms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [terms[i], terms[j]] = [terms[j], terms[i]];
      }
      currentIndex = 0;
      console.log(`Discord bot: loaded ${terms.length} glossary terms`);
    }
  }

  function updateStatus() {
    if (!client.user) return;

    if (terms.length === 0) {
      client.user.setActivity("gleggmire.net", { type: ActivityType.Playing });
      return;
    }

    const term = terms[currentIndex];
    client.user.setPresence({
      activities: [
        {
          name: `gleggmire.net | ${term}`,
          type: ActivityType.Playing,
        },
      ],
      status: "online",
    });

    currentIndex = (currentIndex + 1) % terms.length;

    if (currentIndex === 0 && terms.length > 1) {
      for (let i = terms.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [terms[i], terms[j]] = [terms[j], terms[i]];
      }
    }
  }

  client.once("ready", async () => {
    console.log(`Discord bot: online as ${client.user?.tag}`);
    await fetchTerms();
    updateStatus();
    setInterval(updateStatus, 30_000);
    setInterval(fetchTerms, 10 * 60_000);
  });

  client.login(token).catch((err) => {
    console.error("Discord bot: login failed:", err);
  });
}
