import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data, error: findUserError } = await supabase
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
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}/gallery`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}/gallery`);
      } else {
        return NextResponse.redirect(`${origin}/gallery`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
