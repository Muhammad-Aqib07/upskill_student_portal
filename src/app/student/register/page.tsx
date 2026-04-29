import Link from "next/link";
import { StudentRegisterForm } from "@/components/auth/student-register-form";

export default function StudentRegisterPage() {
  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <div className="glass-card rounded-[32px] p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              Admission Form
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
              Student registration for Tech Upskill Learn
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Students can create their own portal account here, while admin can
              also add old or completed students directly into the database.
            </p>
          </div>

          <StudentRegisterForm />

          <div className="mt-8 text-sm text-slate-600">
            Already have an account?{" "}
            <Link className="font-semibold text-sky-700" href="/student/login">
              Open student login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
