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
          <div className="glass-card rounded-[36px] p-8 lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Student Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Your account is active, but your admission record is not in the
              institute database yet.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Please complete the registration form once so the portal can store
              your profile, course enrollment, and certification workflow inside
              Google Sheets.
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
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="glass-card rounded-[32px] p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Student Dashboard
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  Welcome back, {user.user_metadata.full_name ?? user.email ?? "Student"}
                </h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
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
              <DashboardCard
                label="Certificates Ready"
                value={String(certificatesReady)}
              />
            </div>

            <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold text-slate-950">
                Enrolled courses
              </h2>
              <div className="mt-5 grid gap-4">
                {data.enrollments.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-7 text-slate-600">
                    No course enrollments have been added yet.
                  </div>
                ) : null}

                {data.enrollments.map((item) => (
                  <div
                    key={item.enrollment_id}
                    className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-5 lg:grid-cols-4"
                  >
                    <div>
                      <p className="text-sm text-slate-500">Course</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {item.course_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Fee</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {item.fee_status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Progress</p>
                      <p className="mt-1 font-semibold text-slate-950">{item.status}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Certificate</p>
                      <p className="mt-1 font-semibold text-slate-950">
                        {data.certificates.find(
                          (certificate) => certificate.enrollment_id === item.enrollment_id,
                        )?.admin_approved === "true"
                          ? "Issued"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6">
            <div className="glass-card rounded-[32px] p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Profile summary
              </h2>
              <div className="mt-6 grid gap-4 text-sm text-slate-700">
                <SummaryRow label="Full Name" value={data.student.full_name} />
                <SummaryRow label="Father Name" value={data.student.father_name} />
                <SummaryRow label="City" value={data.student.city} />
                <SummaryRow label="Education" value={data.student.education} />
                <SummaryRow label="Email" value={user.email ?? "Not available"} />
                <SummaryRow label="Courses Available" value={String(courses.length)} />
              </div>
            </div>

            <div className="rounded-[32px] bg-slate-950 p-8 text-white">
              <h2 className="text-2xl font-semibold tracking-tight">
                Certificate release rule
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                The final portal will release a certificate only when admin has
                approved it and the certification fee is marked paid in the
                records.
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
    <div className="rounded-[24px] border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span>{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}
