import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { INSTITUTE_NAME } from "@/lib/constants";
import { requireStudentUser } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function StudentCertificatePrintPage({
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cinzel:wght@400;700&family=Playfair+Display:wght@400;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap');

        @media print {
          @page { size: landscape; margin: 0mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; }
          .no-print { display: none !important; }
        }

        .cert-container {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #fff;
          position: relative;
          width: 297mm;
          height: 210mm;
          overflow: hidden;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          box-shadow: 0 40px 100px rgba(0,0,0,0.1);
        }
        .cert-border-outer { position: absolute; inset: 0; border: 15px solid #001f54; z-index: 10; }
        .cert-border-inner { position: absolute; inset: 20px; border: 2px solid #00a3e0; z-index: 10; }
        .cert-bg-pattern {
          position: absolute; inset: 0; opacity: 0.03;
          background-image: radial-gradient(#001f54 1px, transparent 1px);
          background-size: 20px 20px; z-index: 1;
        }
        .cert-accent-1 {
          position: absolute; top: -100px; right: -100px; width: 300px; height: 300px;
          background: #001f54; transform: rotate(45deg); z-index: 5;
        }
        .cert-accent-2 {
          position: absolute; bottom: -100px; left: -100px; width: 300px; height: 300px;
          background: #00a3e0; transform: rotate(45deg); z-index: 5;
        }
        .cert-content {
          position: relative; z-index: 20; height: 100%; display: flex;
          flex-direction: column; align-items: center; padding: 25px 60px; text-align: center;
        }
        .cert-header-logo { margin-bottom: 15px; }
        .cert-header-logo img { height: 80px; width: auto; }

        .cert-top-meta {
          position: absolute;
          top: 40px;
          left: 50px;
          text-align: left;
          z-index: 30;
        }

        .cert-top-meta-item {
          font-size: 10px;
          color: #59708f;
          margin-bottom: 2px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cert-top-meta-item b {
          color: #001f54;
          font-weight: 700;
        }
        .cert-title {
          font-family: 'Playfair Display', serif; font-size: 38px; font-weight: 700;
          color: #001f54; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px;
        }
        .cert-subtitle {
          font-size: 14px; font-weight: 700; color: #00a3e0; letter-spacing: 0.5em;
          text-transform: uppercase; margin-bottom: 20px;
        }
        .cert-recipient-label { font-size: 17px; color: #59708f; font-weight: 400; margin-bottom: 16px; }
        .cert-recipient-name {
          font-family: 'Cinzel', serif; font-size: 46px; color: #001f54;
          margin-bottom: 12px; line-height: 1.1; font-weight: 700;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .cert-father-name {
          font-size: 17px;
          color: #59708f;
          font-weight: 600;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .cert-underline {
          width: 380px; height: 2px;
          background: linear-gradient(to right, transparent, #00a3e0, transparent);
          margin-bottom: 15px;
        }
        .cert-course-info { font-size: 16px; color: #001f54; max-width: 850px; line-height: 1.6; }
        .cert-course-info b { font-weight: 700; color: #00a3e0; }
        .cert-footer { margin-top: auto; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 15px; }
        .cert-metadata { flex: 1; visibility: hidden; }
        .cert-meta-item { font-size: 11px; color: #59708f; margin-bottom: 4px; }
        .cert-meta-item b { color: #001f54; font-weight: 700; }
        .cert-signatures { flex: 3; display: flex; justify-content: center; gap: 30px; }
        .cert-seal-container { flex: 1; display: flex; justify-content: flex-end; padding-right: 30px; padding-bottom: 10px; }
        .cert-sig-block { display: flex; flex-direction: column; align-items: center; }
        .cert-sig-line { width: 140px; height: 1px; background: #001f54; margin-bottom: 8px; }
        .cert-sig-font { font-family: 'Great Vibes', cursive; font-size: 26px; color: #001f54; margin-bottom: -4px; }
        .cert-sig-title { font-size: 10px; font-weight: 700; color: #59708f; text-transform: uppercase; letter-spacing: 0.1em; }
        .cert-seal {
          width: 140px; height: 140px; opacity: 0.95;
        }
        .cert-institute-name {
          font-family: 'Playfair Display', serif; font-size: 13px; font-weight: 700;
          color: #001f54; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px;
        }
      `}</style>

      <main className="min-h-screen bg-slate-100 p-8 print:bg-white print:p-0">
        <div className="no-print mx-auto mb-6 flex max-w-[297mm] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
              Course Completion Certificate
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {certificate.certificate_code}
            </h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/student/certificates">
              ← My Documents
            </Link>
            <PrintButton />
          </div>
        </div>

        <div className="cert-container">
          <div className="cert-border-outer" />
          <div className="cert-border-inner" />
          <div className="cert-bg-pattern" />
          <div className="cert-accent-1" />
          <div className="cert-accent-2" />

          <div className="cert-content">
            <div className="cert-top-meta">
              <div className="cert-top-meta-item">Registration: <b>{certificate.registration_no || "N/A"}</b></div>
              <div className="cert-top-meta-item">Certificate ID: <b>{certificate.certificate_code}</b></div>
              <div className="cert-top-meta-item">Date of Issue: <b>{certificate.issue_date}</b></div>
            </div>

            {/* Logo */}
            <div className="cert-header-logo">
              <img src="/logo.png" alt="Logo" />
            </div>

            <p className="cert-institute-name">{INSTITUTE_NAME}</p>
            <h1 className="cert-title">Certificate</h1>
            <p className="cert-subtitle">of completion</p>

            <p className="cert-recipient-label">This certificate is proudly presented to</p>
            <h2 className="cert-recipient-name">{certificate.student_name}</h2>
            <p className="cert-father-name">S/O / D/O: {certificate.father_name || "N/A"}</p>
            <div className="cert-underline" />

            <div className="cert-course-info">
              <p>
                For successfully completing all the requirements of the{" "}
                <b>{certificate.course_name}</b> program at {INSTITUTE_NAME}.
              </p>
              <p className="mt-3 text-sm text-slate-500">
                This individual has demonstrated the required proficiency and competencies
                as established by the {INSTITUTE_NAME} Academic Board.
              </p>
            </div>

            <div className="cert-footer">
              <div className="cert-metadata">
                <div className="cert-meta-item">
                  Student: <b>{certificate.student_name}</b>
                </div>
                <div className="cert-meta-item">
                  Registration: <b>{certificate.registration_no || "N/A"}</b>
                </div>
                <div className="cert-meta-item">
                  Certificate ID: <b>{certificate.certificate_code}</b>
                </div>
                <div className="cert-meta-item">
                  Date of Issue: <b>{certificate.issue_date}</b>
                </div>
              </div>

              <div className="cert-signatures">
                <div className="cert-sig-block">
                  <p className="cert-sig-font">Amir Khan</p>
                  <div className="cert-sig-line" />
                  <p className="cert-sig-title">CEO &amp; Founder</p>
                </div>
                <div className="cert-sig-block">
                  <p className="cert-sig-font">Kamran Ahmad</p>
                  <div className="cert-sig-line" />
                  <p className="cert-sig-title">Managing Director</p>
                </div>
                <div className="cert-sig-block">
                  <p className="cert-sig-font">Aqib Khan</p>
                  <div className="cert-sig-line" />
                  <p className="cert-sig-title">Director of Academics</p>
                </div>
              </div>

              <div className="cert-seal-container">
                <img src="/sealimage.png" alt="Official Seal" className="cert-seal" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
