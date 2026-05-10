"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

type AdminSidePanelProps = {
  adminEmail: string;
  adminName: string;
  adminImageUrl?: string | null;
};

type AdminTopBarProps = AdminSidePanelProps & {
  sectionLabel?: string;
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
    href: "/admin/certificates?tab=create",
    label: "Generate Certificate",
    description: "Open certificate tools and issue new certificates quickly.",
  },
];

export function AdminTopBar({
  adminEmail,
  adminName,
  adminImageUrl,
  sectionLabel = "Admin Workspace",
}: AdminTopBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-black/25 px-5 py-4 backdrop-blur-xl">
      <div className="min-w-0">
        <div className="brand-badge w-fit">
          <span className="brand-orb" />
          {sectionLabel}
        </div>
        <p className="mt-2 truncate text-sm text-[var(--muted)]">
          Open the image icon to view your Gmail and jump between admin sections.
        </p>
      </div>

      <AdminMenuTrigger
        adminEmail={adminEmail}
        adminName={adminName}
        adminImageUrl={adminImageUrl}
      />
    </div>
  );
}

export function AdminMenuTrigger({
  adminEmail,
  adminName,
  adminImageUrl,
}: AdminSidePanelProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasBrokenImage, setHasBrokenImage] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-white/5 transition-all hover:border-sky-400/50 hover:scale-105 active:scale-95"
        aria-label="Open admin side panel"
      >
        {adminImageUrl && !hasBrokenImage ? (
          <img
            src={adminImageUrl}
            alt={adminName}
            className="h-full w-full object-cover"
            onError={() => setHasBrokenImage(true)}
          />
        ) : null}
        <div
          className={`absolute inset-0 items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-700 text-lg font-bold text-white ${
            adminImageUrl && !hasBrokenImage ? "hidden" : "flex"
          }`}
        >
          {adminName.charAt(0).toUpperCase()}
        </div>
        <div className="absolute inset-0 bg-black/15 opacity-0 transition-opacity group-hover:opacity-100" />
      </button>

      <AdminMenuDrawer
        adminEmail={adminEmail}
        adminName={adminName}
        adminImageUrl={adminImageUrl}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}

function AdminMenuDrawer({
  adminEmail,
  adminName,
  adminImageUrl,
  isOpen,
  onClose,
}: AdminSidePanelProps & {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [hasBrokenDrawerImage, setHasBrokenDrawerImage] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <aside className="relative w-full max-w-md border-l border-white/10 bg-[#0a0a0a] shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-white">Admin Menu</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-[var(--muted)] hover:bg-white/5 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/5">
                  {adminImageUrl && !hasBrokenDrawerImage ? (
                    <img
                      src={adminImageUrl}
                      alt={adminName}
                      className="h-full w-full object-cover"
                      onError={() => setHasBrokenDrawerImage(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-cyan-700 text-xl font-bold text-white">
                      {adminName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{adminName}</h3>
                  <p className="mt-1 truncate text-xs text-[var(--muted)]">{adminEmail}</p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-400">
                    Logged In Gmail
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Admin Tabs
              </p>
              <div className="grid gap-2">
                {adminTabs.map((tab) => (
                  <Link key={`${tab.href}-${tab.label}`} href={tab.href} onClick={onClose}>
                    <MenuRow label={tab.label} description={tab.description} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <LogoutButton redirectTo="/admin/login" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function MenuRow({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/[0.08]">
      <p className="text-sm font-medium text-white">{label}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</p>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
