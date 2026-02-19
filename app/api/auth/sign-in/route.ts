import { createClient } from "@/utils/supabase/server";
import { validateEmailRedirectTo } from "@/lib/security";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, redirectTo } = body;

        if (!email || !redirectTo) {
            return NextResponse.json(
                { error: "Email and redirectTo are required" },
                { status: 400 }
            );
        }

        const safeRedirectTo = validateEmailRedirectTo(redirectTo, request.url);
        if (!safeRedirectTo) {
            return NextResponse.json(
                { error: "Invalid redirectTo URL" },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: safeRedirectTo,
            },
        });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error("Sign-in error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
