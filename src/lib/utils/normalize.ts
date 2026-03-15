/**
 * Normalization pipeline for fuzzy matching of glossary terms.
 * Used for duplicate detection when submitting new terms.
 */

const UMLAUT_MAP: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  Ä: "ae",
  Ö: "oe",
  Ü: "ue",
  ß: "ss",
};

export function normalizeTerm(input: string): string {
  let result = input.toLowerCase().trim();

  // Replace umlauts
  result = result.replace(/[äöüÄÖÜß]/g, (char) => UMLAUT_MAP[char] || char);

  // Replace hyphens with spaces
  result = result.replace(/-/g, " ");

  // Remove special characters (keep letters, numbers, spaces)
  result = result.replace(/[^a-z0-9\s]/g, "");

  // Collapse multiple spaces
  result = result.replace(/\s+/g, " ");

  return result.trim();
}

/**
 * Calculate Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Check if term matches existing terms using the 3-tier matching system.
 * Returns matches sorted by priority (exact > fuzzy > substring).
 */
export interface TermMatch {
  termId: string;
  term: string;
  slug: string;
  matchType: "exact" | "fuzzy" | "substring";
  distance?: number;
}

export function findMatches(
  input: string,
  existingTerms: Array<{
    id: string;
    term: string;
    slug: string;
    normalized: string;
    aliases: string[];
  }>
): TermMatch[] {
  const normalizedInput = normalizeTerm(input);
  if (normalizedInput.length < 3) return [];

  const matches: TermMatch[] = [];

  for (const entry of existingTerms) {
    const candidates = [entry.normalized, ...entry.aliases.map(normalizeTerm)];

    for (const candidate of candidates) {
      // Tier 1: Exact match after normalization
      if (normalizedInput === candidate) {
        matches.push({
          termId: entry.id,
          term: entry.term,
          slug: entry.slug,
          matchType: "exact",
        });
        break;
      }

      // Tier 2: Fuzzy match (Levenshtein ≤ 2)
      const distance = levenshteinDistance(normalizedInput, candidate);
      if (distance <= 2 && distance > 0) {
        matches.push({
          termId: entry.id,
          term: entry.term,
          slug: entry.slug,
          matchType: "fuzzy",
          distance,
        });
        break;
      }

      // Tier 3: Substring match
      if (
        normalizedInput.length >= 3 &&
        (candidate.includes(normalizedInput) ||
          normalizedInput.includes(candidate))
      ) {
        matches.push({
          termId: entry.id,
          term: entry.term,
          slug: entry.slug,
          matchType: "substring",
        });
        break;
      }
    }
  }

  // Sort: exact first, then fuzzy (by distance), then substring
  return matches.sort((a, b) => {
    const order = { exact: 0, fuzzy: 1, substring: 2 };
    if (order[a.matchType] !== order[b.matchType]) {
      return order[a.matchType] - order[b.matchType];
    }
    if (a.distance && b.distance) return a.distance - b.distance;
    return 0;
  });
}
