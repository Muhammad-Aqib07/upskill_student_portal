"use client";

import { useMemo, useState } from "react";
import { INSTITUTE_NAME } from "@/lib/constants";

type EnrollmentOption = {
  enrollmentId: string;
  studentId: string;
  studentName: string;
  fatherName: string;
  phone: string;
  city: string;
  registrationNo: string;
  courseName: string;
  status: string;
};

export function CertificateForm({
  enrollments,
}: {
  enrollments: EnrollmentOption[];
}) {
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(
    enrollments[0]?.enrollmentId ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEnrollment = useMemo(
    () => enrollments.find((item) => item.enrollmentId === selectedEnrollmentId) ?? null,
    [enrollments, selectedEnrollmentId],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(form);
    const response = await fetch("/api/admin/certificates", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as {
      error?: string;
      certificateCode?: string;
      printUrl?: string;
    };

    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error ?? "Certificate could not be created.");
      return;
    }

    setSuccessMessage(
      `Certificate ${result.certificateCode} created successfully. The record is now ready inside ${INSTITUTE_NAME}.`,
    );
    form.reset();
    setSelectedEnrollmentId(enrollments[0]?.enrollmentId ?? "");
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-[22px] border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-100">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-[22px] border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm leading-6 text-emerald-100">
          {successMessage}
        </div>
      ) : null}

      <div>
        <label className="field-label" htmlFor="enrollmentId">
          Student Enrollment
        </label>
        <select
          className="select-field"
          id="enrollmentId"
          name="enrollmentId"
          value={selectedEnrollmentId}
          onChange={(event) => setSelectedEnrollmentId(event.target.value)}
        >
          {enrollments.map((item) => (
            <option key={item.enrollmentId} value={item.enrollmentId}>
              {item.studentName} | {item.courseName} | {item.registrationNo}
            </option>
          ))}
        </select>
      </div>

      <input
        type="hidden"
        name="studentId"
        value={selectedEnrollment?.studentId ?? ""}
      />
      <input
        type="hidden"
        name="courseName"
        value={selectedEnrollment?.courseName ?? ""}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="issueDate">
            Issue Date
          </label>
          <input
            className="input-field"
            id="issueDate"
            name="issueDate"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="certificateFeeStatus">
            Certification Fee Status
          </label>
          <select
            className="select-field"
            id="certificateFeeStatus"
            name="certificateFeeStatus"
            defaultValue="paid"
          >
            <option value="paid">paid</option>
            <option value="unpaid">unpaid</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-[var(--foreground)]">
          <div className="flex items-start gap-3">
            <input
              className="mt-1 h-4 w-4 accent-sky-400"
              id="adminApproved"
              name="adminApproved"
              type="checkbox"
              value="TRUE"
              defaultChecked
            />
            <div>
              <p className="font-semibold">Admin approved</p>
              <p className="mt-1 text-[var(--muted)]">
                Check this when the certificate has been reviewed and approved.
              </p>
            </div>
          </div>
        </label>

        <label className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 text-sm text-[var(--foreground)]">
          <div className="flex items-start gap-3">
            <input
              className="mt-1 h-4 w-4 accent-sky-400"
              id="publicVisible"
              name="publicVisible"
              type="checkbox"
              value="TRUE"
              defaultChecked
            />
            <div>
              <p className="font-semibold">Publish to public verification</p>
              <p className="mt-1 text-[var(--muted)]">
                Check this box to publish the certificate on the public verification page.
              </p>
            </div>
          </div>
        </label>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-[var(--muted)]">
        {selectedEnrollment ? (
          <div className="grid gap-3 md:grid-cols-2">
            <InfoLine label="Student Name" value={selectedEnrollment.studentName} />
            <InfoLine label="Father Name" value={selectedEnrollment.fatherName || "N/A"} />
            <InfoLine label="Registration No" value={selectedEnrollment.registrationNo} />
            <InfoLine label="Course" value={selectedEnrollment.courseName} />
            <InfoLine label="Enrollment Status" value={selectedEnrollment.status} />
            <InfoLine label="City / Phone" value={[selectedEnrollment.city, selectedEnrollment.phone].filter(Boolean).join(" / ") || "N/A"} />
          </div>
        ) : (
          <p>Select an enrollment to generate a certificate.</p>
        )}
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-2 sm:flex-row">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating certificate..." : "Generate Certificate"}
        </button>
      </div>
    </form>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}
