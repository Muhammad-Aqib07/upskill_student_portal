"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  certificateId: string;
  initialValue: boolean;
};

export function CertificateApprovalToggle({ certificateId, initialValue }: Props) {
  const [isApproved, setIsApproved] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/certificates/toggle-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsApproved(data.adminApproved);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to toggle approval:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        isApproved ? "bg-emerald-500" : "bg-white/10"
      }`}
      aria-pressed={isApproved}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isApproved ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
