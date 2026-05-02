import Link from "next/link";
import { CertificateForm } from "@/components/admin/certificate-form";
import { AdminStudentForm } from "@/components/admin/admin-student-form";
import { CertificateVisibilityToggle } from "@/components/admin/certificate-visibility-toggle";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdminUser } from "@/lib/auth";
import { getCertificateWorkspace } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  await requireAdminUser();
  const { tab = "issued" } = await searchParams;
  const workspace = await getCertificateWorkspace();

  const enrollmentOptions = workspace.enrollments.map((enrollment) => {
    const student = workspace.students.find(
      (item) => item.student_id === enrollment.student_id,
    );

    return {
      enrollmentId: enrollment.enrollment_id,
      studentId: enrollment.student_id,
      studentName: student?.full_name ?? "Unknown Student",
      fatherName: student?.father_name ?? "",
      phone: student?.phone ?? "",
      city: student?.city ?? "",
      registrationNo: enrollment.registration_no || student?.registration_no || "",
      courseName: enrollment.course_name,
      status: enrollment.status,
    };
  });

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <section className="premium-card rounded-[36px] p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <div className="brand-badge w-fit">
                <span className="brand-orb" />
                Certificate workspace
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
                Generate, approve, and print certificates from a cleaner admin
                flow.
              </h1>
              <p className="section-copy mt-4 max-w-3xl text-base">
                The certificate process still follows the same logic, but the
                UI now highlights record clarity, status visibility, and print
                actions more effectively.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
              <LogoutButton redirectTo="/admin/login" />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2 border-b border-white/10">
            <Link
              href="/admin/certificates?tab=issued"
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                tab === "issued"
                  ? "border-b-2 border-sky-300 text-sky-300"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Issued Records
            </Link>
            <Link
              href="/admin/certificates?tab=create"
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                tab === "create"
                  ? "border-b-2 border-sky-300 text-sky-300"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Create Certificate
            </Link>
            <Link
              href="/admin/certificates?tab=add-student"
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                tab === "add-student"
                  ? "border-b-2 border-sky-300 text-sky-300"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Add Student
            </Link>
          </div>
        </section>

        <div className="mt-6">
          {tab === "add-student" ? (
            <section className="glass-card animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-[32px] p-8">
              <div>
                <p className="section-kicker">Admission</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Add a new student
                </h2>
                <p className="section-copy mt-3 text-sm">
                  Register a student manually to make them available for certificate generation.
                </p>
              </div>
              <div className="mt-8">
                <AdminStudentForm />
              </div>
            </section>
          ) : tab === "create" ? (
            <section className="glass-card animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-[32px] p-8">
              <div>
                <p className="section-kicker">Create Certificate</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Generate a new certificate record
                </h2>
                <p className="section-copy mt-3 text-sm">
                  Select an enrollment, set approval and visibility, and create the
                  certificate without changing the existing workflow.
                </p>
              </div>

              <div className="mt-8">
                {enrollmentOptions.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-white/15 bg-white/5 p-6 text-sm leading-7 text-[var(--muted)]">
                    No enrollments exist yet. Add a student first using the "Add Student" tab.
                  </div>
                ) : (
                  <CertificateForm enrollments={enrollmentOptions} />
                )}
              </div>
            </section>
          ) : (
            <section className="glass-card animate-in fade-in slide-in-from-bottom-2 duration-500 rounded-[32px] p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="section-kicker">Issued Records</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Certificate list
                  </h2>
                </div>
                <span className="status-pill">{workspace.certificates.length} records</span>
              </div>

              <div className="table-wrap mt-6 overflow-x-auto">
                <table className="data-table w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left font-semibold">Student</th>
                      <th className="text-left font-semibold">Student Details</th>
                      <th className="text-left font-semibold">Course</th>
                      <th className="text-left font-semibold">Code</th>
                      <th className="text-left font-semibold">Approved</th>
                      <th className="text-left font-semibold">Public</th>
                      <th className="text-left font-semibold">Print</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspace.certificates.length === 0 ? (
                      <tr>
                        <td className="py-6 text-center text-[var(--muted)]" colSpan={6}>
                          No certificate records yet.
                        </td>
                      </tr>
                    ) : null}

                    {workspace.certificates.map((certificate) => (
                      <tr key={certificate.certificate_id} className="border-t border-white/5">
                        <td className="py-4">
                          <p className="font-semibold text-[var(--foreground)]">
                            {certificate.student_name}
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            {certificate.registration_no}
                          </p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm text-[var(--muted)]">
                            Father: {certificate.father_name || "N/A"}
                          </p>
                        </td>
                        <td className="py-4 text-xs">{certificate.course_name}</td>
                        <td className="py-4 font-mono text-[10px]">{certificate.certificate_code}</td>
                        <td className="py-4">
                          <span className={`status-pill ${certificate.admin_approved === "TRUE" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                            {certificate.admin_approved === "TRUE" ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="py-4">
                          <CertificateVisibilityToggle 
                            certificateId={certificate.certificate_id} 
                            initialValue={certificate.public_visible.toUpperCase() === "TRUE"} 
                          />
                        </td>
                        <td className="py-4">
                          <Link
                            className="font-semibold text-sky-300 hover:text-sky-200"
                            href={`/admin/certificates/${certificate.certificate_id}`}
                          >
                            Open
                          </Link>
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
