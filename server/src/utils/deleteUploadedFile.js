import fs from "fs/promises";
import path from "path";

const uploadsDir = path.resolve("uploads");

/**
 * Deletes a file previously saved via the upload middleware, given its public
 * URL (e.g. "/uploads/my-photo-169999.jpg"). Safe to call with anything —
 * external URLs, missing files, malformed input — it just silently no-ops.
 *
 * Path-safety: we only ever take the basename of the URL and re-join it under
 * uploadsDir, then double-check the resolved path is still inside uploadsDir.
 * This means a value like "/uploads/../../etc/passwd" can never escape the
 * uploads folder, no matter what's stored in the database.
 */
export const deleteUploadedFile = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string" || !fileUrl.startsWith("/uploads/")) return;

  const filename = path.basename(fileUrl);
  const filePath = path.join(uploadsDir, filename);

  if (!filePath.startsWith(uploadsDir + path.sep)) return; // extra safety net

  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Failed to delete uploaded file:", filePath, err.message);
    }
  }
};

/**
 * Convenience wrapper for deleting several URLs (e.g. a portfolio item's
 * coverImage plus its images[] gallery) without one failure blocking the rest.
 */
export const deleteUploadedFiles = async (fileUrls = []) => {
  await Promise.all(fileUrls.filter(Boolean).map(deleteUploadedFile));
};
