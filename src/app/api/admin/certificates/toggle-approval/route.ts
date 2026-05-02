import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth";
import { toggleCertificateApproval } from "@/lib/google-sheets";

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const { certificateId } = await request.json();

    if (!certificateId) {
      return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
    }

    const newValue = await toggleCertificateApproval(certificateId);

    if (newValue === null) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, adminApproved: newValue });
  } catch (error) {
    console.error("Toggle approval error:", error);
    return NextResponse.json({ error: "Failed to toggle approval" }, { status: 500 });
  }
}
