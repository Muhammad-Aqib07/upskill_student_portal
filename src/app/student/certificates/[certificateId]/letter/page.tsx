import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { INSTITUTE_NAME } from "@/lib/constants";
import { requireStudentUser } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function StudentCompletionLetterPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const user = await requireStudentUser();

  const data = await getStudentDashboardData({
    authUserId: user.id,
    email: user.email,
  });

  if (!data.student) {
    redirect("/student/register");
  }

  // Only show certificates belonging to this student
  const certificate = data.certificates.find(
    (c) =>
      c.certificate_id === certificateId ||
      c.certificate_code === certificateId,
  );

  if (!certificate) {
    notFound();
  }

  // Access gate: must be approved + paid
  const isApproved = certificate.admin_approved.toLowerCase() === "true";
  const isPaid = certificate.certificate_fee_status.toLowerCase() === "paid";

  if (!isApproved || !isPaid) {
    notFound();
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        @media print {
          @page { size: portrait; margin: 0mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
          .no-print { display: none !important; }
        }

        .letter-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 30mm 25mm;
          box-shadow: 0 40px 100px rgba(0,0,0,0.05);
          color: #1e293b;
          overflow: hidden;
        }

        .letter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #001f54;
          padding-bottom: 20px;
        }

        .letter-logo-img {
          height: 90px;
          width: auto;
        }

        .letter-contact {
          text-align: right;
          font-size: 11px;
          color: #64748b;
          line-height: 1.6;
        }

        .letter-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 120px;
          font-weight: 900;
          color: #f1f5f9;
          z-index: 1;
          pointer-events: none;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0.5;
        }

        .letter-body {
          position: relative;
          z-index: 10;
          flex: 1;
        }

        .letter-footer {
          margin-top: 80px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .letter-signature {
          width: 250px;
        }

        .letter-sig-line {
          height: 1px;
          background: #1e293b;
          margin-bottom: 10px;
        }

        .letter-sig-name {
          font-weight: 700;
          font-size: 14px;
        }

        .letter-sig-title {
          font-size: 12px;
          color: #64748b;
        }
      `}</style>

      <main className="min-h-screen bg-slate-50 p-8 print:bg-white print:p-0">
        <div className="no-print mx-auto mb-8 flex max-w-[210mm] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Official Correspondence
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Course Completion Letter
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/student/certificates">
              ← My Documents
            </Link>
            <PrintButton />
          </div>
        </div>

        <div className="letter-container">
          <div className="letter-watermark">OFFICIAL</div>

          <div className="letter-body">
            {/* Header / Letterhead */}
            <div className="letter-header">
              <img src="/logo.png" alt="Logo" className="letter-logo-img" />
              <div className="letter-contact">
                {INSTITUTE_NAME}<br />
                Academic Department<br />
                upskilltechtandlianwala@gmail.com<br />
                www.upskilltechofficials.online
              </div>
            </div>

            {/* Reference & Date */}
            <div className="letter-meta">
              <div>
                Ref No: <b>{certificate.certificate_code}</b>
              </div>
              <div>Date: <b>{today}</b></div>
            </div>

            {/* Subject */}
            <h2 className="letter-subject">Course Completion Letter</h2>

            <p className="letter-salutation">To Whom It May Concern,</p>

            <div className="letter-text">
              <p>
                This letter is issued to formally certify that{" "}
                <b>{certificate.student_name}</b>, son/daughter of{" "}
                <b>{certificate.father_name || "N/A"}</b>, bearing Registration
                Number <b>{certificate.registration_no || "N/A"}</b>, has
                successfully completed all academic and practical requirements
                of the <b>{certificate.course_name}</b> program offered by{" "}
                {INSTITUTE_NAME}.
              </p>

              <p>
                The program was successfully completed on{" "}
                <b>{certificate.issue_date}</b>. Throughout the course, the
                student demonstrated exceptional dedication, technical
                proficiency, and a strong commitment to professional excellence
                in the relevant subject matter.
              </p>

              <p>
                {INSTITUTE_NAME} is committed to delivering industry-standard
                technical and professional education. Credentials issued by this
                institution are awarded only after rigorous assessment and
                comprehensive evaluation of the student&apos;s knowledge and
                competencies.
              </p>

              <p>
                The authenticity of this document and the associated
                certificate may be verified at any time by scanning the attached
                QR code or by using the reference number stated above on our
                official verification portal.
              </p>

              <p>
                We extend our heartfelt congratulations to{" "}
                <b>{certificate.student_name}</b> on this achievement and wish
                them continued success in all future academic and professional
                pursuits.
              </p>
            </div>

            {/* Footer with Signature, Stamp, QR */}
            <div className="letter-footer">
              <div className="letter-signature">
                <div className="letter-sig-line" />
                <div className="letter-sig-name">Muhammad Amir Khan</div>
                <div className="letter-sig-title">CEO &amp; Director Academics</div>
                <div className="letter-sig-title">{INSTITUTE_NAME}</div>
              </div>
              <img src="/sealimage.png" alt="Official Seal" className="h-44 w-auto opacity-95" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
