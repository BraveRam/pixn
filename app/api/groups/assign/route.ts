import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const groupId = typeof body?.groupId === "string" ? body.groupId : "";
    const rawPaths: unknown[] = Array.isArray(body?.paths) ? body.paths : [];
    const paths = Array.from(
      new Set(rawPaths.filter((path): path is string => typeof path === "string"))
    );

    if (!groupId || paths.length === 0) {
      return NextResponse.json(
        { error: "groupId and paths are required" },
        { status: 400 }
      );
    }

    if (paths.some((path) => !path.startsWith(`${user.id}/`))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: groupRow, error: groupError } = await supabase
      .from("groups")
      .select("id")
      .eq("id", groupId)
      .eq("user_id", user.id)
      .single();

    if (groupError || !groupRow) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const { data: images, error: imagesError } = await supabase
      .from("gallery")
      .select("path")
      .eq("user_id", user.id)
      .in("path", paths);

    if (imagesError || !images || images.length !== paths.length) {
      return NextResponse.json(
        { error: "Some selected images were not found" },
        { status: 404 }
      );
    }

    const rows = paths.map((path) => ({
      user_id: user.id,
      group_id: groupId,
      image_path: path,
    }));

    const { error: assignError } = await supabase
      .from("group_images")
      .upsert(rows, { onConflict: "user_id,group_id,image_path" });

    if (assignError) {
      return NextResponse.json({ error: assignError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, assigned: rows.length }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
