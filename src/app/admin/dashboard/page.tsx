import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdminUser } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/google-sheets";
import { googleTabs } from "@/lib/portal-data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await requireAdminUser();
  const dashboard = await getAdminDashboardData();

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Admin Dashboard
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
              Control center for Tech Upskill Learn
            </h1>
            <p className="max-w-3xl text-base leading-8 text-slate-600">
              Signed in as {user.email}. This area is restricted to the two
              approved admin Gmail accounts configured in the environment.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/admin/students">
              Manage Students
            </Link>
            <Link className="secondary-button w-fit" href="/admin/certificates">
              Manage Certificates
            </Link>
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-[28px] p-6"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-950">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-card rounded-[32px] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Recent certificate actions
              </h2>
              <Link className="primary-button" href="/admin/certificates">
                Generate New Certificate
              </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
              <table className="min-w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Student</th>
                    <th className="px-5 py-4 font-semibold">Course</th>
                    <th className="px-5 py-4 font-semibold">Certificate ID</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentCertificates.length === 0 ? (
                    <tr>
                      <td
                        className="px-5 py-8 text-center text-slate-500"
                        colSpan={4}
                      >
                        No certificates have been issued or recorded yet.
                      </td>
                    </tr>
                  ) : null}

                  {dashboard.recentCertificates.map((record) => (
                    <tr key={record.certificateId} className="border-t border-slate-100">
                      <td className="px-5 py-4">{record.studentName}</td>
                      <td className="px-5 py-4">{record.course}</td>
                      <td className="px-5 py-4">{record.certificateId}</td>
                      <td className="px-5 py-4">{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6">
            <div className="rounded-[32px] bg-slate-950 p-8 text-white">
              <h2 className="text-2xl font-semibold tracking-tight">
                Google spreadsheet tabs
              </h2>
              <div className="mt-6 grid gap-3">
                {googleTabs.map((tab) => (
                  <div
                    key={tab}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    {tab}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-[32px] p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Live database status
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This dashboard is now reading from your shared Google
                Spreadsheet. As records are added, the statistics and recent
                certificate activity update from live sheet data instead of demo
                placeholders.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
