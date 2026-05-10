import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { toggleCertificateVisibility } = await import("@/lib/google-sheets");
    await requireAdminUser();
    const { certificateId } = await request.json();

    if (!certificateId) {
      return NextResponse.json({ error: "Certificate ID is required" }, { status: 400 });
    }

    const newValue = await toggleCertificateVisibility(certificateId);

    if (newValue === null) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, publicVisible: newValue });
  } catch (error) {
    console.error("Toggle visibility error:", error);
    return NextResponse.json({ error: "Failed to toggle visibility" }, { status: 500 });
  }
}
