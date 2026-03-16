import { describe, it, expect } from "vitest";
import { generateSlug } from "@/lib/utils/slug";

describe("generateSlug", () => {
  it("lowercases the input", () => {
    expect(generateSlug("Goey")).toBe("goey");
  });

  it("replaces German umlauts", () => {
    expect(generateSlug("Brüder")).toBe("brueder");
    expect(generateSlug("Döner")).toBe("doener");
    expect(generateSlug("Ärger")).toBe("aerger");
    expect(generateSlug("Straße")).toBe("strasse");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateSlug("goey moment")).toBe("goey-moment");
  });

  it("removes special characters", () => {
    expect(generateSlug("was?!")).toBe("was");
    expect(generateSlug("cope & seethe")).toBe("cope-seethe");
  });

  it("collapses multiple hyphens", () => {
    expect(generateSlug("a---b")).toBe("a-b");
    expect(generateSlug("a   b")).toBe("a-b");
  });

  it("trims leading and trailing hyphens", () => {
    expect(generateSlug("-test-")).toBe("test");
    expect(generateSlug("  test  ")).toBe("test");
  });

  it("returns empty string for empty input", () => {
    expect(generateSlug("")).toBe("");
  });

  it("handles combined umlauts and spaces", () => {
    expect(generateSlug("Über Alles")).toBe("ueber-alles");
  });

  it("handles purely special-character input", () => {
    expect(generateSlug("???")).toBe("");
  });
});
