import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("groups")
      .select("id, name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ groups: data ?? [] }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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
    const rawName = typeof body?.name === "string" ? body.name.trim() : "";
    if (!rawName) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 });
    }

    if (rawName.length > 60) {
      return NextResponse.json(
        { error: "Group name must be at most 60 characters" },
        { status: 400 }
      );
    }

    const { data: existingGroup } = await supabase
      .from("groups")
      .select("id")
      .eq("user_id", user.id)
      .ilike("name", rawName)
      .maybeSingle();

    if (existingGroup) {
      return NextResponse.json(
        { error: "You already have a group with that name" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("groups")
      .insert({
        user_id: user.id,
        name: rawName,
      })
      .select("id, name, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ group: data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";
    const rawName = typeof body?.name === "string" ? body.name.trim() : "";

    if (!id || !rawName) {
      return NextResponse.json(
        { error: "Group id and name are required" },
        { status: 400 }
      );
    }

    if (rawName.length > 60) {
      return NextResponse.json(
        { error: "Group name must be at most 60 characters" },
        { status: 400 }
      );
    }

    const { data: currentGroup, error: currentGroupError } = await supabase
      .from("groups")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (currentGroupError || !currentGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const { data: duplicateGroup } = await supabase
      .from("groups")
      .select("id")
      .eq("user_id", user.id)
      .ilike("name", rawName)
      .neq("id", id)
      .maybeSingle();

    if (duplicateGroup) {
      return NextResponse.json(
        { error: "You already have a group with that name" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("groups")
      .update({ name: rawName })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, name, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ group: data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = typeof body?.id === "string" ? body.id : "";

    if (!id) {
      return NextResponse.json(
        { error: "Group id is required" },
        { status: 400 }
      );
    }

    const { data: currentGroup, error: currentGroupError } = await supabase
      .from("groups")
      .select("id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (currentGroupError || !currentGroup) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const { error } = await supabase
      .from("groups")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
