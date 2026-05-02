"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { StudentRecord } from "@/lib/sheet-schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface ProfileSideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRecord;
  userEmail: string;
}

export function ProfileSideMenu({ isOpen, onClose, student, userEmail }: ProfileSideMenuProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: student.full_name,
    fatherName: student.father_name,
    phone: student.phone,
    address: student.address,
    city: student.city,
    education: student.education,
  });

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/students/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student.student_id,
            updates: formData,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to update profile");
        }

        // Also update Supabase metadata if name changed
        if (formData.fullName !== student.full_name) {
          const supabase = createSupabaseBrowserClient();
          await supabase.auth.updateUser({
            data: { full_name: formData.fullName }
          });
        }

        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        
        // Refresh the page to show new data
        window.location.reload();
      } catch (err: any) {
        setError(err.message);
      }
    });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-md border-l border-white/10 bg-[#0a0a0a] shadow-2xl transition-transform duration-300">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <h2 className="text-xl font-semibold tracking-tight text-white">Student Menu</h2>
            <button 
              onClick={onClose}
              className="rounded-full p-2 text-[var(--muted)] hover:bg-white/5 hover:text-white"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* Profile Brief */}
            <div className="mb-8 flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="h-16 w-16 overflow-hidden rounded-full border border-white/20 bg-white/5">
                {student.profile_image_1_drive_link ? (
                  <img 
                    src={student.profile_image_1_drive_link} 
                    alt={student.full_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-sky-500 text-xl font-bold">
                    {student.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{student.full_name}</h3>
                <p className="text-xs text-[var(--muted)]">{student.registration_no}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-sky-400 font-bold">Active Student</p>
              </div>
            </div>

            {/* Menu Sections */}
            <nav className="space-y-6">
              {/* Profile Management Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Information</p>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="grid gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
                    {error && <p className="text-xs text-rose-400">{error}</p>}
                    <div className="grid gap-3">
                      <EditField 
                        label="Full Name" 
                        value={formData.fullName} 
                        onChange={(v) => setFormData({...formData, fullName: v})}
                      />
                      <EditField 
                        label="Father Name" 
                        value={formData.fatherName} 
                        onChange={(v) => setFormData({...formData, fatherName: v})}
                      />
                      <EditField 
                        label="Phone" 
                        value={formData.phone} 
                        onChange={(v) => setFormData({...formData, phone: v})}
                      />
                      <EditField 
                        label="City" 
                        value={formData.city} 
                        onChange={(v) => setFormData({...formData, city: v})}
                      />
                      <EditField 
                        label="Education" 
                        value={formData.education} 
                        onChange={(v) => setFormData({...formData, education: v})}
                      />
                      <EditField 
                        label="Address" 
                        value={formData.address} 
                        onChange={(v) => setFormData({...formData, address: v})}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className="mt-2 w-full rounded-xl bg-sky-500 py-2.5 text-sm font-bold text-white hover:bg-sky-400 disabled:opacity-50"
                    >
                      {isPending ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </form>
                ) : (
                  <div className="grid gap-2">
                    <InfoRow icon={<UserIcon />} label="My Profile" active>
                      <div className="mt-3 grid gap-3 text-xs">
                        <StaticInfo label="Father Name" value={student.father_name} />
                        <StaticInfo label="Phone" value={student.phone} />
                        <StaticInfo label="Education" value={student.education} />
                        <StaticInfo label="City" value={student.city} />
                        <StaticInfo label="Email" value={userEmail} />
                      </div>
                    </InfoRow>
                  </div>
                )}
              </div>

              {/* Navigation Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Portal Access</p>
                <div className="grid gap-2">
                  <Link href="/student/certificates" onClick={onClose}>
                    <InfoRow icon={<CertIcon />} label="My Certificates & Letters" />
                  </Link>
                  <Link href="/verify" onClick={onClose}>
                    <InfoRow icon={<ShieldIcon />} label="Public Verification" />
                  </Link>
                </div>
              </div>

              {/* Logout */}
              <div className="pt-4">
                <LogoutButton redirectTo="/student/login" />
              </div>
            </nav>
          </div>
        </div>
      </aside>
    </div>
  );
}

function InfoRow({ icon, label, children, active = false }: { icon: React.ReactNode, label: string, children?: React.ReactNode, active?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors ${active ? 'bg-white/[0.08]' : 'hover:bg-white/[0.08]'}`}>
      <div className="flex items-center gap-3">
        <div className="text-sky-400">{icon}</div>
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
      {children}
    </div>
  );
}

function StaticInfo({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-1">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}

function EditField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:border-sky-500/50 focus:outline-none"
      />
    </div>
  );
}

// Icons
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M10 9H8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
