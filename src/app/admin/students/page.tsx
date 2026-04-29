import Link from "next/link";
import { AdminStudentForm } from "@/components/admin/admin-student-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdminUser } from "@/lib/auth";
import { getAdminStudentDirectory } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  await requireAdminUser();
  const students = await getAdminStudentDirectory();

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Admin Students
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Add students manually and review the institute directory.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Use this panel for new students, old students, or already completed
              students who need to be inserted into the portal database.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/admin/certificates">
              Manage Certificates
            </Link>
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="glass-card rounded-[32px] p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Manual Student Entry
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Add students without using the student registration page. This is
              especially useful for old or completed students.
            </p>
            <div className="mt-8">
              <AdminStudentForm />
            </div>
          </section>

          <section className="glass-card rounded-[32px] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Student Directory
              </h2>
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                {students.length} students
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
              <table className="min-w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Student</th>
                    <th className="px-4 py-4 font-semibold">Registration</th>
                    <th className="px-4 py-4 font-semibold">Latest Course</th>
                    <th className="px-4 py-4 font-semibold">Images</th>
                    <th className="px-4 py-4 font-semibold">Fee</th>
                    <th className="px-4 py-4 font-semibold">Certificates</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.student_id} className="border-t border-slate-100">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-950">{student.full_name}</p>
                        <p className="text-xs text-slate-500">{student.email}</p>
                      </td>
                      <td className="px-4 py-4">{student.registration_no}</td>
                      <td className="px-4 py-4">{student.latestCourse}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          {student.profile_image_1_drive_link ? (
                            <a
                              className="font-semibold text-sky-700"
                              href={student.profile_image_1_drive_link}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Image 1
                            </a>
                          ) : (
                            <span className="text-slate-400">No image</span>
                          )}
                          {student.profile_image_2_drive_link ? (
                            <a
                              className="font-semibold text-sky-700"
                              href={student.profile_image_2_drive_link}
                              rel="noreferrer"
                              target="_blank"
                            >
                              Image 2
                            </a>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4">{student.latestFeeStatus}</td>
                      <td className="px-4 py-4">{student.certificatesIssued}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
