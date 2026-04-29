import { NextResponse, type NextRequest } from "next/server";
import { getAllowedAdminEmails, isAuthBypassed } from "@/lib/env";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (isAuthBypassed()) {
    return NextResponse.next();
  }

  const { supabase, response } = updateSession(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isStudentProtected =
    pathname.startsWith("/student/dashboard") || pathname.startsWith("/student/profile");
  const isAdminProtected =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/certificates") ||
    pathname.startsWith("/admin/students");

  if (isStudentProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/student/login";
    url.searchParams.set("error", "student-auth-required");
    return NextResponse.redirect(url);
  }

  if (isAdminProtected) {
    const email = user?.email?.toLowerCase() ?? "";
    const isAllowed = getAllowedAdminEmails().includes(email);

    if (!user || !isAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", !user ? "admin-auth-required" : "admin-not-allowed");
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*", "/auth/callback"],
};
