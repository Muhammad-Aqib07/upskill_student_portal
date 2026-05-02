import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { INSTITUTE_NAME } from "@/lib/constants";
import { getCertificateWorkspace } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function PublicCertificatePrintPage({
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
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        @media print {
          @page { size: landscape; margin: 0mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          main { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
      <main className="min-h-screen bg-slate-100 p-8 print:bg-white print:p-0">
        <div className="mx-auto mb-6 flex max-w-[297mm] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Printable Certificate
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {certificate.certificate_code}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/verify">
              Back to Verification
            </Link>
            <PrintButton />
          </div>
        </div>

        {/* Certificate Container (A4 Landscape aspect ratio approximation) */}
        <div className="relative mx-auto flex h-[210mm] w-[297mm] flex-col overflow-hidden bg-[#f8fbff] shadow-2xl print:shadow-none">
          {/* Background Decorative Elements */}
          {/* Top Left Corner */}
          <div className="absolute -left-10 -top-10 h-64 w-64 rounded-br-[100px] bg-blue-900 shadow-xl"></div>
          <div className="absolute -left-16 -top-16 h-80 w-80 rounded-br-[120px] bg-blue-800/80"></div>
          
          {/* Top Right Corner */}
          <div className="absolute -right-20 -top-32 h-[400px] w-[500px] rotate-12 bg-[#0a357f]"></div>
          <div className="absolute -right-32 -top-24 h-[400px] w-[500px] rotate-12 bg-[#1e58b5] shadow-2xl"></div>

          {/* Bottom Left Corner */}
          <div className="absolute -bottom-32 -left-20 h-[400px] w-[500px] -rotate-12 bg-[#0a357f]"></div>
          <div className="absolute -bottom-24 -left-32 h-[400px] w-[500px] -rotate-12 bg-[#1e58b5] shadow-2xl"></div>

          {/* Bottom Right Corner */}
          <div className="absolute -bottom-10 -right-10 h-64 w-64 rounded-tl-[100px] bg-blue-900 shadow-xl"></div>
          
          {/* Inner Border */}
          <div className="absolute inset-4 z-10 border-2 border-blue-900/20"></div>

          {/* Foreground Content */}
          <div className="relative z-20 flex h-full flex-col px-20 py-16">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              {/* Logo Placeholder */}
              <div className="flex items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-blue-500 bg-white">
                  {/* Simplified Logo Icon */}
                  <svg className="h-10 w-10 text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9L4 10.63V17L12 21L20 17V10.63L21 10.09V17H23V9L12 3ZM12 5.18L18.91 8.9L12 12.63L5.09 8.9L12 5.18Z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-4xl font-bold tracking-tight text-blue-500">
                    TECH <span className="text-blue-900">UPSKILL</span>
                  </h2>
                  <p className="text-sm font-bold tracking-widest text-blue-500">
                    LEARN &bull; EARN &bull; GROW
                  </p>
                </div>
              </div>

              {/* QR and ID */}
              <div className="flex flex-col items-center">
                <img 
                  src={`https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=${encodeURIComponent(certificate.certificate_code)}&choe=UTF-8`}
                  alt="QR Code"
                  className="h-24 w-24 rounded bg-white p-1 shadow-sm"
                />
                <p className="mt-2 text-xs text-slate-600">Certificate ID</p>
                <p className="text-sm font-bold text-slate-900">{certificate.certificate_code}</p>
              </div>
            </div>

            {/* Title Section */}
            <div className="mt-12 text-center">
              <h1 className="font-display text-4xl font-bold tracking-widest text-blue-900 uppercase">
                PROFESSIONAL CERTIFICATION
              </h1>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-widest text-blue-500 uppercase">
                {certificate.course_name}
              </h2>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-[2px] w-16 bg-blue-900"></div>
                <div className="h-2 w-2 rounded-full bg-blue-900"></div>
                <div className="h-[2px] w-16 bg-blue-900"></div>
              </div>
            </div>

            {/* Body Content */}
            <div className="mt-12 flex flex-1 items-start justify-between">
              
              {/* Text Information */}
              <div className="max-w-xl space-y-6">
                <p className="text-lg text-slate-700">This is to certify that</p>
                
                <div className="border-b border-slate-400 pb-1">
                  <p className="font-['var(--font-great-vibes)',_cursive] text-5xl text-blue-950">
                    {certificate.student_name}
                  </p>
                </div>
                
                <div className="flex items-end gap-3 border-b border-slate-400 pb-1">
                  <p className="text-lg text-slate-700">Son/Daughter of</p>
                  <p className="font-['var(--font-great-vibes)',_cursive] text-4xl text-blue-950">
                    {certificate.father_name || "N/A"}
                  </p>
                </div>

                <p className="text-sm font-semibold leading-relaxed text-slate-800">
                  has successfully passed the <span className="font-bold text-blue-900">Professional Certification - {certificate.course_name}</span> exam.
                </p>

                <p className="text-xs leading-relaxed text-slate-600">
                  This certificate attests to the knowledge and comprehension of fundamentals 
                  for the named individual and is the level of study endorsed according to the 
                  <span className="font-bold text-blue-900"> Tech Upskill </span> 
                  Professional Certification Program.
                </p>
              </div>

              {/* Seal */}
              <div className="mr-8 mt-4 flex items-center justify-center">
                <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-[6px] border-blue-900 bg-transparent p-2">
                  <div className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-dashed border-blue-900">
                    <div className="text-center">
                      <div className="flex justify-center gap-1 text-blue-900">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <svg className="h-8 w-8 -translate-y-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      </div>
                      <p className="mt-2 text-center font-bold text-blue-900 leading-tight tracking-widest">
                        ACCREDITED<br />PROGRAM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-end justify-between">
              
              {/* Date & Signatures */}
              <div className="flex items-end gap-10">
                <div className="flex items-center gap-2 pb-6">
                  <svg className="h-6 w-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="text-sm font-bold text-slate-800">Date: {certificate.issue_date}</p>
                </div>

                <div className="flex gap-8 text-center text-xs">
                  <div className="flex flex-col items-center">
                    <p className="font-['var(--font-great-vibes)',_cursive] text-2xl text-slate-700">Aqib</p>
                    <div className="h-px w-32 bg-slate-400 my-1"></div>
                    <p className="font-bold text-slate-900">Muhammad Aqib Khan</p>
                    <p className="text-slate-600">Compliance Director</p>
                    <p className="font-bold text-slate-900">Tech Upskill</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <p className="font-['var(--font-great-vibes)',_cursive] text-2xl text-slate-700">Amir</p>
                    <div className="h-px w-32 bg-slate-400 my-1"></div>
                    <p className="font-bold text-slate-900">Muhammad Amir Khan</p>
                    <p className="text-slate-600">CEO</p>
                    <p className="font-bold text-slate-900">Tech Upskill</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <p className="font-['var(--font-great-vibes)',_cursive] text-2xl text-slate-700">Kamran</p>
                    <div className="h-px w-32 bg-slate-400 my-1"></div>
                    <p className="font-bold text-slate-900">Kamran Ahmad</p>
                    <p className="text-slate-600">Managing Director</p>
                    <p className="font-bold text-slate-900">Tech Upskill</p>
                  </div>
                </div>
              </div>

              {/* Programs */}
              <div className="flex flex-col items-start gap-4 pb-2">
                <div>
                  <p className="text-xs font-bold text-slate-800">Program</p>
                  <div className="flex items-center gap-1 text-blue-900 mt-1">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5-5.5-5.5L12 6.5z"/>
                    </svg>
                    <div>
                      <p className="text-sm font-bold leading-none">buildingSMART</p>
                      <p className="text-[10px] text-slate-500 leading-none">International</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Chapter</p>
                  <div className="flex items-center gap-1 text-blue-900 mt-1">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.5l5.5 5.5-5.5 5.5-5.5-5.5L12 6.5z"/>
                    </svg>
                    <div>
                      <p className="text-sm font-bold leading-none">buildingSMART</p>
                      <p className="text-[10px] text-slate-500 leading-none">United Kingdom and Ireland</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
}
