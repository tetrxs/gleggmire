import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { createClient } from "@supabase/supabase-js";

const REQUIRED_ENV = [
  "DISCORD_BOT_TOKEN",
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`Missing env var: ${key}`);
    process.exit(1);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

let terms = [];
let currentIndex = 0;

async function fetchTerms() {
  const { data, error } = await supabase
    .from("glossary_terms")
    .select("term")
    .eq("is_secret", false)
    .order("term", { ascending: true });

  if (error) {
    console.error("Failed to fetch terms:", error.message);
    return;
  }

  if (data && data.length > 0) {
    // Shuffle the terms
    terms = data.map((t) => t.term);
    for (let i = terms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [terms[i], terms[j]] = [terms[j], terms[i]];
    }
    currentIndex = 0;
    console.log(`Loaded ${terms.length} glossary terms`);
  }
}

function updateStatus() {
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

  // Reshuffle when we've gone through all terms
  if (currentIndex === 0 && terms.length > 1) {
    for (let i = terms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [terms[i], terms[j]] = [terms[j], terms[i]];
    }
  }
}

client.once("ready", async () => {
  console.log(`Bot online as ${client.user.tag}`);

  await fetchTerms();
  updateStatus();

  // Rotate status every 30 seconds
  setInterval(updateStatus, 30_000);

  // Refresh terms from DB every 10 minutes
  setInterval(fetchTerms, 10 * 60_000);
});

client.login(process.env.DISCORD_BOT_TOKEN);
