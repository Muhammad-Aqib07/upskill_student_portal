"use client";

export function VerificationSearchForm({
  query,
  fullName,
  fatherName,
}: {
  query: string;
  fullName: string;
  fatherName: string;
}) {
  return (
    <form className="mx-auto mt-10 max-w-3xl">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="field-label" htmlFor="verification-input">
            Certificate ID or Registration Number
          </label>
          <input
            className="input-field"
            id="verification-input"
            name="q"
            placeholder="TUL/WD/2026/0001 or TUL-REG-00001"
            defaultValue={query}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="verification-full-name">
            Student Full Name
          </label>
          <input
            className="input-field"
            id="verification-full-name"
            name="fullName"
            placeholder="Enter student full name"
            defaultValue={fullName}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="verification-father-name">
            Father Name
          </label>
          <input
            className="input-field"
            id="verification-father-name"
            name="fatherName"
            placeholder="Enter father name"
            defaultValue={fatherName}
            required
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <button className="primary-button min-w-48" type="submit">
          Verify Record
        </button>
      </div>
    </form>
  );
}
