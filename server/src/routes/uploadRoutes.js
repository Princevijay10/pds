import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// @route  POST /api/upload  (admin) - single image upload
router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ success: true, url });
});

// @route  POST /api/upload/multiple  (admin) - up to 10 images
router.post("/multiple", protect, adminOnly, upload.array("images", 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: "No files uploaded" });
  }
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.status(201).json({ success: true, urls });
});

export default router;
