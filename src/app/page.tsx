import Link from "next/link";
import { courses } from "@/lib/portal-data";

const highlights = [
  {
    value: "08",
    label: "Professional programs",
  },
  {
    value: "Live",
    label: "Authentication-enabled portal",
  },
  {
    value: "Verified",
    label: "Controlled public certificate checks",
  },
];

const differentiators = [
  {
    title: "Institute-grade admissions",
    description:
      "A structured online registration workflow designed for proper student intake, organized records, and consistent data capture.",
  },
  {
    title: "Professional student portal",
    description:
      "Students access a dedicated portal for admissions follow-up, enrollment visibility, and certificate readiness.",
  },
  {
    title: "Responsible verification",
    description:
      "Certificate records are presented through a controlled verification process that requires matching identity details.",
  },
];

const operationalStandards = [
  "Structured registration and identity capture",
  "Digital record management for enrollments",
  "Restricted administration workflow",
  "Identity-based certificate verification",
];

const institutePoints = [
  {
    title: "Professional positioning",
    text: "The website now presents the institute as a serious education brand rather than a temporary training portal.",
  },
  {
    title: "Clear student journey",
    text: "Prospective students can move from application to authenticated access through a more polished and credible flow.",
  },
  {
    title: "Higher trust presentation",
    text: "The platform emphasizes process, verification, and record discipline to create stronger institutional confidence.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f4f7fb] text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,_#f8fbff_0%,_#edf3f9_100%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(15,92,214,0.09),_transparent_28%),radial-gradient(circle_at_85%_15%,_rgba(42,132,255,0.10),_transparent_22%)]" />
        <div className="absolute left-[8%] top-24 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl animate-float-slow" />
        <div className="absolute right-[6%] top-12 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl animate-float-delayed" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10">
          <header className="rounded-full border border-white/80 bg-white/88 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0f4fa8_0%,_#1f88ff_100%)] text-lg font-bold text-white shadow-[0_14px_28px_rgba(15,92,214,0.22)]">
                  TU
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold text-slate-950">
                    Tech Upskill Learn
                  </p>
                  <p className="text-xs uppercase tracking-[0.32em] text-sky-700">
                    Professional Skills Institute
                  </p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700">
                <a href="#overview" className="rounded-full px-4 py-2 hover:bg-slate-100">
                  Overview
                </a>
                <a href="#programs" className="rounded-full px-4 py-2 hover:bg-slate-100">
                  Programs
                </a>
                <a href="#standards" className="rounded-full px-4 py-2 hover:bg-slate-100">
                  Standards
                </a>
                <Link href="/about" className="rounded-full px-4 py-2 hover:bg-slate-100">
                  About
                </Link>
              </nav>
            </div>
          </header>

          <div className="grid gap-10 py-12 lg:grid-cols-[1.08fr_0.92fr] lg:py-18">
            <section className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-3 rounded-full border border-sky-100 bg-white/90 px-4 py-2 text-sm font-semibold text-sky-800 shadow-[0_12px_28px_rgba(15,92,214,0.08)]">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500 animate-pulse-soft" />
                Institute-ready digital admissions and verification platform
              </div>

              <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 md:text-7xl">
                A more professional institute experience for students,
                admissions, and verified certification.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Tech Upskill Learn is presented through a refined public-facing
                website with stronger visual credibility, clearer structure, and
                a more trustworthy student journey.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="primary-button" href="/student/register">
                  Apply for Admission
                </Link>
                <Link className="secondary-button" href="/student/login">
                  Student Portal
                </Link>
                <Link className="secondary-button" href="/verify">
                  Verify Certificate
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[28px] border border-white/80 bg-white/90 px-5 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)] backdrop-blur"
                  >
                    <p className="text-3xl font-semibold tracking-tight text-slate-950">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative">
              <div className="grid gap-5">
                <div className="rounded-[36px] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_28px_70px_rgba(2,6,23,0.26)] animate-float-card">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-sky-200">
                        Institute Snapshot
                      </p>
                      <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                        Designed for stronger trust, clearer structure, and
                        institutional presentation.
                      </h2>
                    </div>
                    <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.22em] text-sky-100">
                        Standard
                      </p>
                      <p className="mt-1 text-2xl font-semibold">Professional</p>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4">
                    {operationalStandards.map((item) => (
                      <div
                        key={item}
                        className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4 transition duration-300 hover:translate-x-1"
                      >
                        <p className="text-sm font-medium text-slate-100">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {differentiators.map((item, index) => (
                    <article
                      key={item.title}
                      className={`rounded-[30px] border border-slate-200 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] ${
                        index === 0
                          ? "bg-white"
                          : "bg-[linear-gradient(180deg,_#ffffff_0%,_#f3f7fd_100%)]"
                      }`}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                        Core Strength
                      </p>
                      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="overview" className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[34px] bg-[linear-gradient(135deg,_#0c4a9b_0%,_#146ed8_55%,_#48a8ff_100%)] p-8 text-white shadow-[0_24px_65px_rgba(15,92,214,0.22)] lg:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-100">
              Institute Overview
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight">
              A polished academic-style presence for a modern digital institute.
            </h2>
            <p className="mt-5 text-base leading-8 text-sky-50/95">
              The interface is intentionally rebuilt to feel more structured,
              more premium, and more believable for an institute handling
              admissions, student access, and certificate verification.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {institutePoints.map((item) => (
              <article
                key={item.title}
                className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-[0_16px_38px_rgba(15,23,42,0.05)]"
              >
                <h3 className="text-xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="rounded-[38px] border border-slate-200 bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.05)] lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                Programs
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                Professional learning tracks aligned with practical digital
                careers.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Programs are presented in a cleaner, more disciplined way so
                the institute feels serious, modern, and admission-ready.
              </p>
            </div>

            <Link className="secondary-button w-fit" href="/student/register">
              Start Application
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map((course, index) => (
              <article
                key={course}
                className="group rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f6f9fd_100%)] p-6 shadow-[0_14px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_40px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
                    Program
                  </span>
                  <span className="text-sm font-semibold text-slate-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-semibold tracking-tight text-slate-950">
                  {course}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Structured student intake, organized records, and a more
                  professional institute presentation from enrollment onward.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="standards" className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.05)] lg:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Standards
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
              Professional presentation backed by controlled workflows.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              The public site now focuses on student confidence and institute
              credibility while keeping the administration workflow private and
              direct-access only.
            </p>

            <div className="mt-8 grid gap-3">
              {operationalStandards.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] bg-slate-950 p-8 text-white shadow-[0_24px_65px_rgba(2,6,23,0.28)] lg:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-sky-200">
              Verification Experience
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Records are verified through stronger identity matching.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              Public verification now asks for certificate or registration
              details together with matching student identity information. This
              gives the institute a more responsible and professional record
              release model.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button" href="/verify">
                Open Verification
              </Link>
              <Link
                className="secondary-button border-white/10 bg-white/5 text-white"
                href="/about"
              >
                Read About The Institute
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pb-20">
        <div className="rounded-[36px] border border-slate-200 bg-white px-8 py-10 shadow-[0_20px_55px_rgba(15,23,42,0.05)] lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                Admissions
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                Begin with a cleaner, more professional admission experience.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                The landing page now supports a stronger first impression for
                students while maintaining a credible institutional tone.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link className="primary-button" href="/student/register">
                Apply Now
              </Link>
              <Link className="secondary-button" href="/student/login">
                Student Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
