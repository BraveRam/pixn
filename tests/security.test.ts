import { describe, expect, it } from "bun:test";
import { getCanonicalOrigin, validateEmailRedirectTo } from "../lib/security";

describe("validateEmailRedirectTo", () => {
  it("accepts same-origin confirm redirect", () => {
    const value = validateEmailRedirectTo(
      "https://pixn.app/auth/confirm?token=123",
      "https://pixn.app/api/auth/sign-in"
    );

    expect(value).toBe("https://pixn.app/auth/confirm?token=123");
  });

  it("rejects different origin redirect", () => {
    const value = validateEmailRedirectTo(
      "https://evil.example/auth/confirm",
      "https://pixn.app/api/auth/sign-in"
    );

    expect(value).toBeNull();
  });

  it("rejects non-confirm path", () => {
    const value = validateEmailRedirectTo(
      "https://pixn.app/gallery",
      "https://pixn.app/api/auth/sign-in"
    );

    expect(value).toBeNull();
  });
});

describe("getCanonicalOrigin", () => {
  it("falls back to request origin when env is absent", () => {
    const original = process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const origin = getCanonicalOrigin("https://pixn.app/auth/callback?code=1");

    if (original) process.env.NEXT_PUBLIC_SITE_URL = original;
    expect(origin).toBe("https://pixn.app");
  });
});
