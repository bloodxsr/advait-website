import { describe, expect, it } from "vitest";
import { parseLimit, parseOffset } from "@/lib/query";
import { createSocialPostSchema } from "@/lib/validators/social-posts";
import { registerSchema } from "@/lib/validators/auth";

describe("backend contracts", () => {
  it("bounds and normalizes pagination inputs", () => {
    expect(parseLimit("500")).toBe(100);
    expect(parseLimit("invalid")).toBe(50);
    expect(parseOffset("-1")).toBe(0);
    expect(parseOffset("20")).toBe(20);
  });

  it("accepts gallery posts with multiple image URLs", () => {
    const result = createSocialPostSchema.safeParse({
      title: "Launch gallery",
      type: "gallery",
      imageUrls: ["https://cdn.example.com/one.webp", "https://cdn.example.com/two.webp"],
    });

    expect(result.success).toBe(true);
  });

  it("keeps join metadata in the registration contract", () => {
    const result = registerSchema.safeParse({
      name: "Builder",
      email: "builder@example.com",
      password: "secure-password",
      github: "builder",
      divisionSlug: "RED",
      intentNote: "I ship systems.",
    });

    expect(result.success).toBe(true);
  });
});
