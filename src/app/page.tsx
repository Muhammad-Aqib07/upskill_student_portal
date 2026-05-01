import Link from "next/link";
import { INSTITUTE_NAME } from "@/lib/constants";
import { courses } from "@/lib/portal-data";

const highlights = [
  { value: "08", label: "Career tracks built for practical income skills" },
  { value: "24/7", label: "Digital access across admission, login, and verification" },
  { value: "Verified", label: "Controlled certificate lookup with identity matching" },
];

const differentiators = [
  {
    title: "Prestige-first brand presence",
    description:
      "A sharper, more premium public experience that makes the institute feel established, trustworthy, and growth-focused.",
  },
  {
    title: "Clear conversion journey",
    description:
      "Prospects can move from discovery to application to portal access through a cleaner, faster path with stronger call-to-action hierarchy.",
  },
  {
    title: "Operational credibility",
    description:
      "Admissions, dashboards, and verification now read like one connected product rather than disconnected pages.",
  },
];

const trustPoints = [
  "Structured online registration and protected access",
  "Admin-managed records and certificate approvals",
  "Student dashboards tied to real enrollment progress",
  "Mobile-first presentation for mixed public audiences",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden text-[var(--foreground)]">
      <section className="relative isolate border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(61,161,255,0.24),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(57,94,255,0.22),transparent_22%),linear-gradient(180deg,rgba(5,12,23,0.18),rgba(5,12,23,0.05))]" />
        <div className="absolute left-[7%] top-24 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl animate-float-slow" />
        <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl animate-float-delayed" />

        <div className="relative mx-auto max-w-7xl px-6 py-6 lg:px-10 lg:py-8">
          <header className="glass-card rounded-full px-4 py-4 md:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[linear-gradient(145deg,#0f4fc1_0%,#34a0ff_100%)] shadow-[0_18px_40px_rgba(25,100,255,0.35)]">
                  <div className="absolute left-1 top-3 h-8 w-8 rounded-full border-l-4 border-t-4 border-white/85" />
                  <div className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-white/90" />
                  <span className="relative text-sm font-black tracking-[0.24em] text-white">
                    TU
                  </span>
                </div>
                <div>
                  <p className="font-display text-2xl font-semibold tracking-tight">
                    Upskill Tech
                  </p>
                  <p className="text-xs uppercase tracking-[0.34em] text-sky-200">
                    Learn | Earn | Grow
                  </p>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--muted)]">
                <a
                  className="rounded-full px-4 py-2 transition hover:bg-white/8 hover:text-white"
                  href="#overview"
                >
                  Overview
                </a>
                <a
                  className="rounded-full px-4 py-2 transition hover:bg-white/8 hover:text-white"
                  href="#programs"
                >
                  Programs
                </a>
                <a
                  className="rounded-full px-4 py-2 transition hover:bg-white/8 hover:text-white"
                  href="#experience"
                >
                  Experience
                </a>
                <Link
                  className="rounded-full px-4 py-2 transition hover:bg-white/8 hover:text-white"
                  href="/about"
                >
                  About
                </Link>
              </nav>
            </div>
          </header>

          <div className="hero-grid py-12 lg:py-20">
            <section className="flex flex-col justify-center">
              <div className="brand-badge w-fit">
                <span className="brand-orb animate-pulse-soft" />
                Bold training platform for modern learners
              </div>

              <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] md:text-7xl">
                A premium digital experience for admissions, learning access,
                and trusted certification.
              </h1>

              <p className="section-copy mt-6 max-w-2xl text-lg md:text-xl">
                {INSTITUTE_NAME} now presents itself as a more serious,
                career-focused institute brand with stronger credibility,
                cleaner journeys, and better production readiness.
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
                  <article key={item.label} className="stat-tile">
                    <p className="text-3xl font-semibold tracking-tight">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {item.label}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="grid gap-5">
              <div className="premium-card animate-float-card rounded-[36px] p-8 text-white">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="section-kicker">Experience Layer</p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                      Designed to look premium, move faster, and feel more
                      trustworthy on first impression.
                    </h2>
                  </div>
                  <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.24em] text-sky-100">
                      Positioning
                    </p>
                    <p className="mt-1 text-2xl font-semibold">Luxury Startup</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  {trustPoints.map((point) => (
                    <div
                      key={point}
                      className="rounded-[24px] border border-white/10 bg-white/6 px-5 py-4 text-sm text-slate-100 transition hover:translate-x-1"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {differentiators.map((item, index) => (
                  <article
                    key={item.title}
                    className={`rounded-[30px] border p-6 shadow-[0_20px_60px_rgba(2,10,30,0.18)] ${
                      index === 1
                        ? "border-sky-300/20 bg-[linear-gradient(180deg,rgba(36,60,110,0.92),rgba(10,24,46,0.92))] text-white"
                        : "border-white/10 bg-white/8 text-[var(--foreground)] backdrop-blur"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-200">
                      Core Upgrade
                    </p>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section id="overview" className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="premium-card rounded-[34px] p-8 lg:p-10">
            <p className="section-kicker">Institute Overview</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight">
              Premium aesthetics paired with a practical admissions workflow.
            </h2>
            <p className="section-copy mt-5 text-base">
              The new UI direction uses stronger contrast, glass surfaces,
              cleaner spacing, and bolder hierarchy so the brand feels modern
              without changing how the system works underneath.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              "Professional public image",
              "Higher trust and conversion clarity",
              "Mobile-first experience for mixed audiences",
            ].map((item) => (
              <article key={item} className="glass-card rounded-[30px] p-7">
                <span className="status-pill">Modernized</span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">{item}</h3>
                <p className="section-copy mt-4 text-sm">
                  Built to make students, guardians, employers, and internal
                  teams feel like they are using a more polished platform.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programs" className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="glass-card rounded-[38px] p-8 lg:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="section-kicker">Programs</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                Job-aligned learning tracks with a sharper premium storefront.
              </h2>
              <p className="section-copy mt-4 text-base">
                The catalog now reads with more confidence, stronger card
                hierarchy, and a clearer path to application.
              </p>
            </div>

            <Link className="primary-button w-fit" href="/student/register">
              Start Application
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {courses.map((course, index) => (
              <article
                key={course}
                className="group rounded-[28px] border border-white/10 bg-white/6 p-6 shadow-[0_16px_38px_rgba(2,10,30,0.2)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:border-sky-300/30"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">
                    Program
                  </span>
                  <span className="text-sm font-semibold text-[var(--muted)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-7 text-2xl font-semibold tracking-tight">{course}</h3>
                <p className="section-copy mt-3 text-sm">
                  Clear student intake, cleaner progress visibility, and a
                  stronger brand feel from the first click.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl px-6 py-10 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card rounded-[34px] p-8 lg:p-10">
            <p className="section-kicker">Why It Feels Better</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Faster-scanning layouts, cleaner navigation, and more polished
              interaction surfaces.
            </h2>
            <div className="mt-8 grid gap-3">
              {[
                "Bolder hero presentation",
                "Cleaner CTA hierarchy",
                "Premium dark-mode compatible surfaces",
                "Sharper cards, forms, and content spacing",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-[var(--muted)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="premium-card rounded-[34px] p-8 lg:p-10">
            <p className="section-kicker">Verification & Trust</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">
              Public credibility backed by controlled student record release.
            </h2>
            <p className="section-copy mt-4 text-base">
              Certificate lookup remains identity-gated, but now sits inside a
              more premium, professional frame that better matches the institute
              you want to project.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button" href="/verify">
                Open Verification
              </Link>
              <Link className="secondary-button" href="/student/login">
                Enter Student Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10 lg:pb-20">
        <div className="glass-card rounded-[36px] px-8 py-10 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-center">
            <div>
              <p className="section-kicker">Admissions</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                Start with a more premium first impression and a cleaner signup
                path.
              </h2>
              <p className="section-copy mt-4 max-w-2xl text-base">
                The redesign focuses on visual confidence, easier navigation,
                better mobile behavior, and stronger trust signals across the
                entire student journey.
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
