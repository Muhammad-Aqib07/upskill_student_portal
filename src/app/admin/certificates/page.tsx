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
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Admin Certificates
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Generate, approve, and print institute certificates.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              Certificates become ready for verification only when the fee is
              marked paid and public visibility is enabled.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/admin/students">
              Manage Students
            </Link>
            <LogoutButton redirectTo="/admin/login" />
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="glass-card rounded-[32px] p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Create Certificate
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Select any existing enrollment and create a certificate record from
              the administration panel.
            </p>

            <div className="mt-8">
              {enrollmentOptions.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-7 text-slate-600">
                  No enrollments exist yet. Add a student or enrollment first
                  from the admin students page.
                </div>
              ) : (
                <CertificateForm enrollments={enrollmentOptions} />
              )}
            </div>
          </section>

          <section className="glass-card rounded-[32px] p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Issued Certificates
              </h2>
              <span className="rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                {workspace.certificates.length} records
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
              <table className="min-w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-4 font-semibold">Student</th>
                    <th className="px-4 py-4 font-semibold">Student Details</th>
                    <th className="px-4 py-4 font-semibold">Course</th>
                    <th className="px-4 py-4 font-semibold">Certificate Code</th>
                    <th className="px-4 py-4 font-semibold">Status</th>
                    <th className="px-4 py-4 font-semibold">Print</th>
                  </tr>
                </thead>
                <tbody>
                  {workspace.certificates.length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-center text-slate-500" colSpan={6}>
                        No certificate records yet.
                      </td>
                    </tr>
                  ) : null}

                  {workspace.certificates.map((certificate) => (
                    <tr
                      key={certificate.certificate_id}
                      className="border-t border-slate-100"
                    >
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-950">
                          {certificate.student_name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {certificate.registration_no}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-slate-700">
                          Father: {certificate.father_name || "N/A"}
                        </p>
                      </td>
                      <td className="px-4 py-4">{certificate.course_name}</td>
                      <td className="px-4 py-4">{certificate.certificate_code}</td>
                      <td className="px-4 py-4">
                        {certificate.admin_approved === "TRUE" ? "Approved" : "Pending"}
                      </td>
                      <td className="px-4 py-4">
                        <Link
                          className="font-semibold text-sky-700"
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
