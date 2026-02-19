import { describe, expect, it } from "bun:test";
import { createShareToken, verifyShareToken } from "../lib/shareToken";

describe("shareToken", () => {
  it("creates and verifies a valid token", () => {
    const token = createShareToken({
      exp: Date.now() + 60_000,
      items: [
        {
          path: "user/a.jpg",
          name: "a.jpg",
          size: 1234,
          signedUrl: "https://example.com/a",
        },
      ],
    });

    const payload = verifyShareToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.items.length).toBe(1);
    expect(payload?.items[0].path).toBe("user/a.jpg");
  });

  it("rejects tampered tokens", () => {
    const token = createShareToken({
      exp: Date.now() + 60_000,
      items: [
        {
          path: "user/a.jpg",
          name: "a.jpg",
          size: 1234,
          signedUrl: "https://example.com/a",
        },
      ],
    });

    const tampered = `${token}x`;
    expect(verifyShareToken(tampered)).toBeNull();
  });

  it("rejects expired tokens", () => {
    const token = createShareToken({
      exp: Date.now() - 1_000,
      items: [
        {
          path: "user/a.jpg",
          name: "a.jpg",
          size: 1234,
          signedUrl: "https://example.com/a",
        },
      ],
    });

    expect(verifyShareToken(token)).toBeNull();
  });
});
