import { requireStudentUser } from "@/lib/auth";
import { getStudentDashboardData } from "@/lib/google-sheets";
import { StudentPortalHeader } from "@/components/student/student-portal-header";
import { redirect } from "next/navigation";

export default async function StudentCertificatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireStudentUser();
  const data = await getStudentDashboardData({
    authUserId: user.id,
    email: user.email,
  });

  if (!data.student) {
    redirect("/student/register");
  }

  return (
    <div className="min-h-screen bg-black">
      <StudentPortalHeader student={data.student} userEmail={user.email ?? ""} />
      {children}
    </div>
  );
}
