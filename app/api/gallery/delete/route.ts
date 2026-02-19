import { createClient } from "@/utils/supabase/server";
import { isUserOwnedPath } from "@/lib/gallerySecurity";
import { NextRequest, NextResponse } from "next/server";

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

        const { data: imageData, error: imageError } = await supabase
            .from("gallery")
            .select("path")
            .eq("path", path)
            .eq("user_id", user.id)
            .single();

        if (imageError || !imageData) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from("images")
            .remove([imageData.path]);

        if (storageError) {
            return NextResponse.json(
                { error: storageError.message },
                { status: 400 }
            );
        }

        // Delete metadata from database
        const { error: dbError } = await supabase
            .from("gallery")
            .delete()
            .eq("path", imageData.path)
            .eq("user_id", user.id);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 400 });
        }

        await supabase
            .from("embeddings")
            .delete()
            .eq("path", imageData.path)
            .eq("user_id", user.id);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
