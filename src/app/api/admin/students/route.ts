import { NextResponse } from "next/server";
import { courses } from "@/lib/portal-data";
import {
  UploadValidationError,
  storeProfileImages,
} from "@/lib/profile-image-storage";

export const runtime = "nodejs";

async function resolveProfileImages(formData: FormData, fullName: string) {
  return storeProfileImages({
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
}

function validateStudentForm(formData: FormData) {
  const requiredFields = ["fullName", "fatherName", "email", "selectedCourse"];
  for (const field of requiredFields) {
    if (!String(formData.get(field) ?? "").trim()) {
      return `Missing required field: ${field}`;
    }
  }

  const selectedCourse = String(formData.get("selectedCourse") ?? "").trim();
  if (!courses.includes(selectedCourse)) {
    return "Please select a valid course.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const { createAdminStudent } = await import("@/lib/google-sheets");
    const formData = await request.formData();

    const validationError = validateStudentForm(formData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const fullName = String(formData.get("fullName") ?? "").trim();
    const selectedCourse = String(formData.get("selectedCourse") ?? "").trim();

    const { profileImageOneLink, profileImageTwoLink, warnings } = await resolveProfileImages(
      formData,
      fullName,
    );

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

export async function PUT(request: Request) {
  try {
    const { updateAdminStudent } = await import("@/lib/google-sheets");
    const formData = await request.formData();
    const studentId = String(formData.get("studentId") ?? "").trim();

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const validationError = validateStudentForm(formData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const fullName = String(formData.get("fullName") ?? "").trim();
    const { profileImageOneLink, profileImageTwoLink, warnings } = await resolveProfileImages(
      formData,
      fullName,
    );

    const result = await updateAdminStudent({
      studentId,
      enrollmentId: String(formData.get("enrollmentId") ?? "").trim(),
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
      selectedCourse: String(formData.get("selectedCourse") ?? "").trim(),
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
      warning: warnings.join(" "),
    });
  } catch (error) {
    if (error instanceof UploadValidationError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Admin student update failed.", error);
    return NextResponse.json(
      { error: "Admin student update failed. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { deleteAdminStudent } = await import("@/lib/google-sheets");
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId")?.trim() ?? "";

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    await deleteAdminStudent(studentId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin student delete failed.", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Student delete failed." },
      { status: 500 },
    );
  }
}
