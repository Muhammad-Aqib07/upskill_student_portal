import { redirect } from "next/navigation";
import { getAllowedAdminEmails, isAuthBypassed } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PortalSessionUser = {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
  };
};

export async function getCurrentUser() {
  if (isAuthBypassed()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireStudentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/student/login?error=student-auth-required");
  }

  return user;
}

export async function requireAdminUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin/login?error=admin-auth-required");
  }

  const email = user.email?.toLowerCase() ?? "";

  if (!getAllowedAdminEmails().includes(email)) {
    redirect("/admin/login?error=admin-not-allowed");
  }

  return user;
}
