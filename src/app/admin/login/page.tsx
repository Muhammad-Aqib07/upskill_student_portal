import { ADMIN_GMAIL_NOTICE } from "@/lib/constants";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { AuthMessage } from "@/components/auth/auth-message";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="panel-shell">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[1fr_480px] lg:px-10">
        <section className="rounded-[32px] bg-slate-950 p-8 text-white lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
            Administration
          </p>
          <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight">
            Full access control for admissions, enrollments, certificates, and
            public verification.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Admin login is restricted to only two approved Gmail accounts. This
            rule will be enforced through Supabase auth and server-side email
            checks.
          </p>

          <div className="mt-8 rounded-[28px] border border-sky-300/20 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-sky-100">
              Access rule
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-200">
              {ADMIN_GMAIL_NOTICE}
            </p>
          </div>
        </section>

        <section className="glass-card rounded-[32px] p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Secure Access
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              Restricted administration sign-in
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Provide the approved Gmail addresses in the environment file and
              only those accounts will be able to open the administration area.
            </p>
          </div>

          <AuthMessage error={error} />
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
