import { describe, it, expect } from "vitest";
import { getTagClasses } from "@/lib/constants/tags";

describe("getTagClasses", () => {
  it("returns correct classes for predefined tags", () => {
    expect(getTagClasses("Insider")).toContain("purple");
    expect(getTagClasses("Essen")).toContain("orange");
    expect(getTagClasses("Slang")).toContain("yellow");
    expect(getTagClasses("Meme")).toContain("pink");
  });

  it("handles lowercase tag variants", () => {
    expect(getTagClasses("meme")).toContain("pink");
    expect(getTagClasses("insider")).toContain("purple");
    expect(getTagClasses("rage")).toContain("red");
  });

  it("falls back to case-insensitive lookup", () => {
    expect(getTagClasses("MEME")).toContain("pink");
    expect(getTagClasses("INSIDER")).toContain("purple");
  });

  it("returns gray fallback for unknown tags", () => {
    expect(getTagClasses("unbekannt")).toBe("bg-gray-100 text-gray-600");
    expect(getTagClasses("xyz")).toBe("bg-gray-100 text-gray-600");
  });

  it("covers all predefined tags from tag-select", () => {
    const predefined = [
      "GTA RP", "Trolling", "Reaktionen", "Cops", "Meta", "Lore",
      "Slang", "Humor", "Essen", "Personen", "Insider", "Aktion", "Objekte",
    ];
    for (const tag of predefined) {
      const classes = getTagClasses(tag);
      expect(classes).not.toBe("bg-gray-100 text-gray-600");
    }
  });
});
