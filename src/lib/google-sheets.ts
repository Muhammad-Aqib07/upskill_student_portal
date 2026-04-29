import { randomUUID } from "node:crypto";
import { getGoogleSheetsClient } from "@/lib/google";
import {
  CERTIFICATE_HEADERS,
  COURSE_HEADERS,
  ENROLLMENT_HEADERS,
  PAYMENT_HEADERS,
  SHEET_TABS,
  STUDENT_HEADERS,
  type CertificateRecord,
  type EnrollmentRecord,
  type StudentRecord,
} from "@/lib/sheet-schema";
import { courses } from "@/lib/portal-data";

type TabName = (typeof SHEET_TABS)[keyof typeof SHEET_TABS];
type SheetCacheEntry = {
  expiresAt: number;
  rows: string[][];
};
type SpreadsheetSheet = {
  properties?: {
    title?: string | null;
  } | null;
};
type SpreadsheetSheetsCacheEntry = {
  expiresAt: number;
  sheets: SpreadsheetSheet[];
};

const sheetId = process.env.GOOGLE_SHEET_ID;
const SHEET_CACHE_TTL_MS = 12_000;
const SHEET_SETUP_TTL_MS = 5 * 60_000;
const rowCache = new Map<TabName, SheetCacheEntry>();
const rowRequestCache = new Map<TabName, Promise<string[][]>>();
let spreadsheetSheetsCache: SpreadsheetSheetsCacheEntry | null = null;
let spreadsheetSheetsRequest: Promise<SpreadsheetSheetsCacheEntry["sheets"]> | null = null;
let portalSetupPromise: Promise<void> | null = null;
let portalSetupExpiresAt = 0;

function requireSheetId() {
  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is missing.");
  }

  return sheetId;
}

function mapRowsToObjects<T extends readonly string[]>(
  headers: T,
  rows: string[][],
): Array<Record<T[number], string>> {
  return rows.map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])) as Record<
      T[number],
      string
    >,
  );
}

async function getSpreadsheetSheets() {
  if (spreadsheetSheetsCache && spreadsheetSheetsCache.expiresAt > Date.now()) {
    return spreadsheetSheetsCache.sheets;
  }

  if (spreadsheetSheetsRequest) {
    return spreadsheetSheetsRequest;
  }

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = requireSheetId();
  spreadsheetSheetsRequest = sheets.spreadsheets
    .get({ spreadsheetId })
    .then((response) => {
      const data = response.data.sheets ?? [];
      spreadsheetSheetsCache = {
        expiresAt: Date.now() + SHEET_CACHE_TTL_MS,
        sheets: data,
      };
      return data;
    })
    .finally(() => {
      spreadsheetSheetsRequest = null;
    });

  return spreadsheetSheetsRequest;
}

function invalidateSpreadsheetSheetsCache() {
  spreadsheetSheetsCache = null;
}

async function ensureTabExists(tabName: string) {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = requireSheetId();
  const existingSheets = await getSpreadsheetSheets();
  const exists = existingSheets.some((sheet) => sheet.properties?.title === tabName);

  if (!exists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: tabName,
              },
            },
          },
        ],
      },
    });
    invalidateSpreadsheetSheetsCache();
  }
}

async function getRows(tabName: TabName) {
  const cached = rowCache.get(tabName);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.rows;
  }

  const pendingRequest = rowRequestCache.get(tabName);
  if (pendingRequest) {
    return pendingRequest;
  }

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = requireSheetId();
  const request = sheets.spreadsheets.values
    .get({
      spreadsheetId,
      range: `${tabName}!A:Z`,
    })
    .then((response) => {
      const rows = response.data.values ?? [];
      rowCache.set(tabName, {
        expiresAt: Date.now() + SHEET_CACHE_TTL_MS,
        rows,
      });
      return rows;
    })
    .finally(() => {
      rowRequestCache.delete(tabName);
    });

  rowRequestCache.set(tabName, request);
  return request;
}

function invalidateTabCache(tabName: TabName) {
  rowCache.delete(tabName);
  rowRequestCache.delete(tabName);
}

async function ensureHeaderRow(tabName: TabName, headers: readonly string[]) {
  await ensureTabExists(tabName);

  const sheets = getGoogleSheetsClient();
  const spreadsheetId = requireSheetId();
  const rows = await getRows(tabName);

  if (rows.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [Array.from(headers)],
      },
    });
    invalidateTabCache(tabName);
    return;
  }

  const headerMismatch = headers.some((header, index) => rows[0]?.[index] !== header);
  if (headerMismatch) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [Array.from(headers)],
      },
    });
    invalidateTabCache(tabName);
  }
}

async function appendRow(tabName: TabName, row: string[]) {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = requireSheetId();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });

  invalidateTabCache(tabName);
}

function buildRegistrationNumber(rowCount: number) {
  return `TUL-REG-${String(rowCount + 1).padStart(5, "0")}`;
}

function buildCertificateCode(courseName: string, rowCount: number) {
  const shortCode = courseName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase()
    .slice(0, 4) || "CERT";

  return `TUL/${shortCode}/${new Date().getFullYear()}/${String(rowCount + 1).padStart(4, "0")}`;
}

function normalizeBoolean(value: string) {
  return value.trim().toLowerCase() === "true";
}

function normalizeMoney(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function ensurePortalSheetsSetup() {
  if (portalSetupExpiresAt > Date.now()) {
    return;
  }

  if (!portalSetupPromise) {
    portalSetupPromise = (async () => {
      await ensureHeaderRow(SHEET_TABS.students, STUDENT_HEADERS);
      await ensureHeaderRow(SHEET_TABS.enrollments, ENROLLMENT_HEADERS);
      await ensureHeaderRow(SHEET_TABS.certificates, CERTIFICATE_HEADERS);
      await ensureHeaderRow(SHEET_TABS.payments, PAYMENT_HEADERS);
      await ensureHeaderRow(SHEET_TABS.courses, COURSE_HEADERS);

      const existingCourses = await listCourses();
      if (existingCourses.length === 0) {
        for (const courseName of courses) {
          await appendRow(SHEET_TABS.courses, [
            `COURSE-${courseName.replaceAll(" ", "-").toUpperCase()}`,
            courseName,
            "",
            "",
            "TRUE",
          ]);
        }
      }

      portalSetupExpiresAt = Date.now() + SHEET_SETUP_TTL_MS;
    })().finally(() => {
      portalSetupPromise = null;
    });
  }

  await portalSetupPromise;
}

export async function listStudents() {
  const rows = await getRows(SHEET_TABS.students);
  return mapRowsToObjects(STUDENT_HEADERS, rows.slice(1));
}

export async function listEnrollments() {
  const rows = await getRows(SHEET_TABS.enrollments);
  return mapRowsToObjects(ENROLLMENT_HEADERS, rows.slice(1));
}

export async function listCertificates() {
  const rows = await getRows(SHEET_TABS.certificates);
  return mapRowsToObjects(CERTIFICATE_HEADERS, rows.slice(1));
}

export async function listPayments() {
  const rows = await getRows(SHEET_TABS.payments);
  return mapRowsToObjects(PAYMENT_HEADERS, rows.slice(1));
}

export async function listCourses() {
  const rows = await getRows(SHEET_TABS.courses);
  return mapRowsToObjects(COURSE_HEADERS, rows.slice(1));
}

export async function findStudentById(studentId: string) {
  const students = await listStudents();
  return students.find((student) => student.student_id === studentId) ?? null;
}

export async function findEnrollmentById(enrollmentId: string) {
  const enrollments = await listEnrollments();
  return enrollments.find((enrollment) => enrollment.enrollment_id === enrollmentId) ?? null;
}

export async function findStudentByAuthIdOrEmail({
  authUserId,
  email,
}: {
  authUserId?: string;
  email?: string;
}) {
  const students = await listStudents();
  const normalizedEmail = email?.trim().toLowerCase();

  return (
    students.find((student) =>
      authUserId ? student.auth_user_id === authUserId : false,
    ) ??
    students.find((student) =>
      normalizedEmail ? student.email.trim().toLowerCase() === normalizedEmail : false,
    ) ??
    null
  );
}

export async function createStudentRegistration(input: {
  authUserId: string;
  fullName: string;
  fatherName: string;
  cnicBForm: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  gender: string;
  dateOfBirth: string;
  education: string;
  selectedCourse: string;
  profileImageOneLink?: string;
  profileImageTwoLink?: string;
}) {
  await ensurePortalSheetsSetup();

  const existingStudent = await findStudentByAuthIdOrEmail({
    authUserId: input.authUserId,
    email: input.email,
  });

  if (existingStudent) {
    return existingStudent;
  }

  const students = await listStudents();
  const studentId = randomUUID();
  const createdAt = new Date().toISOString();
  const registrationNo = buildRegistrationNumber(students.length);

  const studentRow: StudentRecord = {
    student_id: studentId,
    auth_user_id: input.authUserId,
    registration_no: registrationNo,
    full_name: input.fullName,
    father_name: input.fatherName,
    cnic_bform: input.cnicBForm,
    phone: input.phone,
    email: input.email,
    address: input.address,
    city: input.city,
    gender: input.gender,
    date_of_birth: input.dateOfBirth,
    education: input.education,
    profile_image_1_drive_link: input.profileImageOneLink ?? "",
    profile_image_2_drive_link: input.profileImageTwoLink ?? "",
    created_at: createdAt,
    created_by: "student-self-registration",
  };

  await appendRow(
    SHEET_TABS.students,
    STUDENT_HEADERS.map((header) => studentRow[header]),
  );

  const enrollmentRow: EnrollmentRecord = {
    enrollment_id: randomUUID(),
    student_id: studentId,
    course_id: `COURSE-${input.selectedCourse.replaceAll(" ", "-").toUpperCase()}`,
    course_name: input.selectedCourse,
    enrollment_date: createdAt,
    status: "active",
    fee_status: "unpaid",
    course_completed: "FALSE",
    notes: "Created through student self-registration.",
  };

  await appendRow(
    SHEET_TABS.enrollments,
    ENROLLMENT_HEADERS.map((header) => enrollmentRow[header]),
  );

  return studentRow;
}

export async function createAdminStudent(input: {
  fullName: string;
  fatherName: string;
  cnicBForm: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  gender: string;
  dateOfBirth: string;
  education: string;
  selectedCourse: string;
  enrollmentStatus: string;
  feeStatus: string;
  courseCompleted: string;
  notes: string;
  profileImageOneLink?: string;
  profileImageTwoLink?: string;
}) {
  await ensurePortalSheetsSetup();

  const existingStudent = await findStudentByAuthIdOrEmail({
    email: input.email,
  });

  const students = await listStudents();
  const studentId = existingStudent?.student_id ?? randomUUID();
  const createdAt = new Date().toISOString();
  const registrationNo = existingStudent?.registration_no || buildRegistrationNumber(students.length);

  if (!existingStudent) {
    const studentRow: StudentRecord = {
      student_id: studentId,
      auth_user_id: "",
      registration_no: registrationNo,
      full_name: input.fullName,
      father_name: input.fatherName,
      cnic_bform: input.cnicBForm,
      phone: input.phone,
      email: input.email,
      address: input.address,
      city: input.city,
      gender: input.gender,
      date_of_birth: input.dateOfBirth,
      education: input.education,
      profile_image_1_drive_link: input.profileImageOneLink ?? "",
      profile_image_2_drive_link: input.profileImageTwoLink ?? "",
      created_at: createdAt,
      created_by: "admin-manual-entry",
    };

    await appendRow(
      SHEET_TABS.students,
      STUDENT_HEADERS.map((header) => studentRow[header]),
    );
  }

  const enrollmentRow: EnrollmentRecord = {
    enrollment_id: randomUUID(),
    student_id: studentId,
    course_id: `COURSE-${input.selectedCourse.replaceAll(" ", "-").toUpperCase()}`,
    course_name: input.selectedCourse,
    enrollment_date: createdAt,
    status: input.enrollmentStatus,
    fee_status: input.feeStatus,
    course_completed: input.courseCompleted.toUpperCase() === "TRUE" ? "TRUE" : "FALSE",
    notes: input.notes || "Created through admin panel.",
  };

  await appendRow(
    SHEET_TABS.enrollments,
    ENROLLMENT_HEADERS.map((header) => enrollmentRow[header]),
  );

  return {
    studentId,
    registrationNo,
    enrollmentId: enrollmentRow.enrollment_id,
  };
}

export async function getStudentDashboardData({
  authUserId,
  email,
}: {
  authUserId?: string;
  email?: string;
}) {
  const student = await findStudentByAuthIdOrEmail({ authUserId, email });
  if (!student) {
    const students = await listStudents();
    const fallbackStudent = students.at(-1) ?? null;

    if (!fallbackStudent) {
      return {
        student: null,
        enrollments: [] as EnrollmentRecord[],
        certificates: [] as CertificateRecord[],
      };
    }

    const [enrollments, certificates] = await Promise.all([
      listEnrollments(),
      listCertificates(),
    ]);

    return {
      student: fallbackStudent,
      enrollments: enrollments.filter(
        (enrollment) => enrollment.student_id === fallbackStudent.student_id,
      ),
      certificates: certificates.filter(
        (certificate) => certificate.student_id === fallbackStudent.student_id,
      ),
    };
  }

  const [enrollments, certificates] = await Promise.all([
    listEnrollments(),
    listCertificates(),
  ]);

  return {
    student,
    enrollments: enrollments.filter(
      (enrollment) => enrollment.student_id === student.student_id,
    ),
    certificates: certificates.filter(
      (certificate) => certificate.student_id === student.student_id,
    ),
  };
}

export async function getAdminDashboardData() {
  const [students, enrollments, certificates, payments] = await Promise.all([
    listStudents(),
    listEnrollments(),
    listCertificates(),
    listPayments(),
  ]);

  const completedCourses = enrollments.filter(
    (item) =>
      item.status.toLowerCase() === "completed" ||
      normalizeBoolean(item.course_completed),
  ).length;

  const pendingCertificates = certificates.filter(
    (item) => item.admin_approved.toLowerCase() !== "true",
  ).length;

  const issuedCertificates = certificates.filter(
    (item) => item.admin_approved.toLowerCase() === "true",
  ).length;

  const paidCertificationFees = payments
    .filter(
      (payment) =>
        payment.payment_type.trim().toLowerCase() === "certificate" &&
        payment.status.trim().toLowerCase() === "paid",
    )
    .reduce((total, payment) => total + normalizeMoney(payment.amount), 0);

  return {
    stats: [
      { label: "Total students", value: String(students.length) },
      { label: "Total enrollments", value: String(enrollments.length) },
      { label: "Completed courses", value: String(completedCourses) },
      { label: "Pending certificates", value: String(pendingCertificates) },
      { label: "Issued certificates", value: String(issuedCertificates) },
      {
        label: "Paid certification fees",
        value: `PKR ${paidCertificationFees.toLocaleString()}`,
      },
    ],
    recentCertificates: certificates
      .slice(-5)
      .reverse()
      .map((record) => ({
        studentName:
          students.find((student) => student.student_id === record.student_id)?.full_name ??
          "Unknown Student",
        course: record.course_name,
        certificateId: record.certificate_code || record.certificate_id,
        status:
          record.admin_approved.toLowerCase() === "true" ? "Approved" : "Pending",
      })),
  };
}

export async function getAdminStudentDirectory() {
  const [students, enrollments, certificates] = await Promise.all([
    listStudents(),
    listEnrollments(),
    listCertificates(),
  ]);

  return students.map((student) => {
    const studentEnrollments = enrollments.filter(
      (enrollment) => enrollment.student_id === student.student_id,
    );
    const studentCertificates = certificates.filter(
      (certificate) => certificate.student_id === student.student_id,
    );

    return {
      ...student,
      totalCourses: studentEnrollments.length,
      latestCourse: studentEnrollments.at(-1)?.course_name ?? "Not enrolled",
      latestFeeStatus: studentEnrollments.at(-1)?.fee_status ?? "N/A",
      certificatesIssued: studentCertificates.filter(
        (certificate) => certificate.admin_approved.toLowerCase() === "true",
      ).length,
    };
  });
}

export async function getCertificateWorkspace() {
  const [students, enrollments, certificates] = await Promise.all([
    listStudents(),
    listEnrollments(),
    listCertificates(),
  ]);

  return {
    students,
    enrollments,
    certificates: certificates
      .slice()
      .reverse()
      .map((certificate) => {
        const student = students.find((item) => item.student_id === certificate.student_id);
        return {
          ...certificate,
          student_name: student?.full_name ?? "Unknown Student",
          father_name: student?.father_name ?? "",
          registration_no: student?.registration_no ?? "",
        };
      }),
  };
}

export async function createCertificateRecord(input: {
  studentId: string;
  enrollmentId: string;
  courseName: string;
  issueDate: string;
  certificateFeeStatus: string;
  adminApproved: boolean;
  publicVisible: boolean;
  createdBy: string;
}) {
  await ensurePortalSheetsSetup();

  const [student, enrollment, certificates] = await Promise.all([
    findStudentById(input.studentId),
    findEnrollmentById(input.enrollmentId),
    listCertificates(),
  ]);

  if (!student) {
    throw new Error("Selected student could not be found.");
  }

  if (!enrollment) {
    throw new Error("Selected enrollment could not be found.");
  }

  const existingCertificate = certificates.find(
    (certificate) => certificate.enrollment_id === input.enrollmentId,
  );

  if (existingCertificate) {
    return existingCertificate;
  }

  const certificateId = randomUUID();
  const certificateCode = buildCertificateCode(input.courseName, certificates.length);
  const row: CertificateRecord = {
    certificate_id: certificateId,
    student_id: input.studentId,
    enrollment_id: input.enrollmentId,
    certificate_code: certificateCode,
    course_name: input.courseName,
    issue_date: input.issueDate,
    certificate_fee_status: input.certificateFeeStatus,
    admin_approved: input.adminApproved ? "TRUE" : "FALSE",
    public_visible: input.publicVisible ? "TRUE" : "FALSE",
    qr_value: certificateCode,
    pdf_drive_link: "",
    print_count: "0",
    created_by: input.createdBy,
  };

  await appendRow(
    SHEET_TABS.certificates,
    CERTIFICATE_HEADERS.map((header) => row[header]),
  );

  if (input.certificateFeeStatus.toLowerCase() === "paid") {
    const paymentRow = {
      payment_id: randomUUID(),
      student_id: input.studentId,
      enrollment_id: input.enrollmentId,
      payment_type: "certificate",
      amount: "",
      status: "paid",
      payment_date: input.issueDate,
      notes: `Certificate fee marked paid for ${certificateCode}.`,
    };

    await appendRow(
      SHEET_TABS.payments,
      PAYMENT_HEADERS.map((header) => paymentRow[header]),
    );
  }

  return row;
}

export async function getCertificateById(certificateId: string) {
  const workspace = await getCertificateWorkspace();
  return (
    workspace.certificates.find(
      (certificate) =>
        certificate.certificate_id === certificateId ||
        certificate.certificate_code === certificateId,
    ) ?? null
  );
}

function normalizeVerificationValue(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function findVerificationRecord(input: {
  query: string;
  fullName: string;
  fatherName: string;
}) {
  const trimmedQuery = normalizeVerificationValue(input.query);
  const fullName = normalizeVerificationValue(input.fullName);
  const fatherName = normalizeVerificationValue(input.fatherName);

  if (!trimmedQuery || !fullName || !fatherName) {
    return null;
  }

  const workspace = await getCertificateWorkspace();
  const matchesStudentIdentity = (studentName: string, studentFatherName: string) =>
    normalizeVerificationValue(studentName) === fullName &&
    normalizeVerificationValue(studentFatherName) === fatherName;

  const byCertificate = workspace.certificates.find((certificate) => {
    const isPublic = certificate.public_visible.toLowerCase() === "true";
    const isApproved = certificate.admin_approved.toLowerCase() === "true";
    const isPaid = certificate.certificate_fee_status.toLowerCase() === "paid";

    return (
      isPublic &&
      isApproved &&
      isPaid &&
      normalizeVerificationValue(certificate.certificate_code) === trimmedQuery &&
      matchesStudentIdentity(certificate.student_name, certificate.father_name)
    );
  });

  if (byCertificate) {
    return byCertificate;
  }

  const student = workspace.students.find(
    (item) =>
      normalizeVerificationValue(item.registration_no) === trimmedQuery &&
      matchesStudentIdentity(item.full_name, item.father_name),
  );

  if (!student) {
    return null;
  }

  return (
    workspace.certificates.find((certificate) => {
      const isPublic = certificate.public_visible.toLowerCase() === "true";
      const isApproved = certificate.admin_approved.toLowerCase() === "true";
      const isPaid = certificate.certificate_fee_status.toLowerCase() === "paid";

      return (
        certificate.student_id === student.student_id && isPublic && isApproved && isPaid
      );
    }) ?? null
  );
}

export async function initializeSheetsForPortal() {
  await ensurePortalSheetsSetup();
}
