import Link from "next/link";
import { courses } from "@/lib/portal-data";

const commitments = [
  "Professional admissions workflow with organized student data capture",
  "Structured course pathways for digital and applied skill development",
  "Live student authentication and portal-based access",
  "Controlled certificate verification with identity matching",
];

const values = [
  {
    title: "Professionalism",
    description:
      "Every public and student-facing touchpoint is designed to reflect a serious institute standard rather than a basic training page.",
  },
  {
    title: "Accountability",
    description:
      "Student records, enrollments, and certificate outcomes are managed through a documented workflow that supports traceability.",
  },
  {
    title: "Career relevance",
    description:
      "Programs focus on practical digital competencies that support modern freelance, employment, and entrepreneurial pathways.",
  },
];

export default function AboutPage() {
  return (
    <main className="panel-shell">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <section className="rounded-[36px] bg-slate-950 p-8 text-white shadow-[0_28px_80px_rgba(2,6,23,0.32)] lg:p-10">
          <p className="text-sm uppercase tracking-[0.32em] text-sky-200">
            About The Institute
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight lg:text-6xl">
            Tech Upskill Learn is positioned as a professional digital skills
            institute with a modern student and verification workflow.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            The institute experience is built around structured admissions,
            authenticated student access, practical course delivery, and a
            controlled certificate verification model that supports trust for
            employers, institutions, and learners.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="primary-button" href="/student/register">
              Apply for Admission
            </Link>
            <Link className="secondary-button border-white/10 bg-white/5 text-white" href="/verify">
              Verification Portal
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="glass-card rounded-[32px] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Institutional Profile
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              A stronger presentation for a serious learning environment.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Tech Upskill Learn is designed to present itself as a proper
              institute, with attention to structured communication, credible
              student workflows, and controlled verification rather than open,
              unfiltered record exposure.
            </p>

            <div className="mt-8 grid gap-3">
              {commitments.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
              >
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.05)] lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                Program Scope
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {courses.length} professional learning tracks currently supported
                by the portal.
              </h2>
            </div>
            <Link className="secondary-button w-fit" href="/student/login">
              Student Access
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map((course) => (
              <div
                key={course}
                className="rounded-[26px] border border-slate-200 bg-slate-50 px-5 py-5"
              >
                <p className="font-semibold text-slate-950">{course}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
