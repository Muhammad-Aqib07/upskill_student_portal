import { google } from "googleapis";

let authClient: InstanceType<typeof google.auth.GoogleAuth> | null = null;
let sheetsClient: ReturnType<typeof google.sheets> | null = null;
let driveClient: ReturnType<typeof google.drive> | null = null;

function getGoogleAuth() {
  if (authClient) {
    return authClient;
  }

  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error("Google service account credentials are missing.");
  }

  authClient = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });

  return authClient;
}

export function getGoogleSheetsClient() {
  if (!sheetsClient) {
    sheetsClient = google.sheets({
      version: "v4",
      auth: getGoogleAuth(),
    });
  }

  return sheetsClient;
}

export function getGoogleDriveClient() {
  if (!driveClient) {
    driveClient = google.drive({
      version: "v3",
      auth: getGoogleAuth(),
    });
  }

  return driveClient;
}
