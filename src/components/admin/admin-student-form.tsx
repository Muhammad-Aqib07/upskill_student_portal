"use client";

import { FormEvent, useState } from "react";
import { courses, studentRegistrationFields } from "@/lib/portal-data";

export function AdminStudentForm() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(form);
    const response = await fetch("/api/admin/students", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as {
      error?: string;
      warning?: string;
      registrationNo?: string;
    };

    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error ?? "Student could not be saved.");
      return;
    }

    form.reset();
    setSuccessMessage(
      result.warning
        ? `Student saved with registration ${result.registrationNo}. ${result.warning}`
        : `Student saved successfully with registration ${result.registrationNo}.`,
    );
  }

  return (
    <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
      {error ? (
        <div className="md:col-span-2 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="md:col-span-2 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {studentRegistrationFields
        .filter((field) => !field.name.startsWith("profileImage"))
        .map((field) => (
        <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
          <label className="field-label" htmlFor={`admin-${field.name}`}>
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              className="select-field"
              id={`admin-${field.name}`}
              name={field.name}
              defaultValue=""
              required
            >
              <option disabled value="">
                Select an option
              </option>
              {field.name === "selectedCourse"
                ? courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))
                : field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
            </select>
          ) : (
            <input
              className="input-field"
              id={`admin-${field.name}`}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required
            />
          )}
        </div>
      ))}

      <div>
        <label className="field-label" htmlFor="enrollmentStatus">
          Enrollment Status
        </label>
        <select
          className="select-field"
          id="enrollmentStatus"
          name="enrollmentStatus"
          defaultValue="active"
        >
          <option value="active">active</option>
          <option value="completed">completed</option>
          <option value="inactive">inactive</option>
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="feeStatus">
          Fee Status
        </label>
        <select className="select-field" id="feeStatus" name="feeStatus" defaultValue="unpaid">
          <option value="paid">paid</option>
          <option value="unpaid">unpaid</option>
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="courseCompleted">
          Course Completed
        </label>
        <select
          className="select-field"
          id="courseCompleted"
          name="courseCompleted"
          defaultValue="FALSE"
        >
          <option value="FALSE">No</option>
          <option value="TRUE">Yes</option>
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="profileImageOne">
          Upload Profile Image 1
        </label>
        <input
          className="input-field"
          id="profileImageOne"
          name="profileImageOne"
          type="file"
          accept="image/png,image/jpeg,image/webp"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="profileImageTwo">
          Upload Profile Image 2
        </label>
        <input
          className="input-field"
          id="profileImageTwo"
          name="profileImageTwo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
        />
      </div>

      <div>
        <label className="field-label" htmlFor="profileImageOneLink">
          Profile Image 1 URL
        </label>
        <input
          className="input-field"
          id="profileImageOneLink"
          name="profileImageOneLink"
          type="url"
          placeholder="https://..."
        />
      </div>

      <div className="md:col-span-2">
        <label className="field-label" htmlFor="profileImageTwoLink">
          Profile Image 2 URL
        </label>
        <input
          className="input-field"
          id="profileImageTwoLink"
          name="profileImageTwoLink"
          type="url"
          placeholder="Optional second image link"
        />
      </div>

      <div className="md:col-span-2">
        <div className="rounded-[22px] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-slate-700">
          Upload images here to store them in Supabase Storage automatically, or
          paste existing public image URLs if the files are already hosted.
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="field-label" htmlFor="notes">
          Admin Notes
        </label>
        <textarea
          className="textarea-field min-h-28"
          id="notes"
          name="notes"
          placeholder="Old student, completed student, manual entry notes..."
        />
      </div>

      <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving student..." : "Save Student From Admin"}
        </button>
      </div>
    </form>
  );
}
