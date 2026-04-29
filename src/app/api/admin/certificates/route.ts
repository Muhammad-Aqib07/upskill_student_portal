import { NextResponse } from "next/server";
import { createCertificateRecord } from "@/lib/google-sheets";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const studentId = String(formData.get("studentId") ?? "").trim();
    const enrollmentId = String(formData.get("enrollmentId") ?? "").trim();
    const courseName = String(formData.get("courseName") ?? "").trim();

    if (!studentId || !enrollmentId || !courseName) {
      return NextResponse.json(
        { error: "Student, enrollment, and course are required." },
        { status: 400 },
      );
    }

    const certificate = await createCertificateRecord({
      studentId,
      enrollmentId,
      courseName,
      issueDate: String(formData.get("issueDate") ?? "").trim(),
      certificateFeeStatus: String(formData.get("certificateFeeStatus") ?? "unpaid").trim(),
      adminApproved: String(formData.get("adminApproved") ?? "FALSE").trim() === "TRUE",
      publicVisible: String(formData.get("publicVisible") ?? "FALSE").trim() === "TRUE",
      createdBy: "admin-panel",
    });

    return NextResponse.json({
      success: true,
      certificateId: certificate.certificate_id,
      certificateCode: certificate.certificate_code,
      printUrl: `/admin/certificates/${certificate.certificate_id}`,
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
