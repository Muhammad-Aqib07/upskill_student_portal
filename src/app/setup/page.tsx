import { requiredEnvKeys } from "@/lib/env";

export default function SetupPage() {
  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <div className="glass-card rounded-[32px] p-8 lg:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
            Setup Guide
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
            What you will need to provide next
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
            The project structure is ready. To connect real auth, Google
            Sheets, Supabase Storage, and certificate verification, add the
            values below into your local environment file.
          </p>

          <div className="mt-8 grid gap-4">
            {requiredEnvKeys.map((key) => (
              <div
                key={key.name}
                className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <p className="font-semibold text-slate-950">{key.name}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {key.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
