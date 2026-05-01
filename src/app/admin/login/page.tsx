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
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-10">
        <section className="premium-card flex flex-col justify-between rounded-[36px] p-8 lg:p-10">
          <div>
            <div className="brand-badge w-fit">
              <span className="brand-orb" />
              Restricted admin access
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
              Secure control for admissions, enrollments, certificates, and
              verification.
            </h1>
            <p className="section-copy mt-5 max-w-2xl text-lg">
              The admin side now feels more premium and intentional while
              keeping the same Supabase and server-side access rules.
            </p>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/6 p-6">
            <p className="section-kicker">Access Rule</p>
            <p className="section-copy mt-3 text-sm">{ADMIN_GMAIL_NOTICE}</p>
          </div>
        </section>

        <section className="glass-card rounded-[36px] p-8 lg:p-10">
          <div className="mb-8">
            <p className="section-kicker">Admin Login</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Restricted administration sign-in
            </h2>
            <p className="section-copy mt-3 text-sm">
              Approved Gmail accounts can continue with password or Google
              authentication and then enter the redesigned admin workspace.
            </p>
          </div>

          <AuthMessage error={error} />
          <AdminLoginForm />
        </section>
      </div>
    </main>
  );
}
