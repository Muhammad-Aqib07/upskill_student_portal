import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { requireAdminUser } from "@/lib/auth";
import { INSTITUTE_NAME } from "@/lib/constants";
import { getCertificateById } from "@/lib/google-sheets";

export const dynamic = "force-dynamic";

export default async function CertificatePrintPage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  await requireAdminUser();
  const { certificateId } = await params;
  const certificate = await getCertificateById(certificateId);

  if (!certificate) {
    notFound();
  }

  return (
    <main className="panel-shell print:bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 print:max-w-none print:px-0 print:py-0">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Printable Certificate
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {certificate.certificate_code}
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="secondary-button w-fit" href="/admin/certificates">
              Back to Certificates
            </Link>
            <PrintButton />
          </div>
        </div>

        <div className="rounded-[38px] border-[10px] border-white bg-[linear-gradient(180deg,_#fefefe_0%,_#f1f6ff_100%)] p-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] print:rounded-none print:border-0 print:shadow-none lg:p-12">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                {INSTITUTE_NAME}
              </p>
              <h2 className="mt-5 font-display text-5xl font-semibold text-slate-950">
                Professional Certification
              </h2>
              <p className="mt-2 text-2xl text-sky-600">{certificate.course_name}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Certificate ID
              </p>
              <p className="mt-2 font-semibold text-slate-950">
                {certificate.certificate_code}
              </p>
            </div>
          </div>

          <div className="mt-14 space-y-6 text-slate-700">
            <p className="text-xl">This is to certify that</p>
            <p className="font-display text-6xl text-sky-800">
              {certificate.student_name}
            </p>
            <p className="text-2xl leading-10">
              Son / Daughter of{" "}
              <span className="font-display text-4xl text-sky-700">
                {certificate.father_name || "N/A"}
              </span>
            </p>
            <p className="max-w-4xl text-lg leading-9">
              has successfully completed the training program at {INSTITUTE_NAME}.
              This certificate has been issued through the administration panel
              and can be verified publicly when the public visibility rule is
              enabled.
            </p>
          </div>

          <div className="mt-14 grid gap-4 border-t border-slate-200 pt-8 md:grid-cols-4">
            <MetaCard label="Issue Date" value={certificate.issue_date} />
            <MetaCard label="Course" value={certificate.course_name} />
            <MetaCard
              label="Fee Status"
              value={certificate.certificate_fee_status}
            />
            <MetaCard
              label="Verification"
              value={certificate.public_visible === "TRUE" ? "Public" : "Private"}
            />
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              "Muhammad Aqib Khan",
              "Muhammad Amir Khan",
              "Kamran Ahmad",
            ].map((signatory) => (
              <div key={signatory} className="border-t border-slate-300 pt-4 text-center">
                <p className="font-display text-3xl text-sky-800">Signature</p>
                <p className="mt-3 font-semibold text-slate-950">{signatory}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-950">{value || "N/A"}</p>
    </div>
  );
}
