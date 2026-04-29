import Link from "next/link";
import { AuthMessage } from "@/components/auth/auth-message";
import { StudentLoginForm } from "@/components/auth/student-login-form";
import { studentFeatures } from "@/lib/portal-data";

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="panel-shell">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_480px] lg:px-10">
        <section className="flex flex-col justify-between rounded-[32px] bg-slate-950 p-8 text-white lg:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
              Student Panel
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight">
              Login to continue your admissions, enrollments, and certificate
              progress.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Students can sign in with email/password or Google using Supabase
              authentication. Your profile, courses, fees, and certificate
              status all stay connected to Google Sheets records.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            {studentFeatures.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-[32px] p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Login
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Student access
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Students can sign in with live Supabase authentication using
              email/password or Google.
            </p>
          </div>

          <AuthMessage error={error} />
          <StudentLoginForm />

          <div className="mt-8 flex flex-col gap-3 text-sm text-slate-600">
            <p>
              New student?{" "}
              <Link className="font-semibold text-sky-700" href="/student/register">
                Complete your registration form
              </Link>
            </p>
            <p>
              Need direct access after sign-in?{" "}
              <Link className="font-semibold text-sky-700" href="/student/dashboard">
                Open the student dashboard
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
