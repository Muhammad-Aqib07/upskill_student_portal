import { VerificationSearchForm } from "@/app/verify/verification-search-form";
import { INSTITUTE_NAME } from "@/lib/constants";
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
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-10">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="premium-card rounded-[36px] p-8 lg:p-10">
            <div className="brand-badge w-fit">
              <span className="brand-orb" />
              Public verification
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
              Verify a certificate through a more professional public trust
              experience.
            </h1>
            <p className="section-copy mt-5 text-base">
              Employers and institutions can verify certificate records using
              the certificate ID or registration number together with matching
              identity details. Only approved and paid certification records
              appear publicly.
            </p>

            <div className="mt-10 grid gap-3">
              {[
                "Identity-based lookup for stronger privacy",
                "Certificate or registration number supported",
                "Approved and paid records only",
                "Faster scanning and cleaner result presentation",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-[var(--foreground)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-[36px] p-8 lg:p-10">
            <div>
              <p className="section-kicker">Verification Search</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Search institute records
              </h2>
              <p className="section-copy mt-3 text-sm">
                Enter all matching details to check whether a public record is
                available.
              </p>
            </div>

            <VerificationSearchForm
              query={q}
              fullName={fullName}
              fatherName={fatherName}
            />

            <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">
                {attemptedLookup ? "Verification result" : "Public record preview"}
              </h2>
              {attemptedLookup && !hasCompleteInput ? (
                <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-4 text-sm leading-7 text-amber-100">
                  Enter the certificate ID or registration number, student full
                  name, and father name to verify a student record.
                </div>
              ) : null}

              {attemptedLookup && hasCompleteInput && !result ? (
                <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-4 text-sm leading-7 text-amber-100">
                  No public certificate was found for the provided verification
                  details.
                </div>
              ) : null}

              {result ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <RecordItem label="Student Name" value={result.student_name} />
                  <RecordItem label="Father Name" value={result.father_name || "N/A"} />
                  <RecordItem label="Course Name" value={result.course_name} />
                  <RecordItem label="Institute Name" value={INSTITUTE_NAME} />
                  <RecordItem label="Issue Date" value={result.issue_date} />
                  <RecordItem label="Certificate Status" value="Verified" />
                  <RecordItem label="Certificate ID" value={result.certificate_code} />
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <RecordItem label="Student Name" value="Visible after identity match" />
                  <RecordItem label="Father Name" value="Required for verification" />
                  <RecordItem label="Course Name" value="Shown for verified records only" />
                  <RecordItem label="Institute Name" value={INSTITUTE_NAME} />
                  <RecordItem label="Issue Date" value="Displayed after successful verification" />
                  <RecordItem label="Certificate Status" value="Pending lookup" />
                  <RecordItem label="Certificate ID" value="Enter complete student details above" />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function RecordItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
