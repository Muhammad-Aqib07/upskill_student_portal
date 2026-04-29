"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAdminLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    startTransition(() => {
      router.push("/admin/dashboard");
      router.refresh();
    });
  }

  async function handleGoogleLogin() {
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/admin/dashboard`;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
    }
  }

  return (
    <>
      {error ? (
        <div className="mb-5 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          {error}
        </div>
      ) : null}

      <form className="grid gap-5" onSubmit={handleAdminLogin}>
        <div>
          <label className="field-label" htmlFor="admin-email">
            Gmail address
          </label>
          <input
            className="input-field"
            id="admin-email"
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="admin-password">
            Password
          </label>
          <input
            className="input-field"
            id="admin-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button className="primary-button w-full" type="submit" disabled={isPending}>
          {isPending ? "Checking access..." : "Continue"}
        </button>
        <button
          className="secondary-button w-full"
          type="button"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>
      </form>
    </>
  );
}
