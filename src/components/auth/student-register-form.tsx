"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { studentRegistrationFields, courses } from "@/lib/portal-data";

interface StudentRegisterFormProps {
  userEmail: string;
  authUserId: string;
}

export function StudentRegisterForm({ userEmail, authUserId }: StudentRegisterFormProps) {
  const router = useRouter();
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
    
    // Add auth identifiers from props
    formData.append("authUserId", authUserId);
    formData.append("email", userEmail);

    const response = await fetch("/api/students/register", {
      method: "POST",
      body: formData,
    });

    const result = (await response.json()) as { error?: string; warning?: string };

    if (!response.ok) {
      setIsSubmitting(false);
      setError(result.error ?? "Student data could not be saved.");
      return;
    }

    // Set the password in Supabase Auth
    const password = formData.get("accountPassword") as string;
    if (password) {
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = createSupabaseBrowserClient();
      const { error: passwordError } = await supabase.auth.updateUser({ password });
      
      if (passwordError) {
        console.error("Failed to set password:", passwordError.message);
      }
    }

    form.reset();
    setSuccessMessage(
      [
        "Your student record has been saved to the institute database.",
        result.warning ?? "",
      ]
        .filter(Boolean)
        .join(" "),
    );
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/student/dashboard");
      router.refresh();
    }, 1500);
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
          <div className="mt-2 text-emerald-600 font-medium">Redirecting to dashboard...</div>
        </div>
      ) : null}

      {studentRegistrationFields
        .filter((field) => field.name !== "email")
        .map((field) => (
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
        <label className="field-label" htmlFor="accountPassword">
          Set Account Password
        </label>
        <input
          className="input-field"
          id="accountPassword"
          name="accountPassword"
          type="password"
          placeholder="Create a login password"
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
          This form saves your admission record in the institute database and stores 
          uploaded profile images. Your account login was already created in the previous step.
        </p>
        <p>Accepted image formats: JPG, PNG, or WebP up to 200 KB.</p>
      </div>

      <div className="md:col-span-2 flex flex-col gap-4 sm:flex-row">
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting Registration..." : "Complete Registration"}
        </button>
      </div>
    </form>
  );
}
