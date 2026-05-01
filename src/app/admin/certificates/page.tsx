import Link from "next/link";
import { CertificateForm } from "@/components/admin/certificate-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdminUser } from "@/lib/auth";
import { getCertificateWorkspace } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  await requireAdminUser();
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
      registrationNo: student?.registration_no ?? "",
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
              <Link className="secondary-button w-fit" href="/admin/students">
                Manage Students
              </Link>
              <LogoutButton redirectTo="/admin/login" />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="glass-card rounded-[32px] p-8">
            <p className="section-kicker">Create Certificate</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Generate a new certificate record
            </h2>
            <p className="section-copy mt-3 text-sm">
              Select an enrollment, set approval and visibility, and create the
              certificate without changing the existing workflow.
            </p>

            <div className="mt-8">
              {enrollmentOptions.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-white/15 bg-white/5 p-6 text-sm leading-7 text-[var(--muted)]">
                  No enrollments exist yet. Add a student or enrollment first
                  from the admin students page.
                </div>
              ) : (
                <CertificateForm enrollments={enrollmentOptions} />
              )}
            </div>
          </section>

          <section className="glass-card rounded-[32px] p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="section-kicker">Issued Records</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                  Certificate list
                </h2>
              </div>
              <span className="status-pill">{workspace.certificates.length} records</span>
            </div>

            <div className="table-wrap mt-6">
              <table className="data-table text-sm">
                <thead>
                  <tr>
                    <th className="font-semibold">Student</th>
                    <th className="font-semibold">Student Details</th>
                    <th className="font-semibold">Course</th>
                    <th className="font-semibold">Certificate Code</th>
                    <th className="font-semibold">Status</th>
                    <th className="font-semibold">Print</th>
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
                    <tr key={certificate.certificate_id}>
                      <td>
                        <p className="font-semibold text-[var(--foreground)]">
                          {certificate.student_name}
                        </p>
                        <p className="text-xs text-[var(--muted)]">
                          {certificate.registration_no}
                        </p>
                      </td>
                      <td>
                        <p className="text-sm text-[var(--muted)]">
                          Father: {certificate.father_name || "N/A"}
                        </p>
                      </td>
                      <td>{certificate.course_name}</td>
                      <td>{certificate.certificate_code}</td>
                      <td>
                        <span className="status-pill">
                          {certificate.admin_approved === "TRUE" ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <Link
                          className="font-semibold text-sky-300"
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
        </div>
      </div>
    </main>
  );
}
