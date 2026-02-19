import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const groupId = request.nextUrl.searchParams.get("groupId");
    if (!groupId) {
      return NextResponse.json({ error: "groupId is required" }, { status: 400 });
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

    const { data: links, error: linksError } = await supabase
      .from("group_images")
      .select("image_path")
      .eq("user_id", user.id)
      .eq("group_id", groupId);

    if (linksError) {
      return NextResponse.json({ error: linksError.message }, { status: 400 });
    }

    const paths = links?.map((row) => row.image_path) ?? [];
    if (paths.length === 0) {
      return NextResponse.json({ images: [] }, { status: 200 });
    }

    const { data: images, error: imagesError } = await supabase
      .from("gallery")
      .select("path, name, size, favorite, created_at")
      .eq("user_id", user.id)
      .in("path", paths)
      .order("created_at", { ascending: false });

    if (imagesError) {
      return NextResponse.json({ error: imagesError.message }, { status: 400 });
    }

    const signed = await Promise.all(
      (images ?? []).map(async (img) => {
        const { data } = await supabase.storage
          .from("images")
          .createSignedUrl(img.path, 60 * 60 * 24 * 30);
        return {
          ...img,
          signedUrl: data?.signedUrl ?? null,
        };
      })
    );

    return NextResponse.json(
      { images: signed.filter((img) => img.signedUrl) },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
