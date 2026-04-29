# Tech Upskill Learn Portal

Next.js portal scaffold for:

- `Student Panel`
- `Admin Panel`
- `Supabase Auth`
- `Supabase Storage` for student images
- `Google Sheets` as the main database
- `Google Drive` reserved for future certificate files if needed

## Current Status

This repository already includes:

- separate student and admin routes
- admin login page prepared for only `two allowed Gmail accounts`
- student registration form scaffold
- student dashboard scaffold
- admin dashboard scaffold
- public certificate verification page scaffold
- environment file template for Supabase and Google integration
- profile image uploads stored in Supabase Storage and linked from Google Sheets
- production-safe security headers and reduced Google Sheets read churn

## Routes

- `/`
- `/student/login`
- `/student/register`
- `/student/dashboard`
- `/admin/login`
- `/admin/dashboard`
- `/verify`
- `/setup`

## Local Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Run lint:

```bash
npm run lint
```

Build production bundle:

```bash
npm run build
```

## Environment Setup

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PROFILE_IMAGES_BUCKET=student-profile-images
ADMIN_ALLOWED_EMAILS=admin1@gmail.com,admin2@gmail.com
GOOGLE_PROJECT_ID=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
GOOGLE_DRIVE_PARENT_FOLDER_ID=
```

## What You Need To Provide Next

To connect the real system, you will need:

1. `Two admin Gmail addresses`
2. `Supabase project URL`
3. `Supabase anon key`
4. `Supabase service role key`
5. `Supabase public storage bucket for profile images`
6. `Google Sheets spreadsheet ID`
7. `Google service account credentials`

## Recommended Google Spreadsheet Tabs

Inside one spreadsheet file:

- `Students`
- `Enrollments`
- `Certificates`
- `Payments`
- `Courses`

## Notes

- Admin can later add old/completed students directly into the Google Sheets database.
- Student and admin image uploads are stored in `Supabase Storage`, and the saved public URL is stored in `Google Sheets`.
- Accepted profile image formats are `JPG`, `PNG`, and `WebP` up to `200 KB`.
- Public verification should only display approved certificates with paid certification fees.

## Supabase Storage Setup

Create a bucket on the Supabase free plan:

1. Open your Supabase project.
2. Go to `Storage`.
3. Create a new bucket named `student-profile-images` or any name you prefer.
4. Mark the bucket as `Public`.
5. If you use a different bucket name, set `SUPABASE_PROFILE_IMAGES_BUCKET` in `.env.local`.

The server uploads files with the service role key, and the app stores the public URL in Google Sheets.
