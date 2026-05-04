"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function StudentLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const [mode, setMode] = useState<"password" | "otp">("password");
  const [otpStep, setOtpStep] = useState<"email" | "otp">("email");

  async function handlePasswordLogin(event: FormEvent<HTMLFormElement>) {
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

  async function handleSendOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      }
    });

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setOtpStep("otp");
    setMessage("A 6-digit verification code has been sent to your email. (Please check your spam folder if you don't see it).");
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const supabase = createSupabaseBrowserClient();
    
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: "email",
    });

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    startTransition(() => {
      router.push("/student/register");
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

      {message ? (
        <div className="mb-5 rounded-[22px] border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm leading-6 text-sky-100">
          {message}
        </div>
      ) : null}

      {mode === "password" ? (
        <form className="grid gap-5" onSubmit={handlePasswordLogin}>
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
            {isPending ? "Logging in..." : "Login with Password"}
          </button>
          
          <div className="text-center text-sm text-[var(--muted)]">
            New Student?{" "}
            <button
              type="button"
              className="font-semibold text-sky-300 hover:underline"
              onClick={() => setMode("otp")}
            >
              Sign up with Email OTP
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
          <p className="mt-2 text-center text-xs text-[var(--muted)] opacity-80">
            This method is not working for some technical issue so make it through signup with mail then continue with google feature for now.
          </p>
        </form>
      ) : (
        <>
          {otpStep === "email" ? (
            <form className="grid gap-5" onSubmit={handleSendOtp}>
              <div>
                <label className="field-label" htmlFor="student-email-otp">
                  Signup Email
                </label>
                <input
                  className="input-field"
                  id="student-email-otp"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <button className="primary-button w-full" type="submit" disabled={isPending}>
                {isPending ? "Sending code..." : "Send Verification Code"}
              </button>
              
              <div className="text-center text-sm text-[var(--muted)]">
                Already have a password?{" "}
                <button
                  type="button"
                  className="font-semibold text-sky-300 hover:underline"
                  onClick={() => setMode("password")}
                >
                  Go to Login
                </button>
              </div>
            </form>
          ) : (
            <form className="grid gap-5" onSubmit={handleVerifyOtp}>
              <div>
                <label className="field-label" htmlFor="otp-code">
                  Verification Code
                </label>
                <input
                  className="input-field"
                  id="otp-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  maxLength={6}
                  required
                />
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Sent to: <span className="font-semibold text-[var(--foreground)]">{email}</span>
                </p>
              </div>

              <button className="primary-button w-full" type="submit" disabled={isPending}>
                {isPending ? "Verifying..." : "Verify & Continue"}
              </button>

              <button
                type="button"
                className="text-sm font-semibold text-sky-300 hover:underline mx-auto"
                onClick={() => setOtpStep("email")}
              >
                ← Change email address
              </button>
            </form>
          )}
        </>
      )}
    </>
  );
}
