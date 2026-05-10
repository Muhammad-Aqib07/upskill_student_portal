import { AdminStudentActions } from "@/components/admin/admin-student-actions";
import { AdminMenuTrigger } from "@/components/admin/admin-side-panel";
import Link from "next/link";
import { AdminStudentForm } from "@/components/admin/admin-student-form";
import { requireAdminUser } from "@/lib/auth";
import { getAdminStudentDirectory, getAdminStudentEditor } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; studentId?: string }>;
}) {
  const user = await requireAdminUser();
  const { tab = "directory", studentId = "" } = await searchParams;
  const students = await getAdminStudentDirectory();
  const editRecord = tab === "edit" && studentId ? await getAdminStudentEditor(studentId) : null;
  const userMetadata = user.user_metadata as Record<string, string | undefined>;
  const adminName =
    userMetadata.full_name ??
    userMetadata.name ??
    user.email?.split("@")[0] ??
    "Admin";
  const adminImageUrl =
    userMetadata.avatar_url ??
    userMetadata.picture ??
    null;

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
                  : tab === "edit"
                    ? "Update an existing student record from the live directory."
                    : "Add students manually to the institute database."}
              </h1>
              <p className="section-copy mt-4 max-w-3xl text-base">
                This central hub allows you to review student progress or manually
                inject records for offline enrollments.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <div className="flex justify-end">
                <AdminMenuTrigger
                  adminEmail={user.email ?? ""}
                  adminName={adminName}
                  adminImageUrl={adminImageUrl}
                />
              </div>
              <Link className="secondary-button w-fit" href="/admin/certificates">
                Manage Certificates
              </Link>
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
            <span
              className={`pb-4 text-sm font-semibold ${
                tab === "edit" ? "border-b-2 border-sky-400 text-sky-400" : "text-[var(--muted)]"
              }`}
            >
              Edit Student
            </span>
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
          ) : tab === "edit" ? (
            <section className="glass-card rounded-[32px] p-8">
              <p className="section-kicker">Edit record</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                {editRecord ? `Update ${editRecord.student.full_name}` : "Student not found"}
              </h2>
              {editRecord ? (
                <div className="mt-8">
                  <AdminStudentForm
                    initialData={{
                      studentId: editRecord.student.student_id,
                      enrollmentId: editRecord.latestEnrollment?.enrollment_id ?? "",
                      fullName: editRecord.student.full_name,
                      fatherName: editRecord.student.father_name,
                      cnicBForm: editRecord.student.cnic_bform,
                      phone: editRecord.student.phone,
                      email: editRecord.student.email,
                      address: editRecord.student.address,
                      city: editRecord.student.city,
                      gender: editRecord.student.gender,
                      dateOfBirth: editRecord.student.date_of_birth,
                      education: editRecord.student.education,
                      selectedCourse: editRecord.latestEnrollment?.course_name ?? "",
                      enrollmentStatus: editRecord.latestEnrollment?.status ?? "active",
                      feeStatus: editRecord.latestEnrollment?.fee_status ?? "unpaid",
                      courseCompleted:
                        editRecord.latestEnrollment?.course_completed ?? "FALSE",
                      notes: editRecord.latestEnrollment?.notes ?? "",
                      profileImageOneLink:
                        editRecord.student.profile_image_1_drive_link ?? "",
                      profileImageTwoLink:
                        editRecord.student.profile_image_2_drive_link ?? "",
                    }}
                    mode="edit"
                  />
                </div>
              ) : (
                <p className="mt-6 text-sm text-[var(--muted)]">
                  The selected student record could not be found.
                </p>
              )}
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
                      <th className="font-semibold text-left">Actions</th>
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
                        <td>
                          <AdminStudentActions studentId={student.student_id} />
                        </td>
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
