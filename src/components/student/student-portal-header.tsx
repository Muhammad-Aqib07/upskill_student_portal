"use client";

import { useState } from "react";
import { ProfileSideMenu } from "./profile-side-menu";
import { StudentRecord } from "@/lib/sheet-schema";

interface StudentPortalHeaderProps {
  student: StudentRecord;
  userEmail: string;
}

export function StudentPortalHeader({ student, userEmail }: StudentPortalHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use the first profile image if available, otherwise a placeholder
  const profileImage = student.profile_image_1_drive_link || null;

  return (
    <>
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/5 bg-black/40 px-6 backdrop-blur-xl lg:px-10">
        <div className="flex items-center gap-4">
          <div className="brand-badge hidden sm:flex">
            <span className="brand-orb" />
            Upskill Portal
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="group relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/10 bg-white/5 transition-all hover:border-sky-400/50 hover:scale-105 active:scale-95"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={student.full_name}
              className="h-full w-full object-cover"
              onError={(e) => {
                // If Google Drive link fails to load directly, fallback to initial
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.full_name)}&background=0ea5e9&color=fff`;
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600 text-lg font-bold text-white">
              {student.full_name.charAt(0)}
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      </header>

      <ProfileSideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        student={student}
        userEmail={userEmail}
      />
    </>
  );
}
