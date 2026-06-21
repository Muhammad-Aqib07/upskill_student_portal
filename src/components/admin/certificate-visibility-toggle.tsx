"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  certificateId: string;
  initialValue: boolean;
  canManagePublicVisibility?: boolean;
  restrictionMessage?: string;
};

export function CertificateVisibilityToggle({
  certificateId,
  initialValue,
  canManagePublicVisibility = true,
  restrictionMessage = "Please contact admin.",
}: Props) {
  const [isPublic, setIsPublic] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleToggle() {
    if (!canManagePublicVisibility) {
      setError(restrictionMessage);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/certificates/toggle-visibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certificateId }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPublic(data.publicVisible);
        router.refresh();
      } else {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Failed to update public visibility.");
      }
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      setError("Failed to update public visibility.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleToggle}
        disabled={isLoading || !canManagePublicVisibility}
        title={!canManagePublicVisibility ? restrictionMessage : undefined}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          isPublic ? "bg-sky-500" : "bg-white/10"
        } ${canManagePublicVisibility ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
        aria-pressed={isPublic}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isPublic ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      {error ? <p className="max-w-48 text-xs text-amber-300">{error}</p> : null}
    </div>
  );
}
