import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// All session refresh and auth-redirect logic lives in updateSession (the
// canonical Supabase SSR pattern). proxy.ts is intentionally a thin wrapper so
// each request performs a single supabase.auth.getUser() instead of two.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder image files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
