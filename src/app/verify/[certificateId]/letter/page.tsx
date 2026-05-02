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
  const isApproved = certificate.admin_approved.trim().toLowerCase() === "true";
  const isPaid = certificate.certificate_fee_status.trim().toLowerCase() === "paid";

  if (!isApproved || !isPaid) {
    notFound();
  }

  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
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

        .letter-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 60px;
          font-size: 14px;
        }

        .letter-subject {
          text-align: center;
          margin-bottom: 50px;
          font-size: 20px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: underline;
          text-underline-offset: 8px;
          color: #0f172a;
        }

        .letter-salutation {
          margin-bottom: 30px;
          font-weight: 600;
        }

        .letter-text {
          font-size: 16px;
          line-height: 1.8;
          text-align: justify;
          margin-bottom: 30px;
        }

        .letter-text p {
          margin-bottom: 25px;
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

        .letter-sig-placeholder {
          height: 60px;
          margin-bottom: 10px;
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
              Completion Letter
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/verify">
              Back to Verification
            </Link>
            <PrintButton />
          </div>
        </div>

        <div className="letter-container">
          <div className="letter-watermark">OFFICIAL</div>

          <div className="letter-header">
            <img src="/logo.png" alt="Logo" className="letter-logo-img" />
            <div className="letter-contact">
              {INSTITUTE_NAME}<br />
              Academic Department<br />
              upskilltechtandlianwala@gmail.com<br />
              www.upskilltechofficials.online
            </div>
          </div>

          <div className="letter-body">
            <div className="letter-meta">
              <div>Ref: <b>{certificate.certificate_code}</b></div>
              <div>Date: <b>{today}</b></div>
            </div>

            <h2 className="letter-subject">Course Completion Certificate</h2>

            <p className="letter-salutation">To Whom It May Concern,</p>

            <div className="letter-text">
              <p>
                This letter serves as formal confirmation that <b>{certificate.student_name}</b>, 
                son/daughter of <b>{certificate.father_name || "N/A"}</b>, 
                holding Registration Number <b>{certificate.registration_no}</b>, 
                has successfully fulfilled all the academic and practical requirements for the 
                <b> {certificate.course_name}</b> training program at {INSTITUTE_NAME}.
              </p>
              
              <p>
                The program was completed on <b>{certificate.issue_date}</b>. Throughout the duration of the course, 
                the student demonstrated exemplary performance, technical proficiency, and a commitment to professional excellence 
                in the subject matter.
              </p>

              <p>
                {INSTITUTE_NAME} is committed to providing industry-standard technical education. This credential 
                is awarded only after rigorous assessment and validation of the student&apos;s competencies. 
              </p>

              <p>
                The authenticity of this letter and the associated certification can be verified at any time on our 
                official portal by entering the reference number provided above.
              </p>

              <p>
                We commend <b>{certificate.student_name}</b> on this achievement and wish them great success 
                in their professional career.
              </p>
            </div>

            <div className="letter-footer">
              <div className="letter-signature">
                <div className="letter-sig-placeholder">
                  {/* Signature Font Placeholder */}
                  <span style={{ fontFamily: 'Great Vibes, cursive', fontSize: '32px', color: '#001f54' }}>Amir Khan</span>
                </div>
                <div className="letter-sig-line"></div>
                <div className="letter-sig-name">Muhammad Amir Khan</div>
                <div className="letter-sig-title">CEO & Director Academics</div>
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
