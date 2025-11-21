import { createClient } from "@/utils/supabase/server";
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

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from("images")
            .remove([path]);

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
            .eq("path", path);

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
