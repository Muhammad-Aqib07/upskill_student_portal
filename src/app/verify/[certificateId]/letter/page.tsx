import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { INSTITUTE_NAME } from "@/lib/constants";
import { getCertificateWorkspace } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function PublicCompletionLetterPrintPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  
  const workspace = await getCertificateWorkspace();
  const certificate = workspace.certificates.find(
    (c) =>
      c.certificate_id === certificateId ||
      c.certificate_code === certificateId,
  );

  if (!certificate) {
    notFound();
  }

  const isPublic = certificate.public_visible.toLowerCase() === "true";
  const isApproved = certificate.admin_approved.toLowerCase() === "true";
  const isPaid = certificate.certificate_fee_status.toLowerCase() === "paid";

  if (!isPublic || !isApproved || !isPaid) {
    notFound();
  }

  return (
    <>
      <style>{`
        @media print {
          @page { size: portrait; margin: 20mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          main { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
      <main className="min-h-screen bg-slate-100 p-8 print:bg-white print:p-0">
        <div className="mx-auto mb-6 flex max-w-[210mm] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Printable Letter
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Course Completion Letter
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/verify">
              Back to Verification
            </Link>
            <PrintButton />
          </div>
        </div>

        <div className="rounded-[38px] border-[10px] border-white bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] print:rounded-none print:border-0 print:shadow-none lg:p-12">
          {/* Letterhead */}
          <div className="border-b-2 border-slate-900 pb-8 text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950 uppercase">
              {INSTITUTE_NAME}
            </h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-slate-500">
              Excellence in Professional Education
            </p>
          </div>

          <div className="mt-12 flex justify-between text-slate-700">
            <div>
              <p>Ref: <span className="font-semibold">{certificate.certificate_code}</span></p>
            </div>
            <div>
              <p>Date: <span className="font-semibold">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
            </div>
          </div>

          <h2 className="mt-16 text-center text-2xl font-bold uppercase tracking-widest text-slate-900 underline underline-offset-8">
            To Whom It May Concern
          </h2>

          <div className="mt-12 space-y-6 text-justify text-lg leading-loose text-slate-800">
            <p>
              This is to certify that <strong>{certificate.student_name}</strong>, 
              son/daughter of <strong>{certificate.father_name || "N/A"}</strong>, 
              bearing Registration Number <strong>{certificate.registration_no || "N/A"}</strong>, 
              has successfully completed the <strong>{certificate.course_name}</strong> program 
              at {INSTITUTE_NAME}.
            </p>
            <p>
              During their time in the program, the student demonstrated a strong commitment to learning and professional development. 
              The curriculum covered essential skills and competencies required for success in the field, and the student fulfilled 
              all requirements for graduation on <strong>{certificate.issue_date}</strong>.
            </p>
            <p>
              This letter is issued upon the request of the student and serves as a formal confirmation of their course completion. 
              The authenticity of this record can be verified publicly using their Certificate ID, Registration Number, or CNIC on our official verification portal.
            </p>
            <p>
              We wish them the best in all their future endeavors.
            </p>
          </div>

          <div className="mt-24">
            <div className="w-64 border-t border-slate-900 pt-4">
              <p className="font-bold text-slate-900">Director / Principal</p>
              <p className="text-slate-600">{INSTITUTE_NAME}</p>
            </div>
          </div>
          
          <div className="mt-16 text-center text-xs text-slate-400 print:mt-auto">
            <p>This is a system-generated document. Verify at the official portal.</p>
          </div>
        </div>
    </main>
    </>
  );
}
