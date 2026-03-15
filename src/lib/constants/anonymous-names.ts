// Anonymous display names for users who post without logging in.
// Names are intentionally absurd German troll-culture names.

export const ANONYMOUS_NAMES: string[] = [
  "Anonymer Schleimbeutel #4711",
  "Unbekannter Cop-Troller",
  "Geheimer Seitenbacher-Agent",
  "Mysterioeser Mausrutscher",
  "Namenloser Nudeltopf",
  "Getarnter Glegg-Geist",
  "Unsichtbarer Uwe",
  "Phantomkommentator",
  "Der stille Seether",
  "Maskierter Maulwurf",
  "Verborgener Vorlagenleser",
  "Anonyme Ameise aus Aachen",
  "Unerkannter Unterhosen-Falter",
  "Geheimnisvoller Gurkenfresser",
  "Verschleierter Vollpfosten",
  "Inkognito-Igel",
  "Schattenkommentator 3000",
  "Unidentifizierter Ufo-Pilot",
  "Der maskierte Marmeladendieb",
  "Anonymer Ananas-Enthusiast",
  "Getarnter Gartenzwerg",
  "Namenloser Nachtschattengewaechs",
  "Unbekannter Butterbrot-Bandit",
  "Versteckter Vokuhila-Traeger",
  "Geheimer Gleggmire-Juenger",
  "Anonymer Almansen-Troll",
  "Mysterioeser Mettbroetchenfan",
  "Unsichtbarer Sockenpuppen-Meister",
  "Phantasie-Phantom aus Paderborn",
  "Der unbekannte Unterbewertete",
  "Maskierter Mittwochsfrosch",
  "Anonymer Aluhutraeger",
  "Getarnter Gratismentalitaetler",
  "Namenloser Nachtwanderer",
  "Inkognito-Kartoffelkaempfer",
  "Verschleierter Vierkanttroll",
  "Verborgener Bierschinken-Baron",
  "Unerkannter Ehrenmann im Schatten",
  "Der geheime Spaetzle-Spion",
  "Anonymer Autobahn-Philosoph",
  "Mysterioeser Monitor-Lecker",
  "Unsichtbarer USB-Stick-Sammler",
  "Getarnter Gegenwind-Generator",
  "Phantomhafter Pfandflaschen-Sammler",
  "Namenloser Nudelsieb-Ritter",
  "Unbekannter Untermieter im Keller",
  "Maskierter Meme-Magier",
  "Anonymer Alt-Tab-Kuenstler",
  "Verschollener Vollzeitcoper",
  "Der letzte Lansen-Leser",
];

/**
 * Returns a deterministic anonymous name based on a seed value
 * (e.g. comment ID or IP hash). The same seed always produces the same name.
 */
export function getAnonymousName(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % ANONYMOUS_NAMES.length;
  return ANONYMOUS_NAMES[index];
}

/**
 * Returns a random anonymous name (non-deterministic).
 */
export function getRandomAnonymousName(): string {
  const index = Math.floor(Math.random() * ANONYMOUS_NAMES.length);
  return ANONYMOUS_NAMES[index];
}
