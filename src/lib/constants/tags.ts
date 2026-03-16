// Centralized tag color definitions for consistent rendering across all components.
// Covers all 18 predefined tags from tag-select.tsx.

const TAG_COLORS: Record<string, string> = {
  // Predefined tags (from tag-select.tsx)
  "GTA RP": "bg-teal-50 text-teal-700",
  Trolling: "bg-red-50 text-red-700",
  Reaktionen: "bg-amber-50 text-amber-700",
  Cops: "bg-blue-50 text-blue-700",
  Meta: "bg-yellow-50 text-yellow-700",
  Lore: "bg-indigo-50 text-indigo-700",
  Slang: "bg-yellow-50 text-yellow-700",
  "Vulgaer": "bg-red-50 text-red-700",
  Humor: "bg-pink-50 text-pink-700",
  Essen: "bg-orange-50 text-orange-700",
  "Getraenke": "bg-cyan-50 text-cyan-700",
  Personen: "bg-violet-50 text-violet-700",
  Insider: "bg-purple-50 text-purple-700",
  "Begruessung": "bg-green-50 text-green-700",
  Aktion: "bg-rose-50 text-rose-700",
  Objekte: "bg-stone-100 text-stone-700",
  "Gefuehl": "bg-sky-50 text-sky-700",
  "Sprueche": "bg-emerald-50 text-emerald-700",

  // Legacy / alternate casing
  Klassiker: "bg-blue-50 text-blue-700",
  Rauchen: "bg-gray-100 text-gray-700",
  Lifestyle: "bg-green-50 text-green-700",
  Universell: "bg-sky-50 text-sky-700",
  Meme: "bg-pink-50 text-pink-700",

  // Lowercase variants
  meme: "bg-pink-50 text-pink-700",
  insider: "bg-purple-50 text-purple-700",
  gameplay: "bg-teal-50 text-teal-700",
  community: "bg-sky-50 text-sky-700",
  catchphrase: "bg-green-50 text-green-700",
  meta: "bg-yellow-50 text-yellow-700",
  rage: "bg-red-50 text-red-700",
  wholesome: "bg-cyan-50 text-cyan-700",
  slang: "bg-yellow-50 text-yellow-700",
};

export function getTagClasses(tag: string): string {
  return TAG_COLORS[tag] ?? TAG_COLORS[tag.toLowerCase()] ?? "bg-gray-100 text-gray-600";
}
