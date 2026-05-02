import Link from "next/link";
import { AdminStudentForm } from "@/components/admin/admin-student-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdminUser } from "@/lib/auth";
import { getAdminStudentDirectory } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdminUser();
  const { tab = "directory" } = await searchParams;
  const students = await getAdminStudentDirectory();

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <section className="premium-card rounded-[36px] p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="brand-badge w-fit">
                <span className="brand-orb" />
                Student management
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
                {tab === "directory"
                  ? "Maintain the institute student directory with live records."
                  : "Add students manually to the institute database."}
              </h1>
              <p className="section-copy mt-4 max-w-3xl text-base">
                This central hub allows you to review student progress or manually
                inject records for offline enrollments.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <Link className="secondary-button w-fit" href="/admin/certificates">
                Manage Certificates
              </Link>
              <LogoutButton redirectTo="/admin/login" />
            </div>
          </div>

          <nav className="mt-12 flex gap-4 border-b border-white/10">
            <Link
              className={`pb-4 text-sm font-semibold transition-colors ${
                tab === "directory"
                  ? "border-b-2 border-sky-400 text-sky-400"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              href="/admin/students?tab=directory"
            >
              Student Directory
            </Link>
            <Link
              className={`pb-4 text-sm font-semibold transition-colors ${
                tab === "new"
                  ? "border-b-2 border-sky-400 text-sky-400"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
              href="/admin/students?tab=new"
            >
              Manual Entry
            </Link>
          </nav>
        </section>

        <div className="mt-6">
          {tab === "new" ? (
            <section className="glass-card rounded-[32px] p-8">
              <p className="section-kicker">Entry form</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                Add a student record
              </h2>
              <div className="mt-8">
                <AdminStudentForm />
              </div>
            </section>
          ) : (
            <section className="glass-card rounded-[32px] p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-kicker">Live List</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    All registered students
                  </h2>
                </div>
                <span className="status-pill">{students.length} students</span>
              </div>

              <div className="table-wrap mt-6">
                <table className="data-table text-sm">
                  <thead>
                    <tr>
                      <th className="font-semibold text-left">Student</th>
                      <th className="font-semibold text-left">Registration</th>
                      <th className="font-semibold text-left">Latest Course</th>
                      <th className="font-semibold text-left">Images</th>
                      <th className="font-semibold text-left">Fee</th>
                      <th className="font-semibold text-left">Certificates</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.student_id}>
                        <td>
                          <p className="font-semibold text-[var(--foreground)]">
                            {student.full_name}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {student.email}
                          </p>
                        </td>
                        <td>{student.registration_no}</td>
                        <td>{student.latestCourse}</td>
                        <td>
                          <div className="flex flex-col gap-1">
                            {student.profile_image_1_drive_link ? (
                              <a
                                className="font-semibold text-sky-300"
                                href={student.profile_image_1_drive_link}
                                rel="noreferrer"
                                target="_blank"
                              >
                                Image 1
                              </a>
                            ) : (
                              <span className="text-[var(--muted)]">No image</span>
                            )}
                            {student.profile_image_2_drive_link ? (
                              <a
                                className="font-semibold text-sky-300"
                                href={student.profile_image_2_drive_link}
                                rel="noreferrer"
                                target="_blank"
                              >
                                Image 2
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td>{student.latestFeeStatus}</td>
                        <td>{student.certificatesIssued}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
