"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton({ redirectTo }: { redirectTo: string }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = redirectTo;
  }

  return (
    <button className="secondary-button w-fit" onClick={handleLogout} type="button">
      {isLoading ? "Signing out..." : "Logout"}
    </button>
  );
}
