import express from "express";
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

// @route  GET /api/portfolio  (public)
router.get("/", async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = { published: true };
    // SECURITY: only accept a known, plain-string category. Express's query
    // parser turns bracket syntax (e.g. ?category[$ne]=null) into an object,
    // which would otherwise flow straight into this Mongoose filter.
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

// @route  GET /api/portfolio/admin  (admin - includes unpublished)
router.get("/admin", protect, adminOnly, async (req, res, next) => {
  try {
    const projects = await Portfolio.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
});

// @route  GET /api/portfolio/:slug  (public)
router.get("/:slug", async (req, res, next) => {
  try {
    const project = await Portfolio.findOne({ slug: req.params.slug, published: true });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    res.json({ success: true, project });
  } catch (err) {
    next(err);
  }
});

// @route  POST /api/portfolio  (admin)
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

// @route  PUT /api/portfolio/:id  (admin)
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

// @route  DELETE /api/portfolio/:id  (admin)
router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    const project = await Portfolio.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    await deleteUploadedFiles([project.coverImage, ...(project.images || [])]);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
