"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminStudentActions({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this student and all related enrollments, certificates, and payments?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    const response = await fetch(`/api/admin/students?studentId=${studentId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { error?: string };

    setIsDeleting(false);

    if (!response.ok) {
      setError(result.error ?? "Student could not be deleted.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3">
        <Link
          className="font-semibold text-sky-300"
          href={`/admin/students?tab=edit&studentId=${studentId}`}
        >
          Edit
        </Link>
        <button
          className="text-left font-semibold text-rose-300"
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
