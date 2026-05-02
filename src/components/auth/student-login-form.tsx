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

  const [isSignUp, setIsSignUp] = useState(false);

  async function handleEmailAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createSupabaseBrowserClient();
    
    if (isSignUp) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }
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

      <form className="grid gap-5" onSubmit={handleEmailAuth}>
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
            placeholder={isSignUp ? "Create a password" : "Enter your password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />
        </div>

        <button className="primary-button w-full" type="submit" disabled={isPending}>
          {isPending 
            ? "Opening dashboard..." 
            : isSignUp ? "Create Account" : "Login with Email"}
        </button>
        
        <div className="text-center text-sm text-[var(--muted)]">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            className="font-semibold text-sky-300 hover:underline"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 px-4 text-xs tracking-wider text-[var(--muted)] uppercase">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

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
