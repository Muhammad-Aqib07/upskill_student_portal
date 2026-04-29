import { randomUUID } from "node:crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_IMAGE_SIZE_BYTES = 200 * 1024;
const PROFILE_IMAGES_BUCKET =
  process.env.SUPABASE_PROFILE_IMAGES_BUCKET?.trim() || "student-profile-images";

export class UploadValidationError extends Error {
  status = 400;
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function sanitizePrefix(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildUploadPrefix(fullName: string) {
  const safeName = sanitizePrefix(fullName) || "student";
  return `${safeName}-${randomUUID()}`;
}

function validateExistingLink(link: string, label: string) {
  if (!link) {
    return "";
  }

  try {
    return new URL(link).toString();
  } catch {
    throw new UploadValidationError(`${label} must be a valid URL.`);
  }
}

function validateImageFile(file: File | null, label: string, required: boolean) {
  if (!file || file.size === 0) {
    if (required) {
      throw new UploadValidationError(`${label} is required.`);
    }

    return null;
  }

  if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
    throw new UploadValidationError(
      `${label} must be a JPG, PNG, or WebP image.`,
    );
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new UploadValidationError(
      `${label} must be 200 KB or smaller.`,
    );
  }

  return file;
}

async function uploadImageFile(file: File, prefix: string) {
  const supabase = createSupabaseAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${prefix}/${sanitizeFileName(file.name)}`;
  const contentType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_IMAGES_BUCKET)
    .upload(filePath, buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(filePath);
  if (!data.publicUrl) {
    throw new Error("Supabase Storage upload succeeded but no public URL was returned.");
  }

  return data.publicUrl;
}

function getUploadWarningMessage(index: 1 | 2) {
  return `Profile image ${index} could not be uploaded. Student registration was saved without that image. Create a public Supabase Storage bucket for profile images and confirm the service role key is configured.`;
}

export async function storeProfileImages(input: {
  fullName: string;
  profileImageOneFile: File | null;
  profileImageTwoFile: File | null;
  profileImageOneLink?: string;
  profileImageTwoLink?: string;
  requirePrimaryImage?: boolean;
}) {
  const uploadPrefix = buildUploadPrefix(input.fullName);
  const primaryFallbackLink = validateExistingLink(
    input.profileImageOneLink?.trim() ?? "",
    "Profile image 1 link",
  );
  const secondaryFallbackLink = validateExistingLink(
    input.profileImageTwoLink?.trim() ?? "",
    "Profile image 2 link",
  );

  const primaryFile = validateImageFile(
    input.profileImageOneFile,
    "Profile image 1",
    Boolean(input.requirePrimaryImage) && !primaryFallbackLink,
  );
  const secondaryFile = validateImageFile(
    input.profileImageTwoFile,
    "Profile image 2",
    false,
  );

  const warnings: string[] = [];

  let profileImageOneLink = primaryFallbackLink;
  let profileImageTwoLink = secondaryFallbackLink;

  if (primaryFile) {
    try {
      profileImageOneLink = await uploadImageFile(primaryFile, `${uploadPrefix}-1`);
    } catch {
      warnings.push(getUploadWarningMessage(1));
    }
  }

  if (secondaryFile) {
    try {
      profileImageTwoLink = await uploadImageFile(secondaryFile, `${uploadPrefix}-2`);
    } catch {
      warnings.push(getUploadWarningMessage(2));
    }
  }

  return {
    profileImageOneLink,
    profileImageTwoLink,
    warnings,
  };
}
