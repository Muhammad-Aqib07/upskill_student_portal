"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function StudentLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleEmailLogin(event: FormEvent<HTMLFormElement>) {
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
      router.push("/student/dashboard");
      router.refresh();
    });
  }

  async function handleGoogleLogin() {
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/student/dashboard`;

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
        <div className="mb-5 rounded-[22px] border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100">
          {error}
        </div>
      ) : null}

      <form className="grid gap-5" onSubmit={handleEmailLogin}>
        <div>
          <label className="field-label" htmlFor="student-email">
            Email address
          </label>
          <input
            className="input-field"
            id="student-email"
            type="email"
            placeholder="student@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="student-password">
            Password
          </label>
          <input
            className="input-field"
            id="student-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button className="primary-button w-full" type="submit" disabled={isPending}>
          {isPending ? "Opening dashboard..." : "Login with Email"}
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
