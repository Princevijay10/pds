import express from "express";
import mongoose from "mongoose";
import { body, validationResult } from "express-validator";
import rateLimit from "express-rate-limit";
import Testimonial from "../models/Testimonial.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { deleteUploadedFile } from "../utils/deleteUploadedFile.js";

const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const testimonialCreateValidators = [
  body("clientName").trim().notEmpty().withMessage("Name is required").isLength({ max: 80 }),
  body("message").trim().isLength({ min: 10, max: 1000 }).withMessage("Review must be between 10 and 1000 characters"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
];

const testimonialUpdateValidators = [
  body("clientName").optional().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 80 }),
  body("message").optional().trim().isLength({ min: 10, max: 1000 }).withMessage("Review must be between 10 and 1000 characters"),
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("published").optional().isBoolean().withMessage("published must be true or false"),
];

const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many reviews submitted. Please try again later.",
  },
});

router.get("/", async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ published: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, testimonials });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/public",
  reviewLimiter,
  [
    body("clientName").trim().notEmpty().withMessage("Name is required").isLength({ max: 80 }).withMessage("Name is too long"),
    body("email").optional({ values: "falsy" }).isEmail().withMessage("Please enter a valid email"),
    body("message").trim().isLength({ min: 10, max: 1000 }).withMessage("Review must be between 10 and 1000 characters"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: errors.array()[0].msg });
      }

      const { clientName, email, role, company, message, rating } = req.body;
      const testimonial = await Testimonial.create({
        clientName,
        email,
        role,
        company,
        message,
        rating,
        published: false,
        source: "customer",
      });

      res.status(201).json({
        success: true,
        message: "Thank you for your review! It has been submitted for approval.",
        testimonial: { id: testimonial._id, clientName: testimonial.clientName },
      });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/admin", protect, adminOnly, async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, testimonials });
  } catch (err) {
    next(err);
  }
});

router.post("/", protect, adminOnly, testimonialCreateValidators, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const testimonial = await Testimonial.create({
      ...req.body,
      source: "admin",
    });

    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", protect, adminOnly, testimonialUpdateValidators, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid testimonial ID" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    res.json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid testimonial ID" });
    }
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Testimonial not found" });
    }

    await deleteUploadedFile(testimonial.avatar);
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (err) {
    next(err);
  }
});

export default router;
