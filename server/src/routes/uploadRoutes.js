import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
} from "../config/cloudinary.js";

const router = express.Router();

const ensureCloudinary = (res) => {
  if (!isCloudinaryConfigured()) {
    res.status(503).json({
      success: false,
      message:
        "Image storage is not configured. Add the Cloudinary environment variables in Render.",
    });
    return false;
  }
  return true;
};

const uploadOne = async (file) => {
  const result = await uploadBufferToCloudinary(file.buffer, file.originalname);
  return result.secure_url;
};

// @route POST /api/upload (admin) - single image upload
router.post("/", protect, adminOnly, upload.single("image"), async (req, res, next) => {
  try {
    if (!ensureCloudinary(res)) return;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const url = await uploadOne(req.file);

    return res.status(201).json({
      success: true,
      url,
      storage: "cloudinary",
    });
  } catch (error) {
    next(error);
  }
});

// @route POST /api/upload/multiple (admin) - up to 10 images
router.post(
  "/multiple",
  protect,
  adminOnly,
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      if (!ensureCloudinary(res)) return;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const urls = [];

      for (const file of req.files) {
        urls.push(await uploadOne(file));
      }

      return res.status(201).json({
        success: true,
        urls,
        count: urls.length,
        storage: "cloudinary",
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
