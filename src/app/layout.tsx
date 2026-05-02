import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Great_Vibes } from "next/font/google";
import { INSTITUTE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${INSTITUTE_NAME} Portal`,
    template: `%s | ${INSTITUTE_NAME}`,
  },
  description:
    "Student and administration portal for admissions, enrollments, payments, and verified certification.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${INSTITUTE_NAME} Portal`,
    description:
      "Student and administration portal for admissions, enrollments, payments, and verified certification.",
    url: SITE_URL,
    siteName: INSTITUTE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${INSTITUTE_NAME} Portal`,
    description:
      "Student and administration portal for admissions, enrollments, payments, and verified certification.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} ${greatVibes.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
