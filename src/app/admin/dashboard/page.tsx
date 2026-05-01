import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdminUser } from "@/lib/auth";
import { INSTITUTE_NAME } from "@/lib/constants";
import { getAdminDashboardData } from "@/lib/google-sheets";
import { googleTabs } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  const dashboard = await getAdminDashboardData();

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <section className="premium-card rounded-[36px] p-6 lg:p-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-4xl">
                <div className="brand-badge w-fit">
                  <span className="brand-orb" />
                  Admin control center
                </div>
                <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
                  Manage {INSTITUTE_NAME} from one polished command surface.
                </h1>
                <p className="section-copy mt-4 max-w-3xl text-base">
                  Signed in as {user.email}. Admissions, certificates, and live
                  records are now presented in a tighter, more premium admin
                  experience without changing any underlying workflows.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
                <Link className="primary-button w-fit" href="/admin/students">
                  Manage Students
                </Link>
                <Link className="secondary-button w-fit" href="/admin/certificates">
                  Manage Certificates
                </Link>
                <LogoutButton redirectTo="/admin/login" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dashboard.stats.map((stat) => (
                <article key={stat.label} className="stat-tile">
                  <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-4 text-3xl font-semibold tracking-tight">{stat.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
          <section className="glass-card rounded-[32px] p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="section-kicker">Certificate Activity</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Recent certificate actions
                </h2>
              </div>
              <Link className="primary-button w-fit" href="/admin/certificates">
                Generate Certificate
              </Link>
            </div>

            <div className="table-wrap mt-6">
              <table className="data-table text-sm">
                <thead>
                  <tr>
                    <th className="font-semibold">Student</th>
                    <th className="font-semibold">Course</th>
                    <th className="font-semibold">Certificate ID</th>
                    <th className="font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentCertificates.length === 0 ? (
                    <tr>
                      <td className="py-8 text-center text-[var(--muted)]" colSpan={4}>
                        No certificates have been issued or recorded yet.
                      </td>
                    </tr>
                  ) : null}

                  {dashboard.recentCertificates.map((record) => (
                    <tr key={record.certificateId}>
                      <td>
                        <p className="font-semibold">{record.studentName}</p>
                      </td>
                      <td>{record.course}</td>
                      <td>{record.certificateId}</td>
                      <td>
                        <span className="status-pill">{record.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6">
            <div className="premium-card rounded-[32px] p-8">
              <p className="section-kicker">Connected Data</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Google spreadsheet tabs
              </h2>
              <div className="mt-6 grid gap-3">
                {googleTabs.map((tab) => (
                  <div
                    key={tab}
                    className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-[var(--foreground)]"
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-8">
              <p className="section-kicker">System Status</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Live database status
              </h2>
              <p className="section-copy mt-4 text-sm">
                Statistics and recent activity are now sourced from the live
                spreadsheet workspace, keeping the upgraded interface tied to
                your actual records instead of placeholders.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
