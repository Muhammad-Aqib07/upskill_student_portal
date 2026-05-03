type StudentRegistrationField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  fullWidth?: boolean;
  options?: string[];
};

export const courses = [
  "Trading",
  "Web Development",
  "Frontend Web Development",
  "Graphic Designing",
  "AI Prompt Engineering",
  "YouTube Automation",
  "Ecommerce",
  "Digital Marketing",
  "Office Management",
  "Python Programming",
];

export const studentFeatures = [
  "Self registration with institute-style admission form",
  "Email/password and Google login through Supabase",
  "One dashboard listing all enrolled courses",
  "Fee and certificate status tracking",
  "Public certificate verification after admin approval and paid certification fee",
];

export const adminFeatures = [
  "Only two approved Gmail accounts can access the admin panel",
  "Admin can add new, old, or completed students directly into the database",
  "Manage enrollments, paid or unpaid fee status, and course completion",
  "Generate fresh or manual certificates from the administration section",
  "Publish certificates to public verification only after approval and fee payment",
];

export const dashboardStats = [
  { label: "Total students", value: "248" },
  { label: "Total enrollments", value: "391" },
  { label: "Completed courses", value: "176" },
  { label: "Pending certificates", value: "29" },
  { label: "Issued certificates", value: "147" },
  { label: "Paid certification fees", value: "PKR 612,000" },
];

export const studentRegistrationFields: StudentRegistrationField[] = [
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter full name",
  },
  {
    name: "fatherName",
    label: "Father Name",
    type: "text",
    placeholder: "Enter father name",
  },
  {
    name: "cnicBForm",
    label: "CNIC / B-Form",
    type: "text",
    placeholder: "35202-1234567-8",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "+92 300 1234567",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "student@example.com",
  },
  {
    name: "address",
    label: "Address",
    type: "text",
    fullWidth: true,
    placeholder: "House no, street, area",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "Karachi",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  {
    name: "education",
    label: "Education",
    type: "text",
    placeholder: "Intermediate / Graduate",
  },
  {
    name: "selectedCourse",
    label: "Selected Course",
    type: "select",
  },
  {
    name: "profileImageOne",
    label: "Profile Image 1",
    type: "file",
  },
  {
    name: "profileImageTwo",
    label: "Profile Image 2 (Optional)",
    type: "file",
  },
];

export const sampleEnrollments = [
  {
    course: "Web Development",
    feeStatus: "Paid",
    progress: "Completed",
    certificateStatus: "Issued",
  },
  {
    course: "Digital Marketing",
    feeStatus: "Paid",
    progress: "In Progress",
    certificateStatus: "Pending approval",
  },
  {
    course: "Office Management",
    feeStatus: "Unpaid",
    progress: "Not started",
    certificateStatus: "Locked",
  },
];

export const googleTabs = [
  "Students",
  "Enrollments",
  "Certificates",
  "Payments",
  "Courses",
];

export const recentCertificates = [
  {
    studentName: "Areeba Khan",
    course: "Graphic Designing",
    certificateId: "TUL/GD/2026/0042",
    status: "Approved",
  },
  {
    studentName: "Usman Tariq",
    course: "Web Development",
    certificateId: "TUL/WD/2026/0043",
    status: "Printed",
  },
  {
    studentName: "Maham Ali",
    course: "Office Management",
    certificateId: "TUL/OM/2026/0044",
    status: "Fee pending",
  },
];
