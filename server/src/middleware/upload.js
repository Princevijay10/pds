import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // SVG is intentionally excluded because it can contain executable XML.
  const allowedExtensions = new Set([".jpeg", ".jpg", ".png", ".webp", ".gif"]);
  const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ]);

  const extension = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.has(extension) && allowedMimeTypes.has(file.mimetype)) {
    return cb(null, true);
  }

  cb(new Error("Only image files (JPG, PNG, WEBP, GIF) are allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});
