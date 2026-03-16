import { describe, it, expect } from "vitest";
import { isAdminDiscordId } from "@/lib/utils/auth-check";

describe("isAdminDiscordId", () => {
  it("returns true for the configured admin Discord ID", () => {
    expect(isAdminDiscordId("303835609762627586")).toBe(true);
  });

  it("returns false for random Discord IDs", () => {
    expect(isAdminDiscordId("123456789")).toBe(false);
    expect(isAdminDiscordId("")).toBe(false);
    expect(isAdminDiscordId("000000000000000000")).toBe(false);
  });
});
