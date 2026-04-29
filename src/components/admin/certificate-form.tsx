"use client";

import { useMemo, useState } from "react";

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
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
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
      `Certificate ${result.certificateCode} created successfully. Open the print view below.`,
    );
    event.currentTarget.reset();
    setSelectedEnrollmentId(enrollments[0]?.enrollmentId ?? "");
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
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

        <div>
          <label className="field-label" htmlFor="adminApproved">
            Admin Approved
          </label>
          <select
            className="select-field"
            id="adminApproved"
            name="adminApproved"
            defaultValue="TRUE"
          >
            <option value="TRUE">Yes</option>
            <option value="FALSE">No</option>
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="publicVisible">
            Public Verification
          </label>
          <select
            className="select-field"
            id="publicVisible"
            name="publicVisible"
            defaultValue="TRUE"
          >
            <option value="TRUE">Visible</option>
            <option value="FALSE">Hidden</option>
          </select>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
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

      <div className="flex flex-col gap-4 sm:flex-row">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating certificate..." : "Generate Certificate"}
        </button>
      </div>
    </form>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
