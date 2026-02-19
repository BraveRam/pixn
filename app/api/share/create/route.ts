import { getCanonicalOrigin } from "@/lib/security";
import { createShareToken, type ShareItem } from "@/lib/shareToken";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_SHARE_IMAGES = 20;
const SHARE_TTL_SECONDS = 60 * 60 * 24 * 7;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawPaths = body?.paths;

    if (!Array.isArray(rawPaths) || rawPaths.length === 0) {
      return NextResponse.json(
        { error: "paths must be a non-empty array" },
        { status: 400 }
      );
    }

    const uniquePaths = Array.from(
      new Set(rawPaths.filter((path): path is string => typeof path === "string"))
    );

    if (uniquePaths.length === 0 || uniquePaths.length > MAX_SHARE_IMAGES) {
      return NextResponse.json(
        { error: `You can share between 1 and ${MAX_SHARE_IMAGES} images` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (uniquePaths.some((path) => !path.startsWith(`${user.id}/`))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: rows, error } = await supabase
      .from("gallery")
      .select("path, name, size, created_at")
      .eq("user_id", user.id)
      .in("path", uniquePaths);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!rows || rows.length !== uniquePaths.length) {
      return NextResponse.json(
        { error: "Some images were not found" },
        { status: 404 }
      );
    }

    const rowByPath = new Map(rows.map((row) => [row.path, row]));
    const items: ShareItem[] = [];

    for (const path of uniquePaths) {
      const row = rowByPath.get(path);
      if (!row) continue;

      const { data: signed, error: signedError } = await supabase.storage
        .from("images")
        .createSignedUrl(path, SHARE_TTL_SECONDS);

      if (signedError || !signed?.signedUrl) {
        return NextResponse.json(
          { error: "Failed to generate shared links" },
          { status: 500 }
        );
      }

      items.push({
        path: row.path,
        name: row.name,
        size: row.size,
        created_at: row.created_at ?? undefined,
        signedUrl: signed.signedUrl,
      });
    }

    const expiresAt = Date.now() + SHARE_TTL_SECONDS * 1000;
    const token = createShareToken({
      exp: expiresAt,
      items,
    });

    const origin = getCanonicalOrigin(request.url);
    const shareUrl = `${origin}/share/${token}`;

    return NextResponse.json({
      shareUrl,
      count: items.length,
      expiresAt: new Date(expiresAt).toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
