import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth";
import {
  canManagePublicCertificates,
  getPublicCertificateRestrictionMessage,
} from "@/lib/env";

export async function POST(request: Request) {
  try {
    const { createCertificateRecord } = await import("@/lib/google-sheets");
    const user = await requireAdminUser();
    const formData = await request.formData();

    const studentId = String(formData.get("studentId") ?? "").trim();
    const enrollmentId = String(formData.get("enrollmentId") ?? "").trim();
    
    // Editable detail overrides
    const studentName = String(formData.get("studentName") ?? "").trim();
    const fatherName = String(formData.get("fatherName") ?? "").trim();
    const courseName = String(formData.get("courseName") ?? "").trim();
    const enrollmentStatus = String(formData.get("enrollmentStatus") ?? "").trim();

    if (!studentId || !enrollmentId || !courseName) {
      return NextResponse.json(
        { error: "Student, enrollment, and course are required." },
        { status: 400 },
      );
    }

    const requestedPublicVisibility = formData.get("publicVisible") === "TRUE";
    const canPublishPublicCertificates = canManagePublicCertificates(user.email ?? "");
    if (requestedPublicVisibility && !canPublishPublicCertificates) {
      return NextResponse.json(
        { error: getPublicCertificateRestrictionMessage() },
        { status: 403 },
      );
    }

    const certificate = await createCertificateRecord({
      studentId,
      enrollmentId,
      courseName,
      studentName, // Pass overrides
      fatherName,
      enrollmentStatus,
      issueDate: String(formData.get("issueDate") ?? "").trim(),
      certificateFeeStatus: String(formData.get("certificateFeeStatus") ?? "unpaid").trim(),
      adminApproved: formData.get("adminApproved") === "TRUE",
      publicVisible: requestedPublicVisibility && canPublishPublicCertificates,
      createdBy: "admin-panel",
    });

    return NextResponse.json({
      success: true,
      certificateId: certificate.certificate_id,
      certificateCode: certificate.certificate_code,
      printUrl: `/verify/${certificate.certificate_id}/print`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Certificate generation failed.",
      },
      { status: 500 },
    );
  }
}
