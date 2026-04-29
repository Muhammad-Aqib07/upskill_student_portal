export const SHEET_TABS = {
  students: "Students",
  enrollments: "Enrollments",
  certificates: "Certificates",
  payments: "Payments",
  courses: "Courses",
} as const;

export const STUDENT_HEADERS = [
  "student_id",
  "auth_user_id",
  "registration_no",
  "full_name",
  "father_name",
  "cnic_bform",
  "phone",
  "email",
  "address",
  "city",
  "gender",
  "date_of_birth",
  "education",
  "profile_image_1_drive_link",
  "profile_image_2_drive_link",
  "created_at",
  "created_by",
] as const;

export const ENROLLMENT_HEADERS = [
  "enrollment_id",
  "student_id",
  "course_id",
  "course_name",
  "enrollment_date",
  "status",
  "fee_status",
  "course_completed",
  "notes",
] as const;

export const CERTIFICATE_HEADERS = [
  "certificate_id",
  "student_id",
  "enrollment_id",
  "certificate_code",
  "course_name",
  "issue_date",
  "certificate_fee_status",
  "admin_approved",
  "public_visible",
  "qr_value",
  "pdf_drive_link",
  "print_count",
  "created_by",
] as const;

export const PAYMENT_HEADERS = [
  "payment_id",
  "student_id",
  "enrollment_id",
  "payment_type",
  "amount",
  "status",
  "payment_date",
  "notes",
] as const;

export const COURSE_HEADERS = [
  "course_id",
  "course_name",
  "course_fee",
  "certificate_fee",
  "active",
] as const;

export type StudentRecord = Record<(typeof STUDENT_HEADERS)[number], string>;
export type EnrollmentRecord = Record<(typeof ENROLLMENT_HEADERS)[number], string>;
export type CertificateRecord = Record<(typeof CERTIFICATE_HEADERS)[number], string>;
export type PaymentRecord = Record<(typeof PAYMENT_HEADERS)[number], string>;
export type CourseRecord = Record<(typeof COURSE_HEADERS)[number], string>;
