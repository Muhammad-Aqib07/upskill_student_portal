import { NextResponse, type NextRequest } from "next/server";
import { isAuthBypassed } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    if (isAuthBypassed()) {
      return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;

    // Restrict middleware work to the auth callback where cookie/session writes matter.
    // Route protection is enforced by server-side auth guards in pages and API handlers.
    if (pathname.startsWith("/auth/callback")) {
      const { response } = updateSession(request);
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware invocation failed:", error);

    // Fail open here and let server-side auth guards handle route protection.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/auth/callback"],
};
