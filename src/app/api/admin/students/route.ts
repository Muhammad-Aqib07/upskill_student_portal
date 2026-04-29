import { NextResponse } from "next/server";
import { createAdminStudent } from "@/lib/google-sheets";
import { courses } from "@/lib/portal-data";
import {
  UploadValidationError,
  storeProfileImages,
} from "@/lib/profile-image-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const requiredFields = ["fullName", "fatherName", "email", "selectedCourse"];
    for (const field of requiredFields) {
      if (!String(formData.get(field) ?? "").trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    const fullName = String(formData.get("fullName") ?? "").trim();
    const selectedCourse = String(formData.get("selectedCourse") ?? "").trim();

    if (!courses.includes(selectedCourse)) {
      return NextResponse.json(
        { error: "Please select a valid course." },
        { status: 400 },
      );
    }

    const { profileImageOneLink, profileImageTwoLink, warnings } =
      await storeProfileImages({
        fullName,
        profileImageOneFile:
          formData.get("profileImageOne") instanceof File
            ? (formData.get("profileImageOne") as File)
            : null,
        profileImageTwoFile:
          formData.get("profileImageTwo") instanceof File
            ? (formData.get("profileImageTwo") as File)
            : null,
        profileImageOneLink: String(formData.get("profileImageOneLink") ?? "").trim(),
        profileImageTwoLink: String(formData.get("profileImageTwoLink") ?? "").trim(),
      });

    const result = await createAdminStudent({
      fullName,
      fatherName: String(formData.get("fatherName") ?? "").trim(),
      cnicBForm: String(formData.get("cnicBForm") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      gender: String(formData.get("gender") ?? "").trim(),
      dateOfBirth: String(formData.get("dateOfBirth") ?? "").trim(),
      education: String(formData.get("education") ?? "").trim(),
      selectedCourse,
      enrollmentStatus: String(formData.get("enrollmentStatus") ?? "active").trim(),
      feeStatus: String(formData.get("feeStatus") ?? "unpaid").trim(),
      courseCompleted: String(formData.get("courseCompleted") ?? "FALSE").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
      profileImageOneLink,
      profileImageTwoLink,
    });

    return NextResponse.json({
      success: true,
      registrationNo: result.registrationNo,
      enrollmentId: result.enrollmentId,
      warning: warnings.join(" "),
    });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Admin student save failed.", error);
    return NextResponse.json(
      { error: "Admin student save failed. Please try again." },
      { status: 500 },
    );
  }
}
