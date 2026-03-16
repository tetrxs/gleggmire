import { describe, it, expect } from "vitest";
import { normalizeTerm, levenshteinDistance, findMatches } from "@/lib/utils/normalize";

describe("normalizeTerm", () => {
  it("lowercases input", () => {
    expect(normalizeTerm("GOEY")).toBe("goey");
  });

  it("replaces German umlauts (lowercase and uppercase)", () => {
    expect(normalizeTerm("Ärger")).toBe("aerger");
    expect(normalizeTerm("über")).toBe("ueber");
    expect(normalizeTerm("Öl")).toBe("oel");
    expect(normalizeTerm("Straße")).toBe("strasse");
  });

  it("replaces hyphens with spaces", () => {
    expect(normalizeTerm("goey-moment")).toBe("goey moment");
  });

  it("removes special characters", () => {
    expect(normalizeTerm("was?!")).toBe("was");
  });

  it("collapses multiple spaces", () => {
    expect(normalizeTerm("a    b")).toBe("a b");
  });

  it("trims whitespace", () => {
    expect(normalizeTerm("  test  ")).toBe("test");
  });
});

describe("levenshteinDistance", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshteinDistance("goey", "goey")).toBe(0);
  });

  it("returns string length for empty comparison", () => {
    expect(levenshteinDistance("abc", "")).toBe(3);
    expect(levenshteinDistance("", "abc")).toBe(3);
  });

  it("calculates single edit distance", () => {
    expect(levenshteinDistance("goey", "goe")).toBe(1); // deletion
    expect(levenshteinDistance("goey", "goey!")).toBe(1); // insertion
    expect(levenshteinDistance("goey", "goex")).toBe(1); // substitution
  });

  it("calculates multi-edit distance", () => {
    expect(levenshteinDistance("kitten", "sitting")).toBe(3);
  });

  it("is symmetric", () => {
    expect(levenshteinDistance("abc", "xyz")).toBe(levenshteinDistance("xyz", "abc"));
  });
});

describe("findMatches", () => {
  const existingTerms = [
    { id: "1", term: "Goey", slug: "goey", normalized: "goey", aliases: [] },
    { id: "2", term: "Goey Moment", slug: "goey-moment", normalized: "goey moment", aliases: [] },
    { id: "3", term: "Cope", slug: "cope", normalized: "cope", aliases: [] },
    { id: "4", term: "Seethe", slug: "seethe", normalized: "seethe", aliases: ["Seething"] },
  ];

  it("returns empty array for no matches", () => {
    const matches = findMatches("xyzyxzy", existingTerms);
    expect(matches).toHaveLength(0);
  });

  it("finds exact matches", () => {
    const matches = findMatches("Goey", existingTerms);
    const exact = matches.find((m) => m.matchType === "exact");
    expect(exact).toBeDefined();
    expect(exact!.term).toBe("Goey");
  });

  it("finds exact matches case-insensitively", () => {
    const matches = findMatches("goey", existingTerms);
    const exact = matches.find((m) => m.matchType === "exact");
    expect(exact).toBeDefined();
  });

  it("finds fuzzy matches within Levenshtein distance 2", () => {
    const matches = findMatches("Goex", existingTerms);
    const fuzzy = matches.filter((m) => m.matchType === "fuzzy");
    expect(fuzzy.length).toBeGreaterThan(0);
    expect(fuzzy.some((m) => m.term === "Goey")).toBe(true);
  });

  it("finds substring matches", () => {
    const matches = findMatches("Goey Mom", existingTerms);
    const substring = matches.filter((m) => m.matchType === "substring");
    expect(substring.some((m) => m.term === "Goey Moment")).toBe(true);
  });

  it("sorts exact matches before fuzzy before substring", () => {
    const matches = findMatches("Cope", existingTerms);
    if (matches.length > 1) {
      const types = matches.map((m) => m.matchType);
      const exactIdx = types.indexOf("exact");
      const fuzzyIdx = types.indexOf("fuzzy");
      const subIdx = types.indexOf("substring");
      if (exactIdx >= 0 && fuzzyIdx >= 0) expect(exactIdx).toBeLessThan(fuzzyIdx);
      if (fuzzyIdx >= 0 && subIdx >= 0) expect(fuzzyIdx).toBeLessThan(subIdx);
    }
  });
});
