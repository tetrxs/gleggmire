export async function register() {
  // Only run on the server (not edge runtime, not client)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startDiscordBot } = await import("@/lib/discord-bot");
    startDiscordBot();
  }
}
