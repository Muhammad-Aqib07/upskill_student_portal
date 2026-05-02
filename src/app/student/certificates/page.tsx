import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireStudentUser } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function StudentCertificatesPage() {
  const user = await requireStudentUser();
  const data = await getStudentDashboardData({
    authUserId: user.id,
    email: user.email,
  });

  if (!data.student) {
    redirect("/student/register");
  }

  const issuedCertificates = data.certificates.filter(
    (c) =>
      c.admin_approved.toLowerCase() === "true" &&
      c.certificate_fee_status.toLowerCase() === "paid",
  );

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        {/* Header */}
        <section className="premium-card rounded-[36px] p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="brand-badge w-fit">
                <span className="brand-orb" />
                My Documents
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
                Certificates &amp; Letters
              </h1>
              <p className="section-copy mt-4 max-w-2xl text-base">
                Download or print your approved course completion certificates and
                official letters from here. Documents are available only after admin
                approval and fee clearance.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Link className="secondary-button w-fit" href="/student/dashboard">
                ← Back to Dashboard
              </Link>
              <LogoutButton redirectTo="/student/login" />
            </div>
          </div>
        </section>

        {/* Document List */}
        <section className="glass-card mt-6 rounded-[32px] p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-kicker">Issued Documents</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Your Certificates
              </h2>
            </div>
            <span className="status-pill">{issuedCertificates.length} issued</span>
          </div>

          {issuedCertificates.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-dashed border-white/15 bg-white/5 p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <svg className="h-8 w-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="font-semibold text-[var(--foreground)]">No certificates yet</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Your certificates will appear here once the admin has approved them and your fee is cleared.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {issuedCertificates.map((cert) => (
                <div
                  key={cert.certificate_id}
                  className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 p-6 transition-all hover:border-sky-500/30 hover:bg-white/10"
                >
                  {/* Accent bar */}
                  <div className="absolute left-0 top-0 h-full w-1 rounded-l-[24px] bg-gradient-to-b from-sky-400 to-blue-600" />

                  <div className="pl-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-sky-400">
                          {cert.certificate_code}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold leading-tight text-[var(--foreground)]">
                          {cert.course_name}
                        </h3>
                      </div>
                      <span className="mt-1 shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        Approved
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[var(--muted)]">
                      <div>
                        <p className="font-medium uppercase tracking-wider">Issued</p>
                        <p className="mt-1 font-semibold text-[var(--foreground)]">{cert.issue_date}</p>
                      </div>
                      <div>
                        <p className="font-medium uppercase tracking-wider">Fee</p>
                        <p className="mt-1 font-semibold text-emerald-400 capitalize">{cert.certificate_fee_status}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                      <Link
                        href={`/student/certificates/${cert.certificate_id}/print`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 rounded-xl bg-sky-500/10 px-4 py-2.5 text-sm font-semibold text-sky-400 transition hover:bg-sky-500/20"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Print Certificate
                      </Link>
                      <Link
                        href={`/student/certificates/${cert.certificate_id}/letter`}
                        target="_blank"
                        className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:border-white/20 hover:text-[var(--foreground)]"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Completion Letter
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Info Card */}
        <section className="premium-card mt-6 rounded-[32px] p-8">
          <p className="section-kicker">Document Policy</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight">
            When are documents released?
          </h2>
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            {[
              { icon: "✓", title: "Admin Approved", desc: "The admin has reviewed and approved your certificate record." },
              { icon: "✓", title: "Fee Cleared", desc: "Your certification fee has been marked as paid in the system." },
              { icon: "✓", title: "Instantly Available", desc: "Both the certificate and completion letter become available immediately." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-400">
                  {item.icon}
                </div>
                <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                <p className="mt-1 text-[var(--muted)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
