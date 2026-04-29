import { NextResponse, type NextRequest } from "next/server";
import { isAllowedAdminEmail } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/student/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/student/login?error=oauth-callback-failed", request.url),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/student/login?error=oauth-callback-failed", request.url),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (next.startsWith("/admin") && !isAllowedAdminEmail(user?.email ?? "")) {
    await supabase.auth.signOut();

    return NextResponse.redirect(
      new URL("/admin/login?error=admin-google-restricted", request.url),
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
