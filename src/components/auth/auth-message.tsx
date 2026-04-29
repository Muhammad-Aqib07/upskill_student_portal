const MESSAGE_MAP: Record<string, string> = {
  "student-auth-required": "Please log in to open the student dashboard.",
  "admin-auth-required": "Please log in with an approved admin account.",
  "admin-not-allowed":
    "This account is signed in, but it is not one of the two allowed admin Gmail addresses.",
  "oauth-callback-failed":
    "Google login could not be completed. Please try again.",
  "admin-google-restricted":
    "Google login succeeded, but this Gmail address is not approved for admin access.",
};

export function AuthMessage({ error }: { error?: string }) {
  if (!error || !MESSAGE_MAP[error]) {
    return null;
  }

  return (
    <div className="mb-6 rounded-[22px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
      {MESSAGE_MAP[error]}
    </div>
  );
}
