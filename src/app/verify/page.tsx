import { VerificationSearchForm } from "@/app/verify/verification-search-form";
import { findVerificationRecord } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; fullName?: string; fatherName?: string }>;
}) {
  const { q = "", fullName = "", fatherName = "" } = await searchParams;
  const attemptedLookup = Boolean(q || fullName || fatherName);
  const hasCompleteInput = Boolean(q.trim() && fullName.trim() && fatherName.trim());
  const result = hasCompleteInput
    ? await findVerificationRecord({ query: q, fullName, fatherName })
    : null;

  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
        <div className="glass-card rounded-[32px] p-8 lg:p-10">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              Public Verification
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Verify a certificate from Tech Upskill Learn
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600">
              Employers and institutions can verify a student certificate using
              the certificate ID or registration number together with matching
              student identity details. Only approved and paid certification
              records appear publicly.
            </p>
          </div>

          <VerificationSearchForm
            query={q}
            fullName={fullName}
            fatherName={fatherName}
          />

          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-950">
              {attemptedLookup ? "Verification result" : "Public record preview"}
            </h2>
            {attemptedLookup && !hasCompleteInput ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-800">
                Enter the certificate ID or registration number, student full
                name, and father name to verify a student record.
              </div>
            ) : null}

            {attemptedLookup && hasCompleteInput && !result ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-800">
                No public certificate was found for the provided verification
                details.
              </div>
            ) : null}

            {result ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <RecordItem label="Student Name" value={result.student_name} />
                <RecordItem label="Father Name" value={result.father_name || "N/A"} />
                <RecordItem label="Course Name" value={result.course_name} />
                <RecordItem label="Institute Name" value="Tech Upskill Learn" />
                <RecordItem label="Issue Date" value={result.issue_date} />
                <RecordItem label="Certificate Status" value="Verified" />
                <RecordItem label="Certificate ID" value={result.certificate_code} />
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <RecordItem label="Student Name" value="Visible after identity match" />
                <RecordItem label="Father Name" value="Required for verification" />
                <RecordItem label="Course Name" value="Shown for verified records only" />
                <RecordItem label="Institute Name" value="Tech Upskill Learn" />
                <RecordItem label="Issue Date" value="Displayed after successful verification" />
                <RecordItem label="Certificate Status" value="Pending lookup" />
                <RecordItem label="Certificate ID" value="Enter complete student details above" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function RecordItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
