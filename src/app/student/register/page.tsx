import Link from "next/link";
import { StudentRegisterForm } from "@/components/auth/student-register-form";
import { INSTITUTE_NAME } from "@/lib/constants";

export default function StudentRegisterPage() {
  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="premium-card rounded-[36px] p-8 lg:p-10">
            <div className="brand-badge w-fit">
              <span className="brand-orb" />
              Admission form
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
              Create your student account through a polished, premium
              registration experience.
            </h1>
            <p className="section-copy mt-5 text-base">
              The functionality stays the same, but the layout is now built to
              feel more professional, easier to trust, and smoother to complete
              on mobile.
            </p>

            <div className="mt-10 grid gap-3">
              {[
                "Create student portal access",
                "Store admission details in the institute database",
                "Upload profile images for record keeping",
                "Begin the certificate workflow from a verified profile",
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
            <div className="max-w-3xl">
              <p className="section-kicker">Student Registration</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                Admissions for {INSTITUTE_NAME}
              </h2>
              <p className="section-copy mt-4 text-sm">
                Fill out the form below to create your account and save your
                student record. No workflow logic has been changed.
              </p>
            </div>

            <StudentRegisterForm />

            <div className="mt-8 text-sm text-[var(--muted)]">
              Already have an account?{" "}
              <Link className="font-semibold text-sky-300" href="/student/login">
                Open student login
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
