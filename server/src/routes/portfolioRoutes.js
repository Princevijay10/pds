import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import Portfolio from "../models/Portfolio.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { deleteUploadedFiles } from "../utils/deleteUploadedFile.js";

const router = express.Router();

const PORTFOLIO_CATEGORIES = [
  "Website Design",
  "Website Development",
  "Graphic Design",
  "Social Media Design",
  "Logo & Brand Identity",
  "Other",
];

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get("/", async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = { published: true };
    if (typeof category === "string" && PORTFOLIO_CATEGORIES.includes(category)) {
      filter.category = category;
    }
    if (featured === "true") filter.featured = true;
    const projects = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
});

router.get("/admin", protect, adminOnly, async (req, res, next) => {
  try {
    const projects = await Portfolio.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const project = await Portfolio.findOne({ slug: req.params.slug, published: true });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  protect,
  adminOnly,
  [
    body("title").trim().notEmpty(),
    body("category").notEmpty().isIn(PORTFOLIO_CATEGORIES),
    body("description").notEmpty(),
    body("coverImage").notEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }
      const project = await Portfolio.create(req.body);
      res.status(201).json({ success: true, project });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  "/:id",
  protect,
  adminOnly,
  [
    body("title").trim().notEmpty(),
    body("category").notEmpty().isIn(PORTFOLIO_CATEGORIES),
    body("description").notEmpty(),
    body("coverImage").notEmpty(),
  ],
  async (req, res, next) => {
    try {
      if (!isValidId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid portfolio ID" });
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }
      const project = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!project) return res.status(404).json({ success: false, message: "Project not found" });
      res.json({ success: true, project });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid portfolio ID" });
    }
    const project = await Portfolio.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    await deleteUploadedFiles([project.coverImage, ...(project.images || [])]);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
