type EnvRequirement = {
  name: string;
  description: string;
};

export const requiredEnvKeys: EnvRequirement[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    description: "Supabase project URL for client-side authentication.",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    description: "Supabase anonymous key used by the Next.js frontend.",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    description:
      "Server-side Supabase key for secure admin operations and Storage uploads.",
  },
  {
    name: "SUPABASE_PROFILE_IMAGES_BUCKET",
    description:
      "Public Supabase Storage bucket name for student profile images. Free plan works fine.",
  },
  {
    name: "ADMIN_ALLOWED_EMAILS",
    description:
      "Comma-separated list of the only two Gmail addresses that can access the admin panel.",
  },
  {
    name: "GOOGLE_PROJECT_ID",
    description: "Google Cloud project ID used for Sheets and Drive APIs.",
  },
  {
    name: "GOOGLE_CLIENT_EMAIL",
    description: "Service account client email from your Google Cloud credentials.",
  },
  {
    name: "GOOGLE_PRIVATE_KEY",
    description: "Service account private key with escaped new lines.",
  },
  {
    name: "GOOGLE_SHEET_ID",
    description: "The main spreadsheet ID for Students, Enrollments, Certificates, Payments, and Courses tabs.",
  },
  {
    name: "GOOGLE_DRIVE_PARENT_FOLDER_ID",
    description:
      "Optional future Google Drive folder for certificate files. Student profile images now use Supabase Storage.",
  },
];

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string) {
  return getAllowedAdminEmails().includes(email.trim().toLowerCase());
}

export function isAuthBypassed() {
  return false;
}
