"use client";

import { FormEvent, useState } from "react";
import { studentRegistrationFields, courses } from "@/lib/portal-data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function StudentRegisterForm() {
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
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const selectedCourse = String(formData.get("selectedCourse") ?? "");

    const supabase = createSupabaseBrowserClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          selected_course: selectedCourse,
        },
      },
    });

    if (signUpError) {
      setIsSubmitting(false);
      setError(signUpError.message);
      return;
    }

    if (!data.user?.id) {
      setIsSubmitting(false);
      setError("Student account was created, but no user ID was returned.");
      return;
    }

    formData.append("authUserId", data.user.id);

    const response = await fetch("/api/students/register", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as { error?: string; warning?: string };

    setIsSubmitting(false);

    if (!response.ok) {
      setError(result.error ?? "Student data could not be saved.");
      return;
    }

    form.reset();
    setSuccessMessage(
      [
        "Your account has been created and your student record has been saved to the institute database.",
        result.warning ?? "",
      ]
        .filter(Boolean)
        .join(" "),
    );
  }

  return (
    <form className="mt-10 grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
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

      {studentRegistrationFields.map((field) => (
        <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
          <label className="field-label" htmlFor={field.name}>
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              className="select-field"
              id={field.name}
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
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              accept={field.type === "file" ? "image/png,image/jpeg,image/webp" : undefined}
              required={field.name !== "profileImageTwo"}
            />
          )}
        </div>
      ))}

      <div>
        <label className="field-label" htmlFor="password">
          Password
        </label>
        <input
          className="input-field"
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          minLength={6}
          required
        />
      </div>

      <div>
        <label className="field-label" htmlFor="courseMode">
          Enrollment mode
        </label>
        <select className="select-field" id="courseMode" name="courseMode" defaultValue="">
          <option disabled value="">
            Select enrollment mode
          </option>
          <option value="single">Single course</option>
          <option value="multiple">Multiple courses later</option>
        </select>
      </div>

      <div className="md:col-span-2 flex flex-col gap-3 rounded-[24px] border border-dashed border-sky-200 bg-sky-50 p-5 text-sm leading-7 text-slate-600">
        <p className="font-semibold text-slate-900">Current stage</p>
        <p>
          This form creates the student login account, saves the admission
          record in Google Sheets, and stores uploaded profile images in
          Supabase Storage when the bucket is configured correctly.
        </p>
        <p>Accepted image formats: JPG, PNG, or WebP up to 200 KB.</p>
      </div>

      <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create Student Account"}
        </button>
      </div>
    </form>
  );
}
