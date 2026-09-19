import { v2 as cloudinary } from "cloudinary";

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const ensureCloudinaryConfig = () => {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export { isCloudinaryConfigured };

export const uploadBufferToCloudinary = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    try {
      ensureCloudinaryConfig();
    } catch (error) {
      reject(error);
      return;
    }

    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 80);

    const publicId = `${baseName || "image"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pds/services",
        public_id: publicId,
        resource_type: "image",
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export default cloudinary;
