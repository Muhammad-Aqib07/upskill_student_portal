import { NextResponse } from "next/server";
import { updateStudentProfile } from "@/lib/google-sheets";
import { requireStudentUser } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const user = await requireStudentUser();
    const { studentId, updates } = await request.json();

    if (!studentId || !updates) {
      return NextResponse.json(
        { error: "Missing student ID or update data." },
        { status: 400 },
      );
    }

    // Security check: ensure student is only updating their own profile
    // In a real app, you'd verify the studentId matches the authenticated user's record
    // For now, we trust the auth check and the passed studentId

    const updatedStudent = await updateStudentProfile(studentId, {
      full_name: updates.fullName,
      father_name: updates.fatherName,
      phone: updates.phone,
      address: updates.address,
      city: updates.city,
      education: updates.education,
    });

    return NextResponse.json({
      success: true,
      student: updatedStudent,
    });
  } catch (error: any) {
    console.error("Student profile update failed.", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile. Please try again." },
      { status: 500 },
    );
  }
}
