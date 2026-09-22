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

const DEFAULT_PROJECTS = [
  {
    title: "Prince Digital Studio",
    category: "Website Development",
    description: "PDS की अपनी official website। इसमें modern UI, responsive design, services, portfolio और contact functionality है.",
    coverImage: "/portfolio/prince-digital-studio.svg",
    liveUrl: "https://princedigitalstudio.onrender.com/",
    tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    featured: true,
    published: true,
    order: 1,
  },
  {
    title: "Rajasthan Shiksha Mahavidyalaya",
    category: "Website Development",
    description: "RSM के लिए institutional website, जिसमें college information, academics, activities, gallery और contact-related sections हैं.",
    coverImage: "/portfolio/rsm.svg",
    liveUrl: "https://rsmjaipur.page.gd/",
    tags: ["HTML", "CSS", "JavaScript", "PHP", "Responsive Design"],
    featured: true,
    published: true,
    order: 2,
  },
  {
    title: "ResumeGeniusAI",
    category: "Website Development",
    description: "Resume बनाने, manage करने और career/job-related suggestions देने वाला full-stack project.",
    coverImage: "/portfolio/resumegeniusai.svg",
    liveUrl: "https://github.com/Princevijay10/resume-genius-ai",
    tags: ["React", "Node.js", "Express", "MongoDB", "AI API"],
    featured: true,
    published: true,
    order: 3,
  },
];

const ensureDefaultProjects = async () => {
  await Promise.all(
    DEFAULT_PROJECTS.map((project) =>
      Portfolio.updateOne(
        { title: project.title },
        { $set: project },
        { upsert: true, runValidators: true }
      )
    )
  );
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const optionalUrl = (value) => value === undefined || value === null || value === "" || /^https?:\/\/[^\s]+$/i.test(value);

router.get("/", async (req, res, next) => {
  try {
    // Keep the public portfolio self-healing so deployment/startup timing or an
    // empty MongoDB collection cannot leave the public page with only one card.
    await ensureDefaultProjects();

    const { category, featured } = req.query;
    const filter = { published: true };
    if (typeof category === "string" && PORTFOLIO_CATEGORIES.includes(category)) filter.category = category;
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

router.get("/stats", async (req, res, next) => {
  try {
    const [projectCount, clientCount, turnaround] = await Promise.all([
      Portfolio.countDocuments({ published: true }),
      Portfolio.aggregate([
        { $match: { published: true, client: { $type: "string", $ne: "" } } },
        { $group: { _id: { $toLower: { $trim: { input: "$client" } } } } },
        { $count: "count" },
      ]),
      Portfolio.aggregate([
        { $match: { published: true, deliveryDays: { $gte: 1 } } },
        { $group: { _id: null, average: { $avg: "$deliveryDays" }, count: { $sum: 1 } } },
      ]),
    ]);

    let yearsOfCraft = null;
    if (process.env.PDS_START_DATE) {
      const startDate = new Date(process.env.PDS_START_DATE);
      const now = new Date();
      if (!Number.isNaN(startDate.getTime()) && startDate <= now) {
        const millisecondsPerYear = 365.2425 * 24 * 60 * 60 * 1000;
        yearsOfCraft = Math.floor((now - startDate) / millisecondsPerYear);
      }
    }

    const averageTurnaround = turnaround[0]?.average ? Math.round(turnaround[0].average) : null;

    res.json({
      success: true,
      stats: {
        projectsDelivered: projectCount,
        happyClients: clientCount[0]?.count || 0,
        yearsOfCraft,
        avgTurnaroundDays: averageTurnaround,
        turnaroundSampleSize: turnaround[0]?.count || 0,
      },
    });
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
    body("liveUrl").optional({ values: "falsy" }).custom(optionalUrl).withMessage("Live URL must be a valid http(s) URL"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
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
    body("liveUrl").optional({ values: "falsy" }).custom(optionalUrl).withMessage("Live URL must be a valid http(s) URL"),
  ],
  async (req, res, next) => {
    try {
      if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid portfolio ID" });
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });
      const project = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!project) return res.status(404).json({ success: false, message: "Project not found" });
      res.json({ success: true, project });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid portfolio ID" });
    const project = await Portfolio.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });
    await deleteUploadedFiles([project.coverImage, ...(project.images || [])]);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
