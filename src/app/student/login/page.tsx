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
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10">
        <section className="premium-card flex flex-col justify-between rounded-[36px] p-8 lg:p-10">
          <div>
            <div className="brand-badge w-fit">
              <span className="brand-orb" />
              Student portal
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
              Continue your admissions and learning journey through a cleaner,
              more premium student experience.
            </h1>
            <p className="section-copy mt-5 max-w-2xl text-lg">
              Sign in with email/password or Google, then track your profile,
              enrollments, and certificate progress from one redesigned
              dashboard.
            </p>
          </div>

          <div className="mt-10 grid gap-3">
            {studentFeatures.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-[var(--foreground)]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-[36px] p-8 lg:p-10">
          <div className="mb-8">
            <p className="section-kicker">Login & Sign Up</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Student access</h2>
            <p className="section-copy mt-3 text-sm">
              Sign in or create a new account to proceed to your student dashboard or complete your admission form.
            </p>
          </div>

          <AuthMessage error={error} />
          <StudentLoginForm />

          <div className="mt-8 flex flex-col gap-3 text-sm text-[var(--muted)]">
            <p>
              Already signed in?{" "}
              <Link className="font-semibold text-sky-300" href="/student/dashboard">
                Open the student dashboard
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
