"use client";

import Link from "next/link";
import { AdminMenuTrigger } from "@/components/admin/admin-side-panel";

type AdminDashboardShellProps = {
  adminEmail: string;
  adminName: string;
  adminImageUrl?: string | null;
};

const adminTabs = [
  {
    href: "/admin/students?tab=new",
    label: "Add New Student",
    description: "Create a manual student record from the admin panel.",
  },
  {
    href: "/admin/certificates",
    label: "All Certified Students",
    description: "Review certificate records and issued student credentials.",
  },
  {
    href: "/admin/students?tab=directory",
    label: "Registered Students",
    description: "Browse, edit, and manage all registered student records.",
  },
  {
    href: "/admin/certificates",
    label: "Generate Certificate",
    description: "Open certificate tools and issue new certificates quickly.",
  },
];

export function AdminDashboardShell({
  adminEmail,
  adminName,
  adminImageUrl,
}: AdminDashboardShellProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-6">
        <div className="max-w-4xl">
          <div className="brand-badge w-fit">
            <span className="brand-orb" />
            Admin dashboard
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] lg:text-5xl">
            Manage admissions, certificates, and student records from one place.
          </h1>
          <p className="section-copy mt-4 max-w-3xl text-base">
            Open the admin menu from the profile image on the right to view your
            signed-in Gmail and jump across all main admin tabs.
          </p>
        </div>

        <AdminMenuTrigger
          adminEmail={adminEmail}
          adminName={adminName}
          adminImageUrl={adminImageUrl}
        />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminTabs.map((tab) => (
          <Link
            key={tab.href + tab.label}
            href={tab.href}
            className="rounded-[26px] border border-white/10 bg-white/6 p-5 transition-transform transition-colors hover:-translate-y-0.5 hover:border-sky-300/30 hover:bg-white/10"
          >
            <p className="text-sm font-semibold text-white">{tab.label}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {tab.description}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
