import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (user && pathname.startsWith("/auth/sign-in")) {
    const url = request.nextUrl.clone();
    url.pathname = "/gallery";
    return NextResponse.redirect(url);
  }

  const protectedRoutes = ["/fav", "/gallery", "/profile", "/upload"];
  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  return response;
}
