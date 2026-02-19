import { createHmac, timingSafeEqual } from "crypto";
import { deflateRawSync, inflateRawSync } from "zlib";

export type ShareItem = {
  path: string;
  name: string;
  size: number;
  signedUrl: string;
  created_at?: string;
};

type SharePayload = {
  v: 1;
  exp: number;
  items: ShareItem[];
};

function base64UrlEncode(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64");
}

function getShareSecret(): string {
  const configured = process.env.SHARE_TOKEN_SECRET;
  if (configured) return configured;

  if (process.env.NODE_ENV !== "production") {
    return "pixn-dev-share-secret-change-in-prod";
  }

  throw new Error("SHARE_TOKEN_SECRET is required in production");
}

function sign(data: string): Buffer {
  return createHmac("sha256", getShareSecret()).update(data).digest();
}

export function createShareToken(input: {
  exp: number;
  items: ShareItem[];
}): string {
  const payload: SharePayload = {
    v: 1,
    exp: input.exp,
    items: input.items,
  };

  const compressed = deflateRawSync(Buffer.from(JSON.stringify(payload), "utf8"));
  const payloadSegment = base64UrlEncode(compressed);
  const signatureSegment = base64UrlEncode(sign(payloadSegment));
  return `${payloadSegment}.${signatureSegment}`;
}

export function verifyShareToken(token: string): SharePayload | null {
  const [payloadSegment, signatureSegment] = token.split(".");
  if (!payloadSegment || !signatureSegment) return null;

  const expected = sign(payloadSegment);
  const provided = base64UrlDecode(signatureSegment);

  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  try {
    const compressed = base64UrlDecode(payloadSegment);
    const json = inflateRawSync(compressed).toString("utf8");
    const parsed = JSON.parse(json) as SharePayload;

    if (parsed.v !== 1) return null;
    if (!Array.isArray(parsed.items)) return null;
    if (typeof parsed.exp !== "number" || Number.isNaN(parsed.exp)) return null;
    if (Date.now() > parsed.exp) return null;

    for (const item of parsed.items) {
      if (
        !item ||
        typeof item.path !== "string" ||
        typeof item.name !== "string" ||
        typeof item.size !== "number" ||
        typeof item.signedUrl !== "string"
      ) {
        return null;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}
