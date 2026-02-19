import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCanonicalOrigin } from "@/lib/security";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getCanonicalOrigin(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { error: findUserError } = await supabase
        .from("users")
        .select("*")
        .eq("email", user?.email)
        .single();
      if (findUserError) {
        const { error } = await supabase.from("users").insert({
          email: user?.email,
          name: user?.user_metadata?.full_name,
          avatar_url: user?.user_metadata?.avatar_url,
        });
        if (error) {
          throw error;
        }
      }
      return NextResponse.redirect(`${origin}/gallery`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
