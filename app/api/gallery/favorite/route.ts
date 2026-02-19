import { createClient } from "@/utils/supabase/server";
import { isUserOwnedPath } from "@/lib/gallerySecurity";
import { NextRequest, NextResponse } from "next/server";

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
        const { path } = body;

        if (!path) {
            return NextResponse.json(
                { error: "Path is required" },
                { status: 400 }
            );
        }

        if (!isUserOwnedPath(user.id, path)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Get current favorite status
        const { data: currentData, error: fetchError } = await supabase
            .from("gallery")
            .select("favorite")
            .eq("path", path)
            .eq("user_id", user.id)
            .single();

        if (fetchError) {
            return NextResponse.json(
                { error: fetchError.message },
                { status: 400 }
            );
        }

        // Toggle favorite
        const { data, error } = await supabase
            .from("gallery")
            .update({ favorite: !currentData.favorite })
            .eq("path", path)
            .eq("user_id", user.id)
            .eq("favorite", currentData.favorite)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            return NextResponse.json(
                { error: "Image state changed, please retry" },
                { status: 409 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Toggle favorite error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
