import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireStudentUser } from "@/lib/auth";
import { courses } from "@/lib/portal-data";
import { getStudentDashboardData } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await requireStudentUser();
  const data = await getStudentDashboardData({
    authUserId: user.id,
    email: user.email,
  });

  if (!data.student) {
    return (
      <main className="panel-shell">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
          <div className="premium-card rounded-[36px] p-8 lg:p-10">
            <div className="brand-badge w-fit">
              <span className="brand-orb" />
              Student dashboard
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em]">
              Your account is active, but your admission record is not in the
              institute database yet.
            </h1>
            <p className="section-copy mt-4 max-w-2xl text-base">
              Complete registration once so your profile, enrollment history,
              and certificate workflow can appear in the upgraded student
              portal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button w-fit" href="/student/register">
                Complete Registration
              </Link>
              <LogoutButton redirectTo="/student/login" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const activeCourses = data.enrollments.filter(
    (item) => item.status.toLowerCase() === "active",
  ).length;
  const certificatesReady = data.certificates.filter(
    (item) =>
      item.admin_approved.toLowerCase() === "true" &&
      item.certificate_fee_status.toLowerCase() === "paid",
  ).length;

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <section className="premium-card rounded-[36px] p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="brand-badge w-fit">
                <span className="brand-orb" />
                Student portal
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
                Welcome back, {user.user_metadata.full_name ?? user.email ?? "Student"}
              </h1>
              <p className="section-copy mt-4 max-w-3xl text-base">
                Your courses, admission profile, and certificate readiness are
                now presented in a cleaner dashboard built for faster scanning
                across mobile and desktop.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Link className="secondary-button w-fit" href="/verify">
                Check Public Verification
              </Link>
              <LogoutButton redirectTo="/student/login" />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <DashboardCard
              label="Registration No"
              value={data.student.registration_no || "Pending"}
            />
            <DashboardCard label="Active Courses" value={String(activeCourses)} />
            <DashboardCard label="Certificates Ready" value={String(certificatesReady)} />
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-card rounded-[32px] p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-kicker">Enrollment Snapshot</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Enrolled courses
                </h2>
              </div>
              <span className="status-pill">{data.enrollments.length} records</span>
            </div>

            <div className="mt-6 grid gap-4">
              {data.enrollments.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/15 bg-white/5 p-6 text-sm leading-7 text-[var(--muted)]">
                  No course enrollments have been added yet.
                </div>
              ) : null}

              {data.enrollments.map((item) => (
                <div
                  key={item.enrollment_id}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="grid gap-4 lg:grid-cols-4">
                    <InfoBlock label="Course" value={item.course_name} />
                    <InfoBlock label="Fee" value={item.fee_status} />
                    <InfoBlock label="Progress" value={item.status} />
                    <InfoBlock
                      label="Certificate"
                      value={
                        data.certificates.find(
                          (certificate) => certificate.enrollment_id === item.enrollment_id,
                        )?.admin_approved?.toLowerCase() === "true"
                          ? "Issued"
                          : "Pending"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6">
            <div className="glass-card rounded-[32px] p-8">
              <p className="section-kicker">Profile Summary</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Your details</h2>
              <div className="mt-6 grid gap-4 text-sm">
                <SummaryRow label="Full Name" value={data.student.full_name} />
                <SummaryRow label="Father Name" value={data.student.father_name} />
                <SummaryRow label="City" value={data.student.city} />
                <SummaryRow label="Education" value={data.student.education} />
                <SummaryRow label="Email" value={user.email ?? "Not available"} />
                <SummaryRow label="Courses Available" value={String(courses.length)} />
              </div>
            </div>

            <div className="premium-card rounded-[32px] p-8">
              <p className="section-kicker">Certificate Rule</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Release depends on approval and paid certificate fee.
              </h2>
              <p className="section-copy mt-4 text-sm">
                Certificates appear as ready only when administration has
                approved the record and the certification fee has been marked
                paid in the live system.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-tile">
      <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[var(--muted)]">
      <span>{label}</span>
      <span className="font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
