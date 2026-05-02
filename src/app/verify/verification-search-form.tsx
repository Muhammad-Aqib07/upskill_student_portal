"use client";

export function VerificationSearchForm({
  query,
}: {
  query: string;
}) {
  return (
    <form className="mx-auto mt-10 max-w-3xl">
      <div className="grid gap-5">
        <div>
          <label className="field-label" htmlFor="verification-input">
            Certificate ID, Registration Number, or CNIC
          </label>
          <input
            className="input-field"
            id="verification-input"
            name="q"
            placeholder="TUL/WD/2026/0001, TUL-REG-00001, or 12345-1234567-1"
            defaultValue={query}
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
