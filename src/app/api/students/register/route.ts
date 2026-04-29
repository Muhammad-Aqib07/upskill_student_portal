import { NextResponse } from "next/server";
import { createStudentRegistration } from "@/lib/google-sheets";
import { courses } from "@/lib/portal-data";
import {
  UploadValidationError,
  storeProfileImages,
} from "@/lib/profile-image-storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const authUserId = String(formData.get("authUserId") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const fullName = String(formData.get("fullName") ?? "").trim();
    const selectedCourse = String(formData.get("selectedCourse") ?? "").trim();

    if (!authUserId || !email || !fullName || !selectedCourse) {
      return NextResponse.json(
        { error: "Missing required student registration data or authenticated user." },
        { status: 400 },
      );
    }

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
        requirePrimaryImage: true,
      });

    const student = await createStudentRegistration({
      authUserId,
      fullName,
      fatherName: String(formData.get("fatherName") ?? "").trim(),
      cnicBForm: String(formData.get("cnicBForm") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email,
      address: String(formData.get("address") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      gender: String(formData.get("gender") ?? "").trim(),
      dateOfBirth: String(formData.get("dateOfBirth") ?? "").trim(),
      education: String(formData.get("education") ?? "").trim(),
      selectedCourse,
      profileImageOneLink,
      profileImageTwoLink,
    });

    return NextResponse.json({
      success: true,
      student,
      warning: warnings.join(" "),
    });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Student registration failed.", error);
    return NextResponse.json(
      { error: "Student registration failed. Please try again." },
      { status: 500 },
    );
  }
}
